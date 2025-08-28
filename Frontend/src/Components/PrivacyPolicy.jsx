import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-pattern absolute inset-0"></div>
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-base-content/70 max-w-3xl mx-auto text-lg">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <div className="text-sm text-base-content/60 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Quick Overview */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Privacy at a Glance
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-base-100/50 rounded-lg p-4">
                  <div className="text-primary font-semibold mb-2">🔒 Your Data</div>
                  <p className="text-sm">We only collect what's necessary for platform functionality</p>
                </div>
                <div className="bg-base-100/50 rounded-lg p-4">
                  <div className="text-secondary font-semibold mb-2">🤝 Your Control</div>
                  <p className="text-sm">You can view, edit, or delete your data anytime</p>
                </div>
                <div className="bg-base-100/50 rounded-lg p-4">
                  <div className="text-accent font-semibold mb-2">🛡️ Our Promise</div>
                  <p className="text-sm">We never sell your personal information to third parties</p>
                </div>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Profile Information</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• Name and professional title</li>
                    <li>• Email address (for account management)</li>
                    <li>• Professional skills and experience</li>
                    <li>• Profile photo and about section</li>
                    <li>• Education and work history (optional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Usage Information</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• Platform interactions and preferences</li>
                    <li>• Connection requests and networking activity</li>
                    <li>• AI recommendation feedback and usage patterns</li>
                    <li>• Device information and IP address</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-accent">Optional Information</h3>
                  <ul className="space-y-2 text-base-content/80 ml-4">
                    <li>• Social media links (LinkedIn, GitHub)</li>
                    <li>• Portfolio and project information</li>
                    <li>• Communication preferences</li>
                    <li>• Participation in surveys or feedback</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">How We Use Your Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Platform Functionality</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Creating and managing your account</li>
                    <li>• Enabling connections with other developers</li>
                    <li>• Providing AI-powered recommendations</li>
                    <li>• Personalizing your experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Communication</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Account verification and security notifications</li>
                    <li>• Connection requests and updates</li>
                    <li>• Platform announcements and features</li>
                    <li>• Customer support and assistance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-accent">Improvement</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Analyzing usage patterns and trends</li>
                    <li>• Improving AI recommendation algorithms</li>
                    <li>• Developing new features and services</li>
                    <li>• Ensuring platform security and integrity</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-warning">Legal Compliance</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Complying with applicable laws</li>
                    <li>• Protecting user safety and security</li>
                    <li>• Preventing fraud and abuse</li>
                    <li>• Responding to legal requests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Data Protection & Security</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Security Measures</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Encrypted data transmission (HTTPS)</li>
                    <li>• Secure password hashing</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Data Storage</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Secure cloud infrastructure</li>
                    <li>• Regular backups and redundancy</li>
                    <li>• Geographic data protection compliance</li>
                    <li>• Minimal data retention periods</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Your Rights & Choices</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Access Your Data</h4>
                    <p className="text-base-content/80">View and download all personal information we have about you</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Update Your Information</h4>
                    <p className="text-base-content/80">Edit your profile and preferences at any time through your account settings</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Control Data Processing</h4>
                    <p className="text-base-content/80">Opt out of certain data processing activities or limit how we use your information</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-error" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm5 2a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Delete Your Account</h4>
                    <p className="text-base-content/80">Permanently delete your account and all associated data from our systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Party Services */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Third-Party Services</h2>
              <p className="text-base-content/80 mb-4">
                DevConnect may integrate with third-party services to enhance your experience:
              </p>
              <ul className="space-y-2 text-base-content/80 ml-4">
                <li>• Analytics services to understand platform usage</li>
                <li>• Email services for notifications and communications</li>
                <li>• Cloud storage providers for data backup and security</li>
                <li>• Authentication services for secure login</li>
              </ul>
              <p className="text-base-content/80 mt-4">
                These services operate under their own privacy policies, and we encourage you to review them.
              </p>
            </div>
          </div>

          {/* Contact & Updates */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
            <div className="card-body text-center">
              <h2 className="text-2xl font-bold mb-4">Questions or Concerns?</h2>
              <p className="text-base-content/80 mb-6">
                We're committed to transparency and protecting your privacy. If you have any questions about this policy 
                or how we handle your data, please don't hesitate to reach out.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/contact" className="btn btn-primary">
                  Contact Privacy Team
                </a>
                <a href="mailto:privacy@devconnect.com" className="btn btn-outline">
                  Email Us Directly
                </a>
              </div>
              <p className="text-sm text-base-content/60 mt-4">
                We may update this privacy policy from time to time. We'll notify you of significant changes via email or platform notification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


