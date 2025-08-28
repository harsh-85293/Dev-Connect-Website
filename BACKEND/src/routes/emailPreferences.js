const express = require("express");
const emailPreferencesRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { getEmailStats, resetEmailStats } = require("../services/emailService");

// Get user's email preferences
emailPreferencesRouter.get("/email-preferences", userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('emailPreferences');
        res.json({
            success: true,
            emailPreferences: user.emailPreferences
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error fetching email preferences: " + error.message
        });
    }
});

// Update user's email preferences
emailPreferencesRouter.patch("/email-preferences", userAuth, async (req, res) => {
    try {
        const { welcomeEmail, connectionRequests, loginSuggestions, marketingEmails } = req.body;
        
        const updateData = {};
        if (welcomeEmail !== undefined) updateData['emailPreferences.welcomeEmail'] = welcomeEmail;
        if (connectionRequests !== undefined) updateData['emailPreferences.connectionRequests'] = connectionRequests;
        if (loginSuggestions !== undefined) updateData['emailPreferences.loginSuggestions'] = loginSuggestions;
        if (marketingEmails !== undefined) updateData['emailPreferences.marketingEmails'] = marketingEmails;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('emailPreferences');
        
        res.json({
            success: true,
            message: "Email preferences updated successfully",
            emailPreferences: updatedUser.emailPreferences
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating email preferences: " + error.message
        });
    }
});

// Unsubscribe from all emails (for email links)
emailPreferencesRouter.get("/unsubscribe/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        await User.findByIdAndUpdate(userId, {
            $set: {
                'emailPreferences.welcomeEmail': false,
                'emailPreferences.connectionRequests': false,
                'emailPreferences.loginSuggestions': false,
                'emailPreferences.marketingEmails': false
            }
        });
        
        res.send(`
            <html>
                <head>
                    <title>Unsubscribed - DevConnect</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                        .container { border: 1px solid #ddd; border-radius: 10px; padding: 40px; }
                        .success { color: #10B981; font-size: 24px; margin-bottom: 20px; }
                        .message { color: #555; line-height: 1.6; margin-bottom: 30px; }
                        .btn { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success">✓ Successfully Unsubscribed</div>
                        <p class="message">
                            You have been unsubscribed from all DevConnect email notifications. 
                            You can update your preferences anytime from your account settings.
                        </p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" class="btn">
                            Go to Profile Settings
                        </a>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(400).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h2 style="color: #EF4444;">Error</h2>
                    <p>Failed to unsubscribe. Please try again later.</p>
                </body>
            </html>
        `);
    }
});

// Get email statistics (admin endpoint)
emailPreferencesRouter.get("/email-stats", userAuth, async (req, res) => {
    try {
        const stats = getEmailStats();
        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error fetching email statistics: " + error.message
        });
    }
});

// Reset email statistics (admin endpoint for testing)
emailPreferencesRouter.post("/email-stats/reset", userAuth, async (req, res) => {
    try {
        resetEmailStats();
        res.json({
            success: true,
            message: "Email statistics reset successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error resetting email statistics: " + error.message
        });
    }
});

module.exports = emailPreferencesRouter;
