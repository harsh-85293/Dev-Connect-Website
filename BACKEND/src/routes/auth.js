const {validatesignupdata} = require("../utils/validation")
const express = require("express")
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendLoginSuggestionEmail } = require("../services/emailService");

authRouter.post("/signup", async (req, res) => {
    try {
        //Validate the data
        validatesignupdata(req);

        const { firstName, lastName, emailId, password} = req.body;

        //Encrypt the password
        const passwordhash = await bcrypt.hash(password, 10)
        console.log(passwordhash);
        
        //Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordhash,//hash the passwrod in database
        });

        const saveduser = await user.save();
        const token =  await saveduser.getJWT();
        console.log(token);
         
        //Add a token to cookie and send the response back to the user
        res.cookie("token", token, {
            expiresIn : new Date(Date.now() + 8 * 3600000)
        })
        
        // Send welcome email if user has email preferences enabled
        if (saveduser.emailPreferences.welcomeEmail) {
            try {
                await sendWelcomeEmail(saveduser);
                console.log('Welcome email sent to:', saveduser.emailId);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail the signup if email fails
            }
        }
        
        res.json({message : "User added successfully", data : saveduser});
    } 
    catch (err) {
        res.status(400).send("Error in saving the user:" + err.message);
    }
});

authRouter.post("/login", async(req, res) => {
    try {
        const {emailId, password} = req.body;
        
        const user = await User.findOne({emailId : emailId})
        if(!user){
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        
        if(isPasswordValid){

            //Create a JWT
            const token =  await user.getJWT();
            console.log(token);
            
            //Add a token to cookie and send the response back to the user
            res.cookie("token", token, {
                expiresIn : new Date(Date.now() + 8 * 3600000)
            })
            
            // Send login suggestion email with potential connections
            if (user.emailPreferences.loginSuggestions) {
                try {
                    // Get suggested users (users with similar skills or random users)
                    const suggestedUsers = await User.find({
                        _id: { $ne: user._id }, // Exclude current user
                        $or: [
                            { skills: { $in: user.skills || [] } }, // Users with similar skills
                            {} // If no skills, get random users
                        ]
                    }).limit(3).select('firstName lastName emailId photoUrl skills about');
                    
                    if (suggestedUsers.length > 0) {
                        await sendLoginSuggestionEmail(user, suggestedUsers);
                        console.log('Login suggestion email sent to:', user.emailId);
                    }
                } catch (emailError) {
                    console.error('Failed to send login suggestion email:', emailError);
                    // Don't fail the login if email fails
                }
            }
            
            res.send(user)
        }
        else{
            throw new Error("Invalid password")
        }
    } 
    catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires : new Date(Date.now()), 
    })
    res.send("Logout successfull");
})

module.exports = authRouter