import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

// AI-powered chatbot with OpenAI integration and fallback responses
const AIChatbot = () => {
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [useOpenAI, setUseOpenAI] = useState(true);
  const messagesEndRef = useRef(null);

  // Fallback responses when OpenAI is unavailable
  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('profile') || lowerMessage.includes('bio') || lowerMessage.includes('about')) {
      return "Here are some tips to optimize your profile:\n\n📝 **About Section**: Write a compelling summary highlighting your expertise and goals\n💼 **Skills**: Add relevant technical skills and frameworks\n📸 **Photo**: Use a professional headshot\n🎯 **Be Specific**: Mention specific technologies you work with\n\nWould you like help with any specific section?";
    } else if (lowerMessage.includes('network') || lowerMessage.includes('connect')) {
      return "Great networking strategies for developers:\n\n🤝 **Quality over Quantity**: Focus on meaningful connections\n💬 **Personalized Messages**: Always customize connection requests\n🎯 **Common Interests**: Look for shared technologies or goals\n📚 **Knowledge Sharing**: Offer help and ask thoughtful questions\n🌟 **Follow Up**: Stay in touch with your connections\n\nWhat aspect of networking would you like to explore?";
    } else if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return "Career development tips for developers:\n\n📈 **Continuous Learning**: Stay updated with latest technologies\n🎯 **Specialization**: Develop deep expertise in specific areas\n🏗️ **Build Portfolio**: Create projects that showcase your skills\n👥 **Mentorship**: Both seek mentors and mentor others\n📊 **Track Growth**: Document your achievements and learnings\n\nWhat career aspect would you like guidance on?";
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('learn')) {
      return "Popular skills in demand for developers:\n\n**Frontend**: React, Vue, Angular, TypeScript\n**Backend**: Node.js, Python, Java, Go, Rust\n**Cloud**: AWS, Azure, GCP, Docker, Kubernetes\n**Database**: PostgreSQL, MongoDB, Redis\n**DevOps**: CI/CD, Terraform, Jenkins\n**Mobile**: React Native, Flutter, Swift, Kotlin\n\nWhich technology stack interests you most?";
    } else {
      return "I'm here to help with professional networking and career development! I can assist with:\n\n🔹 Profile optimization tips\n🔹 Networking strategies\n🔹 Career development advice\n🔹 Technology trends and skills\n🔹 Industry insights\n\nWhat would you like to explore?";
    }
  };

  // Call OpenAI API for intelligent responses
  const callOpenAI = async (userMessage, conversationHistory) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for DevConnect, a professional networking platform for developers. Help users with networking tips, profile optimization, career advice, and technology trends. Be friendly, professional, and concise. Format your responses with emojis and bullet points when appropriate.'
          },
          ...conversationHistory,
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        throw new Error('RATE_LIMIT');
      }
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: `Hi ${user?.firstName || 'there'}! 👋 I'm your DevConnect AI assistant powered by OpenAI. I'm here to help you with networking tips, profile optimization, and career advice. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponseText;
      
      if (useOpenAI) {
        try {
          // Build conversation history for context
          const conversationHistory = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }));

          aiResponseText = await callOpenAI(currentInput, conversationHistory);
        } catch (apiError) {
          console.error('OpenAI API Error:', apiError);
          
          // If rate limit or API error, switch to fallback mode
          if (apiError.message.includes('RATE_LIMIT') || apiError.message.includes('429')) {
            setUseOpenAI(false);
            aiResponseText = "⚠️ OpenAI rate limit reached. Switching to offline mode.\n\n" + getFallbackResponse(currentInput);
          } else {
            throw apiError;
          }
        }
      } else {
        // Use fallback responses
        aiResponseText = getFallbackResponse(currentInput);
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble right now. Let me help you with some general advice:\n\n" + getFallbackResponse(currentInput),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "Optimize my profile", icon: "👤" },
    { text: "Networking tips", icon: "🤝" },
    { text: "Career advice", icon: "📈" },
    { text: "Popular skills", icon: "💡" },
    { text: "Connection strategies", icon: "🌐" },
    { text: "Tech trends 2024", icon: "🚀" }
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="btn btn-circle btn-primary shadow-lg hover:scale-110 transition-transform duration-300 pulse-glow"
          title="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96">
      <div className="card bg-base-100 shadow-2xl border border-base-300 modern-card">
        {/* Header */}
        <div className="card-header bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">DevConnect AI</h3>
                <p className="text-white/80 text-sm">Your networking assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-base-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 text-base-content'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-content/70' : 'text-base-content/70'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-base-200 text-base-content px-4 py-2 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="loading loading-dots loading-sm"></span>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-t border-base-300">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputMessage(action.text);
                  handleSendMessage();
                }}
                className="btn btn-ghost btn-xs text-xs hover:bg-primary hover:text-primary-content transition-colors"
                disabled={isLoading}
              >
                <span className="mr-1">{action.icon}</span>
                {action.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-base-300">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about networking or career development..."
              className="textarea textarea-bordered flex-1 min-h-[2.5rem] max-h-20 text-sm resize-none"
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn btn-primary btn-circle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
