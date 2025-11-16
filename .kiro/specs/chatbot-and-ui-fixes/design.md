# Design Document

## Overview

This design addresses three distinct issues in the DevConnect application:

1. **Email Overflow**: The email address in the NavBar dropdown is cut off due to CSS constraints
2. **Chatbot Auto-Open**: The chatbot initializes in an expanded state instead of minimized
3. **OpenAI Integration**: Replace hardcoded responses with real OpenAI API calls

## Architecture

### Component Locations

- **NavBar Component**: `Frontend/src/Components/NavBar.jsx` (line 196 - email display)
- **Chatbot Component**: `Frontend/src/Components/AIChatbot.jsx` (initialization and API logic)
- **Environment Config**: `Frontend/.env` (API key storage)

### Current vs Proposed Flow

#### Email Display
**Current**: Email uses `text-xs` class with no word-break, causing overflow
**Proposed**: Add `break-all` or `break-words` utility class to allow wrapping

#### Chatbot Initialization
**Current**: `isMinimized` state defaults to `false` (line 9 in AIChatbot.jsx)
**Proposed**: Change default state to `true` so chatbot starts minimized

#### Chatbot Responses
**Current**: Hardcoded responses in `aiResponses` object
**Proposed**: API call to OpenAI with conversation history

## Components and Interfaces

### 1. NavBar Email Fix

**File**: `Frontend/src/Components/NavBar.jsx`
**Line**: 196

**Current Code**:
```jsx
<div className="text-xs text-base-content/60 break-words overflow-wrap-anywhere">{user.emailId}</div>
```

**Issue**: The `overflow-wrap-anywhere` is not a valid Tailwind class

**Solution**: Use proper Tailwind utilities:
```jsx
<div className="text-xs text-base-content/60 break-all">{user.emailId}</div>
```

### 2. Chatbot Initial State

**File**: `Frontend/src/Components/AIChatbot.jsx`
**Line**: 9

**Current Code**:
```javascript
const [isMinimized, setIsMinimized] = useState(false);
```

**Solution**:
```javascript
const [isMinimized, setIsMinimized] = useState(true);
```

### 3. OpenAI API Integration

**File**: `Frontend/src/Components/AIChatbot.jsx`

**Changes Required**:

1. **Environment Variable Setup**:
   - Create/update `Frontend/.env` file
   - Add: `VITE_OPENAI_API_KEY=your_openai_api_key_here`

2. **API Call Function**:
   Replace the `getAIResponse` function with an async function that calls OpenAI:

```javascript
const callOpenAI = async (userMessage, conversationHistory) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
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
          content: 'You are a helpful AI assistant for DevConnect, a professional networking platform for developers. Help users with networking tips, profile optimization, career advice, and technology trends. Be friendly, professional, and concise.'
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
  
  const data = await response.json();
  return data.choices[0].message.content;
};
```

3. **Update handleSendMessage**:
   Modify to use the API instead of hardcoded responses:

```javascript
const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage = {
    id: Date.now(),
    text: inputMessage,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

  try {
    // Build conversation history for context
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const aiResponse = await callOpenAI(inputMessage, conversationHistory);

    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    const errorMessage = {
      id: Date.now() + 1,
      text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

## Data Models

### Message Object
```javascript
{
  id: number,
  text: string,
  sender: 'user' | 'ai',
  timestamp: Date
}
```

### OpenAI Request Format
```javascript
{
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system' | 'user' | 'assistant', content: string }
  ],
  max_tokens: number,
  temperature: number
}
```

## Error Handling

### API Errors
- Network failures: Display user-friendly message
- Invalid API key: Log error, show fallback message
- Rate limiting: Inform user to wait and retry
- Timeout: Show retry option

### Fallback Behavior
If OpenAI API fails, display a generic helpful message rather than breaking the UI.

## Testing Strategy

### Manual Testing

1. **Email Display**:
   - Test with short email (< 20 chars)
   - Test with long email (> 30 chars)
   - Verify no horizontal overflow
   - Check readability

2. **Chatbot Initial State**:
   - Refresh page multiple times
   - Verify chatbot starts minimized
   - Click to expand, verify it opens
   - Minimize again, verify it closes

3. **OpenAI Integration**:
   - Send simple question
   - Send follow-up question (test context)
   - Test with invalid API key (error handling)
   - Test network disconnection scenario
   - Verify loading states

## Security Considerations

### API Key Protection
- Store in `.env` file (not committed to git)
- Use `VITE_` prefix for Vite environment variables
- Never expose in client-side code directly
- Consider moving to backend proxy for production

**Note**: Storing API keys in frontend environment variables is NOT secure for production. The key will be visible in the bundled JavaScript. For production, implement a backend proxy:

```
Frontend → Backend API → OpenAI API
```

This way, the OpenAI key stays on the server.

## Implementation Notes

### Minimal Changes
- Email fix: Single line change
- Chatbot state: Single boolean change
- OpenAI integration: Replace one function, update another

### Dependencies
- No new npm packages needed (using native fetch API)
- Vite already supports `.env` files

### Environment Setup
After adding the `.env` file, restart the Vite dev server for changes to take effect.
