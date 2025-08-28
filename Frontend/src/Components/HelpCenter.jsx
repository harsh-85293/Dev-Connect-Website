import React from 'react';

const HelpCenter = () => {
  const faqData = [
    {
      question: "How do I optimize my profile for better connections?",
      answer: "Complete all profile sections, add relevant skills, use a professional photo, and write a compelling about section that highlights your expertise and goals."
    },
    {
      question: "How does the AI recommendation system work?",
      answer: "Our ML algorithm analyzes your skills, experience level, and preferences to match you with developers who share similar interests or complementary skills for collaboration."
    },
    {
      question: "What's the difference between 'Connect' and 'Ignore'?",
      answer: "'Connect' sends a connection request to build your professional network. 'Ignore' removes the user from your feed without sending any notification to them."
    },
    {
      question: "How can I see who has sent me connection requests?",
      answer: "Navigate to the 'Requests' page from the main navigation or your profile dropdown to see all pending connection requests."
    },
    {
      question: "Can I change between random and AI-powered feed?",
      answer: "Yes! Use the toggle switch on the Feed page to switch between random discovery and AI-powered smart recommendations based on your skills."
    },
    {
      question: "How do I update my skills and experience?",
      answer: "Go to your Profile page and click 'Edit Profile' to update your skills, experience, about section, and other profile information."
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-pattern absolute inset-0"></div>
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Help <span className="text-gradient">Center</span>
          </h1>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Find answers to common questions and get the most out of DevConnect
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                <p className="text-base-content/70 text-sm">
                  Learn the basics of creating your profile and making connections
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Features</h3>
                <p className="text-base-content/70 text-sm">
                  Understanding smart recommendations and AI-powered matching
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Privacy & Security</h3>
                <p className="text-base-content/70 text-sm">
                  Keep your account safe and manage your privacy settings
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="radio" name="faq-accordion" />
                    <div className="collapse-title text-lg font-medium">
                      {faq.question}
                    </div>
                    <div className="collapse-content">
                      <p className="text-base-content/80 pt-2">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl mt-8">
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
              <p className="text-base-content/70 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/contact" className="btn btn-primary">
                  Contact Support
                </a>
                <a href="mailto:support@devconnect.com" className="btn btn-outline">
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;


