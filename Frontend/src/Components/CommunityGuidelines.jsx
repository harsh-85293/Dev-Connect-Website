import React from 'react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      title: "Professional Communication",
      icon: "💬",
      rules: [
        "Use respectful and professional language in all interactions",
        "Keep conversations focused on professional development and networking",
        "Avoid spam, promotional content, or unsolicited advertisements",
        "Be constructive in feedback and discussions"
      ]
    },
    {
      title: "Profile Integrity",
      icon: "👤",
      rules: [
        "Use authentic information and real professional photos",
        "Accurately represent your skills and experience",
        "Keep your profile updated with current information",
        "Don't impersonate others or create fake profiles"
      ]
    },
    {
      title: "Respectful Networking",
      icon: "🤝",
      rules: [
        "Send personalized connection requests when possible",
        "Respect others' decisions regarding connection requests",
        "Don't repeatedly contact users who haven't responded",
        "Focus on mutual professional benefits in networking"
      ]
    },
    {
      title: "Content Guidelines",
      icon: "📝",
      rules: [
        "Share relevant, valuable content related to technology and development",
        "Respect intellectual property and give credit where due",
        "Don't share inappropriate, offensive, or harmful content",
        "Avoid controversial topics unrelated to professional development"
      ]
    },
    {
      title: "Privacy & Security",
      icon: "🔒",
      rules: [
        "Respect others' privacy and personal information",
        "Don't share personal contact information without permission",
        "Report suspicious activity or inappropriate behavior",
        "Use platform features responsibly and ethically"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-pattern absolute inset-0"></div>
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Community <span className="text-gradient">Guidelines</span>
          </h1>
          <p className="text-base-content/70 max-w-3xl mx-auto text-lg">
            Building a respectful, professional, and inclusive community for all developers
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          {/* Mission Statement */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl mb-8">
            <div className="card-body text-center">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-base-content/80">
                DevConnect is dedicated to fostering meaningful professional relationships in the tech community. 
                These guidelines help ensure our platform remains a safe, respectful, and valuable space for all developers 
                to connect, collaborate, and grow together.
              </p>
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {guidelines.map((section, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{section.icon}</div>
                    <h3 className="card-title text-xl">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-base-content/80">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Enforcement Section */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Guideline Enforcement
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Reporting Violations</h4>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Use the report feature on any inappropriate content</li>
                    <li>• Provide specific details about guideline violations</li>
                    <li>• Our team reviews all reports within 24 hours</li>
                    <li>• Anonymous reporting is available for your safety</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-secondary">Consequences</h4>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• First violation: Warning and education</li>
                    <li>• Repeated violations: Temporary account restrictions</li>
                    <li>• Serious violations: Account suspension or termination</li>
                    <li>• Appeal process available for all enforcement actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="card bg-gradient-to-r from-success/10 to-primary/10 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Best Practices for Success
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold mb-2">Be Authentic</h4>
                  <p className="text-sm text-base-content/70">
                    Present your genuine professional self and build real relationships
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="font-semibold mb-2">Add Value</h4>
                  <p className="text-sm text-base-content/70">
                    Share knowledge, offer help, and contribute to the community
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h4 className="font-semibold mb-2">Stay Professional</h4>
                  <p className="text-sm text-base-content/70">
                    Maintain professional standards in all your interactions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mt-8">
            <p className="text-base-content/70 mb-4">
              Questions about these guidelines? Need to report a violation?
            </p>
            <div className="flex justify-center gap-4">
              <a href="/contact" className="btn btn-primary">
                Contact Support
              </a>
              <a href="/help" className="btn btn-outline">
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;


