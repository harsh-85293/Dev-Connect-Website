import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-pattern absolute inset-0"></div>
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p className="text-base-content/70 max-w-3xl mx-auto text-lg">
            Please read these terms carefully before using DevConnect
          </p>
          <div className="text-sm text-base-content/60 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Agreement */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                </svg>
                Agreement to Terms
              </h2>
              <p className="text-base-content/80">
                By accessing and using DevConnect, you accept and agree to be bound by the terms and provision of this agreement. 
                DevConnect is a professional networking platform designed for developers to connect, collaborate, and grow together. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>

          {/* Account Terms */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Account Terms</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Account Creation</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• You must be at least 13 years old to use DevConnect</li>
                    <li>• You must provide accurate and complete information when creating your account</li>
                    <li>• You are responsible for maintaining the security of your account and password</li>
                    <li>• You must notify us immediately of any unauthorized use of your account</li>
                    <li>• One person or legal entity may not maintain more than one account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Account Responsibilities</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• You are responsible for all content posted and activity that occurs under your account</li>
                    <li>• You must keep your profile information current and accurate</li>
                    <li>• You may not use your account for any illegal or unauthorized purpose</li>
                    <li>• You must comply with our Community Guidelines at all times</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Usage */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Platform Usage</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-success">Acceptable Use</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Professional networking and collaboration</li>
                    <li>• Sharing relevant technical knowledge and insights</li>
                    <li>• Building meaningful professional relationships</li>
                    <li>• Using AI features for legitimate matching purposes</li>
                    <li>• Participating in community discussions respectfully</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-error">Prohibited Activities</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Spam, harassment, or abusive behavior</li>
                    <li>• Impersonation or misrepresentation</li>
                    <li>• Automated data collection or scraping</li>
                    <li>• Distributing malware or harmful content</li>
                    <li>• Commercial solicitation without permission</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Content and IP */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Content & Intellectual Property</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Your Content</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• You retain ownership of all content you post on DevConnect</li>
                    <li>• By posting content, you grant us a license to display and distribute it on our platform</li>
                    <li>• You are responsible for ensuring you have rights to any content you post</li>
                    <li>• You must not post content that infringes on others' intellectual property</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Our Content</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• DevConnect's design, features, and functionality are protected by intellectual property laws</li>
                    <li>• You may not copy, modify, or distribute our proprietary technology</li>
                    <li>• Our AI algorithms and recommendation systems are proprietary</li>
                    <li>• All trademarks and logos are property of DevConnect</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI and ML Services */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">AI and Machine Learning Services</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-accent">How Our AI Works</h3>
                  <p className="text-base-content/80 mb-3">
                    DevConnect uses machine learning algorithms to provide personalized recommendations based on your skills, 
                    experience, and preferences. Our AI analyzes profile data to suggest relevant connections.
                  </p>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• Recommendations are automated and may not always be perfect</li>
                    <li>• You can opt out of AI-powered features at any time</li>
                    <li>• We continuously improve our algorithms based on user feedback</li>
                    <li>• AI decisions can be reviewed and appealed through our support team</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-warning">AI Limitations</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• AI recommendations are suggestions, not guarantees of compatibility</li>
                    <li>• Machine learning models may have biases that we actively work to minimize</li>
                    <li>• You should use your own judgment when making professional connections</li>
                    <li>• AI features may not be available in all regions or circumstances</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Privacy and Data Usage</h2>
              <p className="text-base-content/80 mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your information. Key points include:
              </p>
              <ul className="space-y-2 text-base-content/80 ml-4">
                <li>• We only collect data necessary for platform functionality</li>
                <li>• Your profile data is used to provide personalized recommendations</li>
                <li>• We implement security measures to protect your information</li>
                <li>• You have control over your data and can request deletion at any time</li>
                <li>• We do not sell your personal information to third parties</li>
              </ul>
              <div className="mt-4">
                <a href="/privacy" className="btn btn-outline btn-sm">
                  Read Full Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Service Availability */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Service Availability</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Service Commitment</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• We strive to maintain 99.9% uptime</li>
                    <li>• Regular maintenance may cause brief interruptions</li>
                    <li>• We'll notify users of planned maintenance in advance</li>
                    <li>• Emergency updates may occur without notice</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Limitations</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Service may be unavailable due to technical issues</li>
                    <li>• We are not liable for downtime beyond our control</li>
                    <li>• Some features may be temporarily limited during updates</li>
                    <li>• Access may be restricted in certain jurisdictions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Account Termination</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-warning">Voluntary Termination</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• You may delete your account at any time through your profile settings</li>
                    <li>• Account deletion is permanent and cannot be undone</li>
                    <li>• Some information may be retained for legal compliance</li>
                    <li>• You can export your data before deleting your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-error">Involuntary Termination</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• We may suspend or terminate accounts that violate these terms</li>
                    <li>• Serious violations may result in immediate termination</li>
                    <li>• You will be notified of the reason for any enforcement action</li>
                    <li>• Appeals process is available for disputed terminations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Legal and Liability */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Legal Terms</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Disclaimers</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• DevConnect is provided "as is" without warranties of any kind</li>
                    <li>• We do not guarantee the accuracy of AI recommendations</li>
                    <li>• Users are responsible for their own professional decisions</li>
                    <li>• We are not liable for interactions between users</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Limitation of Liability</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• Our liability is limited to the maximum extent permitted by law</li>
                    <li>• We are not responsible for indirect or consequential damages</li>
                    <li>• Total liability shall not exceed the amount paid for the service</li>
                    <li>• These limitations apply even if we have been advised of potential damages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="card bg-gradient-to-r from-warning/10 to-accent/10 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Changes to These Terms
              </h2>
              <p className="text-base-content/80">
                We may update these Terms of Service from time to time to reflect changes in our service, 
                legal requirements, or business practices. We will notify users of significant changes via:
              </p>
              <ul className="space-y-2 text-base-content/80 ml-4 mt-4">
                <li>• Email notification to your registered address</li>
                <li>• Prominent notice on the platform</li>
                <li>• In-app notifications for material changes</li>
                <li>• At least 30 days advance notice for major changes</li>
              </ul>
              <p className="text-base-content/80 mt-4">
                Continued use of DevConnect after changes take effect constitutes acceptance of the new terms.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
            <div className="card-body text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="text-base-content/80 mb-6">
                If you have any questions about these Terms of Service, please don't hesitate to contact us. 
                We're here to help clarify any concerns you may have.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/contact" className="btn btn-primary">
                  Contact Legal Team
                </a>
                <a href="mailto:legal@devconnect.com" className="btn btn-outline">
                  Email Legal Dept.
                </a>
              </div>
              <p className="text-sm text-base-content/60 mt-6">
                DevConnect is owned and operated by Harsh Ramchandani<br/>
                For urgent legal matters, please use the contact information above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;


