const { sendWelcomeEmail, sendConnectionRequestEmail, sendLoginSuggestionEmail } = require('../services/emailService');

// Test data
const testUser = {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'John',
    lastName: 'Doe',
    emailId: 'test@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    skills: ['JavaScript', 'React', 'Node.js'],
    about: 'Full-stack developer passionate about creating amazing web applications.'
};

const testFromUser = {
    _id: '507f1f77bcf86cd799439012',
    firstName: 'Jane',
    lastName: 'Smith',
    emailId: 'jane@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b14a5cf9?w=150',
    skills: ['React', 'TypeScript', 'GraphQL'],
    about: 'Frontend developer with a love for beautiful user interfaces.'
};

const suggestedUsers = [
    {
        _id: '507f1f77bcf86cd799439013',
        firstName: 'Alice',
        lastName: 'Johnson',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        skills: ['Python', 'Django', 'Machine Learning']
    },
    {
        _id: '507f1f77bcf86cd799439014',
        firstName: 'Bob',
        lastName: 'Wilson',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        skills: ['Vue.js', 'Node.js', 'MongoDB']
    }
];

async function testEmailSystem() {
    console.log('🧪 Testing DevConnect Email System...\n');
    
    try {
        // Test 1: Welcome Email
        console.log('📧 Testing Welcome Email...');
        const welcomeResult = await sendWelcomeEmail(testUser);
        console.log('Welcome Email Result:', welcomeResult);
        console.log('✅ Welcome email test completed\n');
        
        // Test 2: Connection Request Email
        console.log('🤝 Testing Connection Request Email...');
        const connectionResult = await sendConnectionRequestEmail(testFromUser, testUser);
        console.log('Connection Request Email Result:', connectionResult);
        console.log('✅ Connection request email test completed\n');
        
        // Test 3: Login Suggestion Email
        console.log('💡 Testing Login Suggestion Email...');
        const suggestionResult = await sendLoginSuggestionEmail(testUser, suggestedUsers);
        console.log('Login Suggestion Email Result:', suggestionResult);
        console.log('✅ Login suggestion email test completed\n');
        
        console.log('🎉 All email tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Email test failed:', error);
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Make sure EMAIL_USER and EMAIL_PASS are set correctly');
        console.log('2. Verify your Gmail App Password is valid');
        console.log('3. Check your internet connection');
        console.log('4. Ensure 2FA is enabled on your Gmail account');
    }
}

// Instructions for running the test
function printInstructions() {
    console.log('📋 Email System Test Instructions:');
    console.log('================================\n');
    console.log('Before running this test:');
    console.log('1. Set up your email credentials in .env file:');
    console.log('   EMAIL_USER=your-email@gmail.com');
    console.log('   EMAIL_PASS=your-app-password\n');
    console.log('2. Make sure you have a Gmail App Password generated');
    console.log('3. Replace test@example.com with your actual email for testing\n');
    console.log('To run this test:');
    console.log('node src/utils/testEmail.js\n');
    console.log('Expected outcome:');
    console.log('- 3 emails should be sent to the test email address');
    console.log('- Console should show success messages');
    console.log('- Check your email inbox for the test emails\n');
}

// Check if script is run directly
if (require.main === module) {
    printInstructions();
    
    // Uncomment the line below to run the actual test
    // testEmailSystem();
    
    console.log('⚠️  To run the actual test, uncomment the testEmailSystem() line in this file');
    console.log('   and make sure to update EMAIL_USER in the test data to your email address');
}

module.exports = {
    testEmailSystem,
    testUser,
    testFromUser,
    suggestedUsers
};
