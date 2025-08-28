import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AIChatbot from './AIChatbot';

const ChatbotWrapper = () => {
  const user = useSelector((store) => store.user);
  const location = useLocation();

  // Don't show chatbot on login page or when user is not logged in
  if (!user || location.pathname === '/login') {
    return null;
  }

  return <AIChatbot />;
};

export default ChatbotWrapper;


