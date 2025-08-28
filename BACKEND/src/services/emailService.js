const nodemailer = require('nodemailer');

// Email statistics tracking
const emailStats = {
    sent: 0,
    failed: 0,
    lastSent: null,
    errors: []
};

// Rate limiting - prevent spam (max 10 emails per minute per recipient)
const rateLimitMap = new Map();

const checkRateLimit = (email) => {
    const now = Date.now();
    const minute = 60 * 1000;
    
    if (!rateLimitMap.has(email)) {
        rateLimitMap.set(email, []);
    }
    
    const timestamps = rateLimitMap.get(email);
    
    // Remove timestamps older than 1 minute
    const recentTimestamps = timestamps.filter(timestamp => now - timestamp < minute);
    
    if (recentTimestamps.length >= 10) {
        return false; // Rate limit exceeded
    }
    
    recentTimestamps.push(now);
    rateLimitMap.set(email, recentTimestamps);
    return true;
};

// Email configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
            pass: process.env.EMAIL_PASS || 'your-app-password'      // Replace with your app password
        }
    });
};

// Email templates
const emailTemplates = {
    welcome: (userName) => ({
        subject: '🎉 Welcome to DevConnect!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #ffffff;">
                <!-- Mobile-first responsive header -->
                <div style="text-align: center; margin-bottom: 30px; padding: 20px 0;">
                    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin: 0;">DevConnect</div>
                    <p style="color: #666; margin: 8px 0; font-size: 14px;">Connect with fellow developers worldwide</p>
                </div>
                
                <h2 style="color: #333;">Welcome aboard, ${userName}! 🚀</h2>
                
                <p style="color: #555; line-height: 1.6;">
                    We're thrilled to have you join the DevConnect community! You're now part of a vibrant network of developers ready to connect, collaborate, and grow together.
                </p>
                
                <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #4F46E5; margin-top: 0;">What's next?</h3>
                    <ul style="color: #555; line-height: 1.8;">
                        <li>Complete your profile with skills and experience</li>
                        <li>Browse and connect with other developers</li>
                        <li>Send connection requests to start networking</li>
                        <li>Join discussions and share your knowledge</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                       style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Start Connecting
                    </a>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
                    <p>Happy coding!<br>The DevConnect Team</p>
                    <p><a href="${process.env.BACKEND_URL || 'http://localhost:3000'}/unsubscribe/{USER_ID}" style="color: #4F46E5; font-size: 12px;">Unsubscribe from all emails</a></p>
                </div>
            </div>
        `
    }),
    
    connectionRequest: (fromUser, toUser) => ({
        subject: `🤝 ${fromUser.firstName} wants to connect with you on DevConnect`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4F46E5; margin: 0;">DevConnect</h1>
                    <p style="color: #666; margin: 5px 0;">New Connection Request</p>
                </div>
                
                <h2 style="color: #333;">Hi ${toUser.firstName}! 👋</h2>
                
                <p style="color: #555; line-height: 1.6;">
                    <strong>${fromUser.firstName} ${fromUser.lastName}</strong> has sent you a connection request on DevConnect!
                </p>
                
                <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <img src="${fromUser.photoUrl}" alt="${fromUser.firstName}" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 15px; object-fit: cover;">
                        <div>
                            <h3 style="margin: 0; color: #333;">${fromUser.firstName} ${fromUser.lastName}</h3>
                            <p style="margin: 5px 0; color: #666; font-size: 14px;">${fromUser.skills ? fromUser.skills.slice(0, 3).join(' • ') : 'Developer'}</p>
                        </div>
                    </div>
                    <p style="color: #555; margin: 0; font-style: italic;">"${fromUser.about}"</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/requests" 
                       style="background: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                        View Request
                    </a>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile/${fromUser._id}" 
                       style="background: #6B7280; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View Profile
                    </a>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
                    <p>Don't want to receive these emails? <a href="#" style="color: #4F46E5;">Update your preferences</a></p>
                    <p>The DevConnect Team</p>
                </div>
            </div>
        `
    }),
    
    loginSuggestion: (user, suggestedUsers) => ({
        subject: `🔍 Discover new connections on DevConnect`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4F46E5; margin: 0;">DevConnect</h1>
                    <p style="color: #666; margin: 5px 0;">Suggested Connections</p>
                </div>
                
                <h2 style="color: #333;">Welcome back, ${user.firstName}! 🎯</h2>
                
                <p style="color: #555; line-height: 1.6;">
                    We've found some amazing developers who might be great connections for you. Check them out and start building your network!
                </p>
                
                <div style="margin: 20px 0;">
                    ${suggestedUsers.map(suggestedUser => `
                        <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #E5E7EB;">
                            <div style="display: flex; align-items: center;">
                                <img src="${suggestedUser.photoUrl}" alt="${suggestedUser.firstName}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; object-fit: cover;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0; color: #333;">${suggestedUser.firstName} ${suggestedUser.lastName}</h4>
                                    <p style="margin: 5px 0; color: #666; font-size: 14px;">${suggestedUser.skills ? suggestedUser.skills.slice(0, 2).join(' • ') : 'Developer'}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                       style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Explore Connections
                    </a>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
                    <p>Don't want to receive these emails? <a href="#" style="color: #4F46E5;">Update your preferences</a></p>
                    <p>The DevConnect Team</p>
                </div>
            </div>
        `
    })
};

// Email validation helper
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Email sending functions
const sendEmail = async (to, template) => {
    try {
        // Validate email address
        if (!to || !isValidEmail(to)) {
            throw new Error('Invalid email address: ' + to);
        }
        
        // Check rate limit
        if (!checkRateLimit(to)) {
            throw new Error('Rate limit exceeded for email: ' + to);
        }
        
        // Validate template
        if (!template || !template.subject || !template.html) {
            throw new Error('Invalid email template: missing subject or html content');
        }
        
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER && !process.env.EMAIL_PASS) {
            console.warn('⚠️  Email credentials not configured. Email will not be sent.');
            return { success: false, error: 'Email credentials not configured' };
        }
        
        const transporter = createTransporter();
        
        // Verify SMTP connection
        await transporter.verify();
        
        const mailOptions = {
            from: `"DevConnect" <${process.env.EMAIL_USER || 'devconnect@gmail.com'}>`,
            to: to,
            subject: template.subject,
            html: template.html
        };
        
        const result = await transporter.sendMail(mailOptions);
        
        // Update statistics
        emailStats.sent++;
        emailStats.lastSent = new Date();
        
        console.log('✅ Email sent successfully to:', to, '| Message ID:', result.messageId);
        return { success: true, messageId: result.messageId, recipient: to };
    } catch (error) {
        console.error('❌ Error sending email to:', to, '| Error:', error.message);
        
        // Update error statistics
        emailStats.failed++;
        emailStats.errors.push({
            email: to,
            error: error.message,
            timestamp: new Date()
        });
        
        // Keep only last 50 errors
        if (emailStats.errors.length > 50) {
            emailStats.errors = emailStats.errors.slice(-50);
        }
        
        // Categorize error types for better debugging
        let errorType = 'UNKNOWN';
        if (error.message.includes('Invalid login')) {
            errorType = 'AUTH_FAILED';
        } else if (error.message.includes('Network')) {
            errorType = 'NETWORK_ERROR';
        } else if (error.message.includes('Invalid email')) {
            errorType = 'INVALID_EMAIL';
        } else if (error.message.includes('Rate limit')) {
            errorType = 'RATE_LIMITED';
        }
        
        return { 
            success: false, 
            error: error.message, 
            errorType,
            recipient: to 
        };
    }
};

const sendWelcomeEmail = async (user) => {
    const template = emailTemplates.welcome(user.firstName);
    // Replace user ID placeholder in unsubscribe link
    template.html = template.html.replace('{USER_ID}', user._id);
    return await sendEmail(user.emailId, template);
};

const sendConnectionRequestEmail = async (fromUser, toUser) => {
    const template = emailTemplates.connectionRequest(fromUser, toUser);
    // Replace user ID placeholder in unsubscribe link
    template.html = template.html.replace('{USER_ID}', toUser._id);
    return await sendEmail(toUser.emailId, template);
};

const sendLoginSuggestionEmail = async (user, suggestedUsers) => {
    if (suggestedUsers && suggestedUsers.length > 0) {
        const template = emailTemplates.loginSuggestion(user, suggestedUsers);
        // Replace user ID placeholder in unsubscribe link
        template.html = template.html.replace('{USER_ID}', user._id);
        return await sendEmail(user.emailId, template);
    }
    return { success: false, error: 'No suggested users provided' };
};

// Get email statistics
const getEmailStats = () => {
    return {
        ...emailStats,
        rateLimitEntries: rateLimitMap.size,
        successRate: emailStats.sent + emailStats.failed > 0 
            ? ((emailStats.sent / (emailStats.sent + emailStats.failed)) * 100).toFixed(2) + '%'
            : '0%'
    };
};

// Reset email statistics (for testing)
const resetEmailStats = () => {
    emailStats.sent = 0;
    emailStats.failed = 0;
    emailStats.lastSent = null;
    emailStats.errors = [];
    rateLimitMap.clear();
};

module.exports = {
    sendWelcomeEmail,
    sendConnectionRequestEmail,
    sendLoginSuggestionEmail,
    sendEmail,
    getEmailStats,
    resetEmailStats,
    isValidEmail
};
