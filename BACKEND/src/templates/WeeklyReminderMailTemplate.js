const WeeklyReminderMailTemplate = (name, username, reminderItems) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #ffffff;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px 0;">
        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin: 0;">DevConnect</div>
        <p style="color: #666; margin: 8px 0; font-size: 14px;">Your Weekly Activity Summary</p>
      </div>
      
      <h2 style="color: #333;">Hi ${name}! 📊</h2>
      
      <p style="color: #555; line-height: 1.6;">
        Here's your weekly activity summary for DevConnect. Stay connected and keep growing your network!
      </p>
      
      <!-- Activity Summary -->
      <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
        <h3 style="color: #4F46E5; margin-top: 0; margin-bottom: 15px;">📈 This Week's Activity</h3>
        <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
          ${reminderItems.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <!-- Call to Action -->
      <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: white; margin-top: 0; margin-bottom: 10px;">🚀 Keep the Momentum Going!</h3>
        <p style="color: white; margin-bottom: 20px; opacity: 0.9;">Don't let your connections go cold. Engage with your network today!</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
           style="background: white; color: #10B981; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          View Your Dashboard
        </a>
      </div>
      
      <!-- Tips Section -->
      <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
        <h3 style="color: #92400E; margin-top: 0; margin-bottom: 15px;">💡 Pro Tips</h3>
        <ul style="color: #92400E; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
          <li>Respond to connection requests within 48 hours for better engagement</li>
          <li>Update your profile regularly to stay visible in search results</li>
          <li>Send personalized messages when connecting with new developers</li>
        </ul>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
        <p style="margin: 5px 0;">Happy networking, ${name}!</p>
        <p style="margin: 5px 0;">The DevConnect Team</p>
        <p style="margin: 15px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile/${username}" style="color: #4F46E5; text-decoration: none; margin: 0 10px;">View Profile</a> | 
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/email-preferences" style="color: #4F46E5; text-decoration: none; margin: 0 10px;">Email Preferences</a>
        </p>
        <p style="font-size: 12px; color: #aaa; margin: 10px 0;">
          You're receiving this email because you're an active member of DevConnect.
        </p>
      </div>
    </div>
  `;
};

module.exports = {
  WeeklyReminderMailTemplate
};
