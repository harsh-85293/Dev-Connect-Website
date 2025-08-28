#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { sendWelcomeEmail, sendConnectionRequestEmail, sendLoginSuggestionEmail, getEmailStats } = require('../services/emailService');

// Demo configuration
const DEMO_CONFIG = {
    // Change this to your email for testing
    TEST_EMAIL: 'your-email@example.com',
    
    // Demo users data
    demoUsers: [
        {
            firstName: 'John',
            lastName: 'Doe',
            emailId: 'john.doe@example.com', // This will be replaced with TEST_EMAIL
            skills: ['JavaScript', 'React', 'Node.js'],
            about: 'Full-stack developer passionate about creating amazing web applications.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            emailId: 'jane.smith@example.com',
            skills: ['Python', 'Django', 'Machine Learning'],
            about: 'AI/ML engineer with expertise in data science and backend development.',
            photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b14a5cf9?w=150'
        },
        {
            firstName: 'Alice',
            lastName: 'Johnson',
            emailId: 'alice.johnson@example.com',
            skills: ['Vue.js', 'TypeScript', 'GraphQL'],
            about: 'Frontend developer with a passion for beautiful and functional user interfaces.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
        }
    ]
};

class EmailDemo {
    constructor() {
        this.demoUsers = [];
        this.testEmail = DEMO_CONFIG.TEST_EMAIL;
    }

    async connectToDatabase() {
        try {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devconnect');
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            throw error;
        }
    }

    async createDemoUsers() {
        console.log('\n📝 Creating demo users...');
        
        try {
            // Clean up existing demo users
            await User.deleteMany({ emailId: { $in: DEMO_CONFIG.demoUsers.map(u => u.emailId) } });
            
            for (let userData of DEMO_CONFIG.demoUsers) {
                // Replace first user's email with test email
                if (userData.firstName === 'John') {
                    userData.emailId = this.testEmail;
                }
                
                const user = new User({
                    ...userData,
                    password: 'demoPassword123', // Will be hashed automatically
                    emailPreferences: {
                        welcomeEmail: true,
                        connectionRequests: true,
                        loginSuggestions: true,
                        marketingEmails: false
                    }
                });
                
                const savedUser = await user.save();
                this.demoUsers.push(savedUser);
                console.log(`   ✅ Created user: ${userData.firstName} ${userData.lastName}`);
            }
            
            console.log(`✅ Created ${this.demoUsers.length} demo users`);
        } catch (error) {
            console.error('❌ Error creating demo users:', error.message);
            throw error;
        }
    }

    async testWelcomeEmail() {
        console.log('\n📧 Testing Welcome Email...');
        
        try {
            const user = this.demoUsers[0]; // John Doe
            const result = await sendWelcomeEmail(user);
            
            if (result.success) {
                console.log('   ✅ Welcome email sent successfully');
                console.log(`   📤 Sent to: ${result.recipient}`);
                console.log(`   📨 Message ID: ${result.messageId}`);
            } else {
                console.log('   ❌ Welcome email failed:', result.error);
            }
            
            return result;
        } catch (error) {
            console.error('   ❌ Welcome email test error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async testConnectionRequestEmail() {
        console.log('\n🤝 Testing Connection Request Email...');
        
        try {
            const fromUser = this.demoUsers[1]; // Jane Smith
            const toUser = this.demoUsers[0];   // John Doe (test email)
            
            // Create a connection request in database
            const connectionRequest = new ConnectionRequest({
                fromUserId: fromUser._id,
                toUserId: toUser._id,
                status: 'interested'
            });
            
            await connectionRequest.save();
            
            const result = await sendConnectionRequestEmail(fromUser, toUser);
            
            if (result.success) {
                console.log('   ✅ Connection request email sent successfully');
                console.log(`   📤 From: ${fromUser.firstName} ${fromUser.lastName}`);
                console.log(`   📥 To: ${result.recipient}`);
                console.log(`   📨 Message ID: ${result.messageId}`);
            } else {
                console.log('   ❌ Connection request email failed:', result.error);
            }
            
            return result;
        } catch (error) {
            console.error('   ❌ Connection request email test error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async testLoginSuggestionEmail() {
        console.log('\n💡 Testing Login Suggestion Email...');
        
        try {
            const user = this.demoUsers[0]; // John Doe (test email)
            const suggestedUsers = this.demoUsers.slice(1); // Jane and Alice
            
            const result = await sendLoginSuggestionEmail(user, suggestedUsers);
            
            if (result.success) {
                console.log('   ✅ Login suggestion email sent successfully');
                console.log(`   📤 Sent to: ${result.recipient}`);
                console.log(`   👥 Suggested ${suggestedUsers.length} users`);
                console.log(`   📨 Message ID: ${result.messageId}`);
            } else {
                console.log('   ❌ Login suggestion email failed:', result.error);
            }
            
            return result;
        } catch (error) {
            console.error('   ❌ Login suggestion email test error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async showEmailStats() {
        console.log('\n📊 Email Statistics:');
        console.log('=====================');
        
        const stats = getEmailStats();
        console.log(`📤 Emails sent: ${stats.sent}`);
        console.log(`❌ Emails failed: ${stats.failed}`);
        console.log(`📈 Success rate: ${stats.successRate}`);
        console.log(`⏰ Last sent: ${stats.lastSent || 'Never'}`);
        console.log(`🚫 Rate limit entries: ${stats.rateLimitEntries}`);
        
        if (stats.errors.length > 0) {
            console.log(`\n🔍 Recent errors (${stats.errors.length}):`);
            stats.errors.slice(-3).forEach(error => {
                console.log(`   • ${error.email}: ${error.error}`);
            });
        }
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up demo data...');
        
        try {
            // Remove demo users and their connection requests
            const userIds = this.demoUsers.map(u => u._id);
            await ConnectionRequest.deleteMany({
                $or: [
                    { fromUserId: { $in: userIds } },
                    { toUserId: { $in: userIds } }
                ]
            });
            
            await User.deleteMany({ _id: { $in: userIds } });
            
            console.log('✅ Demo data cleaned up');
        } catch (error) {
            console.error('❌ Cleanup error:', error.message);
        }
    }

    async runDemo() {
        console.log('🚀 DevConnect Email System Demo');
        console.log('===============================\n');
        
        // Validate configuration
        if (this.testEmail === 'your-email@example.com') {
            console.error('❌ Please update TEST_EMAIL in the demo configuration before running!');
            console.log('   Edit DEMO_CONFIG.TEST_EMAIL in this file to your email address.');
            return;
        }
        
        try {
            await this.connectToDatabase();
            await this.createDemoUsers();
            
            console.log('\n🎯 Running email tests...');
            console.log('(Check your email inbox for the test emails)\n');
            
            // Run all email tests
            const results = await Promise.all([
                this.testWelcomeEmail(),
                this.testConnectionRequestEmail(),
                this.testLoginSuggestionEmail()
            ]);
            
            // Show statistics
            await this.showEmailStats();
            
            // Summary
            const successful = results.filter(r => r.success).length;
            console.log('\n🎉 Demo Results:');
            console.log('================');
            console.log(`✅ Successful: ${successful}/${results.length}`);
            console.log(`❌ Failed: ${results.length - successful}/${results.length}`);
            
            if (successful > 0) {
                console.log(`\n📬 Check your email (${this.testEmail}) for the test messages!`);
            }
            
            // Cleanup
            await this.cleanup();
            
        } catch (error) {
            console.error('\n💥 Demo failed:', error.message);
        } finally {
            await mongoose.disconnect();
            console.log('\n👋 Demo completed');
        }
    }
}

// Configuration validation and instructions
function showInstructions() {
    console.log('📋 Email Demo Setup Instructions:');
    console.log('================================\n');
    console.log('Before running this demo:');
    console.log('1. Set up your email credentials:');
    console.log('   export EMAIL_USER="your-email@gmail.com"');
    console.log('   export EMAIL_PASS="your-app-password"\n');
    console.log('2. Update TEST_EMAIL in this file to your email address');
    console.log('3. Make sure MongoDB is running\n');
    console.log('To run the demo:');
    console.log('   node src/utils/emailDemo.js\n');
    console.log('Expected outcome:');
    console.log('   • 3 test emails sent to your inbox');
    console.log('   • Demo users created and cleaned up');
    console.log('   • Email statistics displayed\n');
}

// Main execution
if (require.main === module) {
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️  Email credentials not found in environment variables\n');
        showInstructions();
        process.exit(1);
    }
    
    // Run the demo
    const demo = new EmailDemo();
    demo.runDemo().catch(console.error);
}

module.exports = EmailDemo;
