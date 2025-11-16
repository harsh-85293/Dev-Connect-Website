# Implementation Plan

- [x] 1. Fix email overflow in NavBar dropdown


  - Open `Frontend/src/Components/NavBar.jsx`
  - Locate line 196 where the email is displayed
  - Replace `overflow-wrap-anywhere` with `break-all` Tailwind class
  - Verify the email wraps properly without horizontal overflow
  - _Requirements: 1.1, 1.2, 1.3, 1.4_



- [ ] 2. Set chatbot to start minimized by default
  - Open `Frontend/src/Components/AIChatbot.jsx`
  - Locate line 9 where `isMinimized` state is initialized
  - Change `useState(false)` to `useState(true)`


  - Verify chatbot starts minimized on page load
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Create environment file with OpenAI API key


  - Create `Frontend/.env` file if it doesn't exist


  - Add the OpenAI API key with `VITE_` prefix: `VITE_OPENAI_API_KEY=your_openai_api_key_here`
  - Ensure `.env` is in `.gitignore` to prevent committing the API key
  - _Requirements: 3.2_

- [x] 4. Implement OpenAI API integration in chatbot


  - [ ] 4.1 Create callOpenAI function
    - Add async function to call OpenAI API
    - Include system message defining the assistant's role
    - Pass conversation history for context
    - Handle API response and extract message content
    - _Requirements: 3.1, 3.3, 3.6_


  
  - [ ] 4.2 Update handleSendMessage to use OpenAI API
    - Replace hardcoded `getAIResponse` call with `callOpenAI`
    - Build conversation history from messages state
    - Add try-catch block for error handling
    - Display user-friendly error messages on API failures
    - Maintain loading state during API calls
    - _Requirements: 3.3, 3.4, 3.5_
  
  - [ ] 4.3 Remove hardcoded responses
    - Delete the `aiResponses` object (no longer needed)
    - Remove the `getAIResponse` function
    - Clean up any unused code related to hardcoded responses
    - _Requirements: 3.1_

- [ ]* 5. Test all fixes
  - Test email display with long email addresses
  - Test chatbot minimized state on page refresh
  - Test OpenAI API integration with various questions
  - Test error handling when API fails
  - Test conversation context with follow-up questions
  - Verify loading indicators appear during API calls
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.3, 3.4, 3.5, 3.6_
