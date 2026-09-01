const {validatesignupdata} = require("../utils/validation")
const express = require("express")
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const admin = require('firebase-admin');
const { sendWelcomeEmail, sendLoginSuggestionEmail } = require("../services/emailService");
const redisClient = require("../config/redis");
const kafkaClient = require("../config/kafka");

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
}
const isProd = process.env.NODE_ENV === 'production';
const cookieBaseOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
};

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const queueOptionalLoginTasks = async (user, req) => {
    try {
        if (!user || !user._id) return;

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

        await redisClient.set(`user:email:${normalizeEmail(user.emailId)}`, user._id.toString(), 1800);

        if (kafkaClient && kafkaClient.isConnected) {
            await kafkaClient.publishUserEvent('USER_LOGIN', user._id.toString(), {
                emailId: user.emailId,
                loginTime: new Date().toISOString(),
                ipAddress: req.ip
            });
        }

        if (user.emailPreferences && user.emailPreferences.loginSuggestions) {
            try {
                const suggestedUsers = await User.find({
                    _id: { $ne: user._id },
                    $or: [
                        { skills: { $in: user.skills || [] } },
                        {}
                    ]
                }).limit(3).select('firstName lastName emailId photoUrl skills about');

                if (suggestedUsers.length > 0) {
                    await sendLoginSuggestionEmail(user, suggestedUsers);
                }
            } catch (emailError) {
                console.error('Failed to send login suggestion email:', emailError);
            }
        }
    } catch (error) {
        console.error('Optional login task failed:', error.message);
    }
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
        const emailInput = req.body?.emailId || "";
        const password = req.body?.password || "";
        const normalizedEmail = normalizeEmail(emailInput);

        let user = null;
        const cachedUserId = await redisClient.get(`user:email:${normalizedEmail}`);

        if (cachedUserId) {
            user = await User.findById(cachedUserId);
        }

        if (!user) {
            user = await User.findOne({ emailId: normalizedEmail });
            if (user) {
                await redisClient.set(`user:email:${normalizedEmail}`, user._id.toString(), 1800);
            }
        }

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = await user.getJWT();

        await redisClient.setSession(token, {
            userId: user._id.toString(),
            emailId: user.emailId,
            firstName: user.firstName
        });

        res.cookie("token", token, {
            ...cookieBaseOptions,
            expires: new Date(Date.now() + 8 * 3600000)
        });

        const safeUser = user.toObject ? user.toObject() : user;
        res.json(safeUser);

        setImmediate(() => {
            queueOptionalLoginTasks(user, req).catch((error) => {
                console.error('Login background task failed:', error.message);
            });
        });
    }
    catch (error) {
        res.status(400).json({ message: "Error : " + error.message });
    }
});

authRouter.post('/auth/google', async (req, res) => {
    try {
        const { token } = req.body || {};

        if (!token) {
            return res.status(400).json({ message: 'Google token is required.' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const email = normalizeEmail(decodedToken.email || '');

        if (!email) {
            return res.status(400).json({ message: 'Google account email is required.' });
        }

        let user = await User.findOne({ emailId: email });

        if (!user) {
            user = await User.create({
                firstName: decodedToken.name?.split(' ')[0] || 'Google',
                lastName: decodedToken.name?.split(' ').slice(1).join(' ') || 'User',
                emailId: email,
                password: await bcrypt.hash(`google-oauth-${Date.now()}`, 10),
                photoUrl: decodedToken.picture || undefined,
            });
        }

        const jwtToken = await user.getJWT();
        await redisClient.setSession(jwtToken, {
            userId: user._id.toString(),
            emailId: user.emailId,
            firstName: user.firstName
        });

        res.cookie('token', jwtToken, {
            ...cookieBaseOptions,
            expires: new Date(Date.now() + 8 * 3600000)
        });

        return res.json({
            message: 'Google login successful',
            user,
        });
    } catch (error) {
        console.error('Google auth failed:', error);
        return res.status(401).json({ message: 'Invalid Google token or authentication failed.' });
    }
});

authRouter.get('/auth/github', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
        return res.status(400).json({ message: 'GitHub OAuth is not configured yet.' });
    }

    const redirectUri = encodeURIComponent(process.env.GITHUB_REDIRECT_URI || `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/github/callback`);
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

    return res.redirect(authUrl);
});

authRouter.get('/auth/github/callback', (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (!req.query.code) {
        return res.redirect(`${frontendUrl}/login?oauth=github&status=failed`);
    }
    return res.redirect(`${frontendUrl}/login?oauth=github&status=ready`);
});

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