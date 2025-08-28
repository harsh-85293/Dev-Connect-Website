import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
    }, 2000);
  };

  const contactMethods = [
    {
      title: "General Support",
      icon: "💬",
      description: "Questions about using DevConnect",
      email: "support@devconnect.com",
      responseTime: "24 hours"
    },
    {
      title: "Technical Issues",
      icon: "🔧",
      description: "Bug reports and technical problems",
      email: "tech@devconnect.com",
      responseTime: "12 hours"
    },
    {
      title: "Privacy & Legal",
      icon: "🔒",
      description: "Privacy concerns and legal matters",
      email: "legal@devconnect.com",
      responseTime: "48 hours"
    },
    {
      title: "Business Inquiries",
      icon: "💼",
      description: "Partnerships and business opportunities",
      email: "business@devconnect.com",
      responseTime: "3-5 days"
    }
  ];

  const faqQuickLinks = [
    { question: "How do I reset my password?", link: "/help#password-reset" },
    { question: "How does the AI matching work?", link: "/help#ai-matching" },
    { question: "How do I delete my account?", link: "/help#delete-account" },
    { question: "How do I report inappropriate behavior?", link: "/help#report-user" },
    { question: "How do I update my profile?", link: "/help#update-profile" }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-pattern absolute inset-0"></div>
      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-base-content/70 max-w-3xl mx-auto text-lg">
            We're here to help! Get in touch with our team for support, feedback, or questions about DevConnect.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body text-center">
                  <div className="text-4xl mb-3">{method.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                  <p className="text-base-content/70 text-sm mb-4">{method.description}</p>
                  <a 
                    href={`mailto:${method.email}`}
                    className="text-primary hover:text-primary-focus text-sm font-medium"
                  >
                    {method.email}
                  </a>
                  <div className="text-xs text-base-content/60 mt-2">
                    Response: {method.responseTime}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  Send us a message
                </h2>

                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-base-content/70 mb-4">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                    <button 
                      onClick={() => setSubmitSuccess(false)}
                      className="btn btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Name *</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email *</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Category</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="select select-bordered"
                        >
                          <option value="general">General Support</option>
                          <option value="technical">Technical Issue</option>
                          <option value="privacy">Privacy/Legal</option>
                          <option value="business">Business Inquiry</option>
                          <option value="feedback">Feedback</option>
                          <option value="bug">Bug Report</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Priority</span>
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="select select-bordered"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Subject *</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Message *</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered h-32"
                        placeholder="Please provide details about your inquiry..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick FAQ */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-4">
                    <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                    Quick Help
                  </h3>
                  <p className="text-base-content/70 text-sm mb-4">
                    Before contacting us, you might find your answer here:
                  </p>
                  <div className="space-y-2">
                    {faqQuickLinks.map((faq, index) => (
                      <a
                        key={index}
                        href={faq.link}
                        className="block text-sm text-primary hover:text-primary-focus hover:underline"
                      >
                        → {faq.question}
                      </a>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a href="/help" className="btn btn-outline btn-sm w-full">
                      Visit Help Center
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-4">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    Support Hours
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-info/10 rounded-lg">
                    <p className="text-xs text-base-content/70">
                      <strong>Note:</strong> Urgent technical issues are monitored 24/7. 
                      For emergencies, mark your message as "Urgent" priority.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
                <div className="card-body text-center">
                  <h3 className="card-title text-xl mb-4 justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                    Connect With Us
                  </h3>
                  <p className="text-base-content/70 text-sm mb-4">
                    Follow DevConnect for updates and community news
                  </p>
                  <div className="flex justify-center gap-4">
                    <a
                      href="https://www.linkedin.com/in/harsh-ramchandani007/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-outline btn-sm"
                      title="LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.336-.026-3.06-1.865-3.06-1.865 0-2.152 1.458-2.152 2.965v5.699h-3v-10h2.879v1.365h.042c.401-.759 1.379-1.56 2.839-1.56 3.038 0 3.597 2 3.597 4.604v5.591z"/>
                      </svg>
                    </a>
                    <a
                      href="https://github.com/harsh-85293"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-outline btn-sm"
                      title="GitHub"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.304 3.438 9.8 8.207 11.385.6.111.793-.261.793-.577 0-.285-.011-1.04-.016-2.04-3.338.724-4.042-1.609-4.042-1.609-.546-1.387-1.333-1.757-1.333-1.757-1.091-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.235-3.221-.123-.304-.535-1.527.117-3.182 0 0 1.007-.322 3.3 1.23.957-.267 1.983-.4 3.003-.404 1.02.004 2.047.137 3.003.404 2.293-1.552 3.298-1.23 3.298-1.23.653 1.655.241 2.878.118 3.182.767.841 1.234 1.911 1.234 3.221 0 4.608-2.805 5.625-5.476 5.922.432.372.816 1.102.816 2.222 0 1.606-.014 2.896-.014 3.293 0 .319.191.694.799.576 4.766-1.588 8.202-6.081 8.202-11.382 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;


