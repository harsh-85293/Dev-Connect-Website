const jwt = require("jsonwebtoken");
const User = require("../models/user")
const redisClient = require("../config/redis");

const userAuth = async(req, res, next) => {
    //Read the token from the request cookies
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please login")
        }

        // Check Redis session first
        const sessionData = await redisClient.getSession(token);
        if (sessionData) {
            // Session exists in Redis, get user data from cache or database
            let user = await redisClient.getUserData(sessionData.userId);
            
            if (!user) {
                // User data not in cache, fetch from database
                user = await User.findById(sessionData.userId);
                if (user) {
                    // Cache user data
                    await redisClient.setUserData(sessionData.userId, {
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
                }
            }
            
            if (!user) {
                throw new Error("User not found")
            }
            
            req.user = user;
            return next();
        }

        // Fallback to JWT verification if session not in Redis
        const jwtSecret = process.env.JWT_SECRET || "dev@tinder$790";
        const decodedObj = await jwt.verify(token, jwtSecret)
        
        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found")
        }

        // Cache session and user data for future requests
        await redisClient.setSession(token, {
            userId: user._id.toString(),
            emailId: user.emailId,
            firstName: user.firstName
        });
        
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

        req.user = user;
        next();//this will make the respective function in which it is passed to continue the remaining function
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
    //Find the user

}

module.exports = {
    userAuth
};