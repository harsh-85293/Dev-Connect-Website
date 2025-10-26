const {validatesignupdata} = require("../utils/validation")
const express = require("express")
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendLoginSuggestionEmail } = require("../services/emailService");
const redisClient = require("../config/redis");
const kafkaClient = require("../config/kafka");
const isProd = process.env.NODE_ENV === 'production';
const cookieBaseOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
};

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
         
        // Cache user data in Redis
        await redisClient.setUserData(saveduser._id.toString(), {
            _id: saveduser._id,
            firstName: saveduser.firstName,
            lastName: saveduser.lastName,
            emailId: saveduser.emailId,
            photoUrl: saveduser.photoUrl,
            about: saveduser.about,
            skills: saveduser.skills,
            isPremium: saveduser.isPremium,
            membershipTier: saveduser.membershipTier
        });

        // Store session in Redis
        await redisClient.setSession(token, {
            userId: saveduser._id.toString(),
            emailId: saveduser.emailId,
            firstName: saveduser.firstName
        });
         
        //Add a token to cookie and send the response back to the user
        res.cookie("token", token, {
            ...cookieBaseOptions,
            expires: new Date(Date.now() + 8 * 3600000)
        })
        
        // Publish user signup event to Kafka
        await kafkaClient.publishUserEvent('USER_SIGNUP', saveduser._id.toString(), {
            firstName: saveduser.firstName,
            lastName: saveduser.lastName,
            emailId: saveduser.emailId,
            signupTime: new Date().toISOString()
        });
        
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
        
        // Check Redis cache first
        let user = null;
        const cachedUser = await redisClient.get(`user:email:${emailId}`);
        
        if (cachedUser) {
            user = cachedUser;
        } else {
            user = await User.findOne({emailId : emailId})
            if (user) {
                // Cache user data
                await redisClient.setUserData(user._id.toString(), {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId,
                    photoUrl: user.photoUrl,
                    about: user.about,
                    skills: user.skills,
                    isPremium: user.isPremium,
                    membershipTier: user.membershipTier
                });
                // Cache by email for faster login lookup
                await redisClient.set(`user:email:${emailId}`, user._id.toString(), 1800);
            }
        }
        
        if(!user){
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        
        if(isPasswordValid){

            //Create a JWT
            const token =  await user.getJWT();
            console.log(token);
            
            // Store session in Redis
            await redisClient.setSession(token, {
                userId: user._id.toString(),
                emailId: user.emailId,
                firstName: user.firstName
            });
            
            //Add a token to cookie and send the response back to the user
            res.cookie("token", token, {
                ...cookieBaseOptions,
                expires: new Date(Date.now() + 8 * 3600000)
            })
            
            // Publish user login event to Kafka
            await kafkaClient.publishUserEvent('USER_LOGIN', user._id.toString(), {
                emailId: user.emailId,
                loginTime: new Date().toISOString(),
                ipAddress: req.ip
            });
            
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
    try {
        const token = req.cookies.token;
        
        // Clear session from Redis
        if (token) {
            await redisClient.deleteSession(token);
        }
        
        res.clearCookie("token", {
            ...cookieBaseOptions,
            expires: new Date(0),
        })
        res.send("Logout successfull");
    } catch (error) {
        console.error('Error during logout:', error);
        res.clearCookie("token", {
            ...cookieBaseOptions,
            expires: new Date(0),
        })
        res.send("Logout successfull");
    }
})

module.exports = authRouter