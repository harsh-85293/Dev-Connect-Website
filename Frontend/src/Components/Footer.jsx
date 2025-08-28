const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="bg-pattern absolute inset-0 opacity-10"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
                </div>
                <h3 className="text-2xl font-bold">DevConnect</h3>
              </div>
              <p className="text-white/80 mb-6 max-w-md">
                The premier platform for developers to connect, collaborate, and grow together. 
                Build meaningful professional relationships in the tech community.
              </p>
              
              {/* Newsletter Signup */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <h4 className="font-semibold mb-3">Stay Connected</h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/70 flex-1 rounded-lg"
                  />
                  <button className="btn-gradient-secondary btn rounded-lg px-6 text-white border-0">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
              <div className="space-y-3">
                <a href="/feed" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    Discover Feed
                  </div>
                </a>
                <a href="/connections" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                    My Network
                  </div>
                </a>
                <a href="/requests" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                    </svg>
                    Requests
                  </div>
                </a>
                <a href="/profile" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
                    Profile
                  </div>
                </a>
              </div>
            </div>

            {/* Support & Resources */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
              <div className="space-y-3">
                <a href="/help" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  Help Center
                </a>
                <a href="/guidelines" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  Community Guidelines
                </a>
                <a href="/privacy" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  Privacy Policy
                </a>
                <a href="/terms" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  Terms of Service
                </a>
                <a href="/contact" className="block text-white/80 hover:text-white transition-colors duration-300 interactive-hover">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-white/80 text-sm">
                © {new Date().getFullYear()} DevConnect by Harsh Ramchandani. All rights reserved. Made with ❤️ for developers.
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-white/70 text-sm mr-2">Connect with me:</span>
                <div className="flex gap-3">
          <a
            href="https://www.linkedin.com/in/harsh-ramchandani007/"
            target="_blank"
            rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 interactive-hover"
                    title="LinkedIn - Harsh Ramchandani"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.336-.026-3.06-1.865-3.06-1.865 0-2.152 1.458-2.152 2.965v5.699h-3v-10h2.879v1.365h.042c.401-.759 1.379-1.56 2.839-1.56 3.038 0 3.597 2 3.597 4.604v5.591z"/>
            </svg>
          </a>
          <a
            href="https://github.com/harsh-85293"
            target="_blank"
            rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 interactive-hover"
                    title="GitHub - Harsh Ramchandani"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.304 3.438 9.8 8.207 11.385.6.111.793-.261.793-.577 0-.285-.011-1.04-.016-2.04-3.338.724-4.042-1.609-4.042-1.609-.546-1.387-1.333-1.757-1.333-1.757-1.091-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.235-3.221-.123-.304-.535-1.527.117-3.182 0 0 1.007-.322 3.3 1.23.957-.267 1.983-.4 3.003-.404 1.02.004 2.047.137 3.003.404 2.293-1.552 3.298-1.23 3.298-1.23.653 1.655.241 2.878.118 3.182.767.841 1.234 1.911 1.234 3.221 0 4.608-2.805 5.625-5.476 5.922.432.372.816 1.102.816 2.222 0 1.606-.014 2.896-.014 3.293 0 .319.191.694.799.576 4.766-1.588 8.202-6.081 8.202-11.382 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;