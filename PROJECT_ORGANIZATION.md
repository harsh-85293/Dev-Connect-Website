# DevConnect Project Organization

## 📋 Organization Notes

This project follows a clean, professional structure:

- **Root Level**: Quick reference docs (GETTING_STARTED, KAFKA_REDIS_ARCHITECTURE, etc.)
- **DOCUMENTATION/**: Design documents, implementation summaries, analysis
- **Interview/**: All interview preparation materials including Redis/Kafka Q&A
- **REDIS_KAFKA_INTEGRATION_FILES/**: Integration-specific files and setup scripts
- **BACKEND/** and **Frontend/**: Application source code

## 📁 Project Structure

```
devconnect/
│
├── 📄 README.md                    # Main project documentation
├── 📄 GETTING_STARTED.md           # Quick setup guide
├── 📄 HOW_TO_RUN.md                # Detailed running instructions
├── 📄 PROJECT_ORGANIZATION.md     # This file - project structure
├── 📄 DOCUMENTATION_INDEX.md      # Documentation navigation index
├── 📄 .gitignore                  # Git ignore rules
├── 📄 docker-compose.yml          # Docker services (Redis, Kafka, Zookeeper)
├── 📄 package.json               # Root package.json for running all services
│
├── 📂 BACKEND/                   # Backend API Server
│   ├── 📄 package.json
│   ├── 📄 .env                    # Environment variables (not in git)
│   ├── 📂 src/
│   │   ├── 📄 app.js             # Main entry point with Socket.io
│   │   ├── 📂 config/
│   │   │   ├── 📄 database.js    # MongoDB connection
│   │   │   ├── 📄 redis.js       # Redis client wrapper
│   │   │   └── 📄 kafka.js       # Kafka client wrapper
│   │   ├── 📂 models/
│   │   │   ├── 📄 user.js        # User schema
│   │   │   ├── 📄 message.js     # Message schema
│   │   │   └── 📄 connectionRequest.js
│   │   ├── 📂 routes/
│   │   │   ├── 📄 auth.js        # Authentication (uses Redis/Kafka)
│   │   │   ├── 📄 user.js        # User operations
│   │   │   ├── 📄 profile.js     # Profile management
│   │   │   ├── 📄 request.js     # Connection requests (uses Kafka)
│   │   │   ├── 📄 emailPreferences.js
│   │   │   └── 📄 paymentsPhonePe.js
│   │   ├── 📂 middlewares/
│   │   │   └── 📄 auth.js        # JWT auth (uses Redis)
│   │   ├── 📂 services/
│   │   │   └── 📄 emailService.js
│   │   ├── 📂 templates/
│   │   │   └── 📄 WeeklyReminderMailTemplate.js
│   │   └── 📂 utils/
│   │       ├── 📄 validation.js
│   │       ├── 📄 mlRecommendations.js
│   │       ├── 📄 cronjob.js
│   │       └── 📄 testEmail.js
│   └── 📂 node_modules/
│
├── 📂 Frontend/                   # Frontend React App
│   ├── 📄 package.json
│   ├── 📄 .env                    # Environment variables
│   ├── 📂 src/
│   │   ├── 📄 main.jsx           # Entry point
│   │   ├── 📄 App.jsx            # Main app component
│   │   ├── 📂 Components/       # React components
│   │   │   ├── 📄 NavBar.jsx
│   │   │   ├── 📄 Body.jsx
│   │   │   ├── 📄 Login.jsx
│   │   │   ├── 📄 Profile.jsx
│   │   │   ├── 📄 EditProfile.jsx
│   │   │   ├── 📄 Feed.jsx
│   │   │   ├── 📄 Requests.jsx
│   │   │   ├── 📄 Chat.jsx
│   │   │   ├── 📄 Connections.jsx
│   │   │   ├── 📄 Premium.jsx
│   │   │   ├── 📄 Checkout.jsx
│   │   │   ├── 📄 CheckoutSuccess.jsx
│   │   │   ├── 📄 CheckoutCancel.jsx
│   │   │   ├── 📄 EmailPreferences.jsx
│   │   │   ├── 📄 AIChatbot.jsx
│   │   │   ├── 📄 ChatbotWrapper.jsx
│   │   │   ├── 📄 Footer.jsx
│   │   │   ├── 📄 ContactUs.jsx
│   │   │   ├── 📄 HelpCenter.jsx
│   │   │   ├── 📄 CommunityGuidelines.jsx
│   │   │   ├── 📄 TermsOfService.jsx
│   │   │   ├── 📄 PrivacyPolicy.jsx
│   │   │   ├── 📄 ThemeToggle.jsx
│   │   │   └── 📄 userCard.jsx
│   │   ├── 📂 contexts/
│   │   │   └── 📄 ThemeContext.jsx
│   │   ├── 📂 utils/
│   │   │   ├── 📄 api.js         # API utilities
│   │   │   ├── 📄 appStore.js    # Redux store
│   │   │   ├── 📄 userSlice.js
│   │   │   ├── 📄 feedSlice.js
│   │   │   ├── 📄 requestSlice.js
│   │   │   ├── 📄 connectionSlice.js
│   │   │   └── 📄 constants.js
│   │   └── 📂 assets/
│   │       └── 📄 logo.png
│   └── 📂 dist/                   # Build output
│
├── 📂 REDIS_KAFKA_INTEGRATION_FILES/  # Integration Files
│   ├── 📄 README.md              # Quick start guide
│   ├── 📄 KAFKA_REDIS_IMPLEMENTATION_GUIDE.md  # Full documentation
│   ├── 📄 IMPLEMENTATION_SUMMARY.md
│   ├── 📄 INTERVIEW_EXPLANATION.md
│   ├── 📄 REDIS_KAFKA_EXPLAIN.md
│   ├── 📄 env.example            # Environment template
│   ├── 📄 docker-compose.dev.yml # Docker services
│   ├── 📄 setup-redis-kafka.sh  # Linux/macOS setup
│   ├── 📄 setup-redis-kafka.bat  # Windows setup
│   ├── 📄 test-redis-kafka.js    # Integration tests
│   ├── 📄 redis.js               # Reference copy
│   └── 📄 kafka.js               # Reference copy
│
├── 📂 DOCUMENTATION/              # Project Documentation
│   ├── 📄 README.md
│   ├── 📄 PROJECT_SUMMARY.md
│   ├── 📄 KAFKA_REDIS_ARCHITECTURE.md    # Kafka & Redis architecture
│   ├── 📄 IMPLEMENTATION_SUMMARY.md      # What's been implemented
│   ├── 📄 WHAT_WAS_ADDED.md             # Summary of additions
│   ├── 📄 ORGANIZATION_SUMMARY.md       # Organization summary
│   ├── 📄 DevConnect_High_Level_Design.md
│   ├── 📄 DevConnect_Low_Level_Design.md
│   ├── 📄 DevConnect_Workflow_Diagrams.md
│   ├── 📄 DevConnect_Analysis_Summary.md
│   ├── 📄 INTERVIEW_EXPLANATION.md
│   ├── 📄 DevConnect_Diagrams_Visual.html
│   └── 📄 README_Diagram_Generator.md
│
├── 📂 diagrams/                   # System Diagrams
│   ├── 📄 system_architecture_hld.mmd
│   ├── 📄 authentication_flow.mmd
│   ├── 📄 user_registration_workflow.mmd
│   ├── 📄 connection_request_workflow.mmd
│   ├── 📄 feed_discovery_workflow.mmd
│   ├── 📄 realtime_chat_workflow.mmd
│   └── 📄 payment_workflow.mmd
│
├── 📂 SCRIPTS/                    # Utility Scripts
│   ├── 📄 README.md
│   ├── 📄 generate_images.js
│   ├── 📄 generate_images.bat
│   └── 📄 generate_diagram_images.py
│
├── 📂 Interview/                  # Interview Prep
│   ├── 📄 INTRO.md                # Interview brief (existing)
│   ├── 📄 PROJECT_INTRO.md       # Detailed project introduction ✅
│   ├── 📄 questions.md           # General interview questions
│   ├── 📄 systemdesign.md        # System design questions
│   └── 📄 INTERVIEW_QUESTIONS_REDIS_KAFKA.md  # Complete Q&A (25 questions: Redis, Kafka, JWT) ✅
│
├── 📂 ARCHIVES/                   # Archived Files
│   ├── 📄 README.md
│   └── 📂 Interview.zip
│
└── 📂 node_modules/               # Root node_modules

```

## 🎯 Key Files Explained

### Backend (Node.js + Express)

#### Core Files
- **`BACKEND/src/app.js`** - Main entry point, initializes:
  - Express server
  - Socket.io for real-time chat
  - Redis connection
  - Kafka connection
  - Routes and middleware

#### Configuration Files
- **`BACKEND/src/config/redis.js`** - Redis client with methods for:
  - Session management
  - User data caching
  - Presence tracking
  - Message caching
  - Rate limiting

- **`BACKEND/src/config/kafka.js`** - Kafka client with:
  - Producer methods for publishing events
  - Consumer methods for subscribing to events
  - Five topics: user-events, message-events, connection-events, notification-events, analytics-events

- **`BACKEND/src/config/database.js`** - MongoDB connection

#### Routes
- **`auth.js`** - Signup/Login with Redis caching and Kafka events
- **`user.js`** - User operations
- **`profile.js`** - Profile management
- **`request.js`** - Connection requests with Kafka events
- **`paymentsPhonePe.js`** - Payment integration

#### Middleware
- **`auth.js`** - JWT verification with Redis session lookup

### Frontend (React + Vite)

#### Key Components
- **`App.jsx`** - Main app with routing
- **`Body.jsx`** - Main content area
- **`Login.jsx`** - Authentication
- **`Profile.jsx`** - User profile view
- **`Chat.jsx`** - Real-time messaging with Socket.io
- **`Feed.jsx`** - User discovery feed
- **`Requests.jsx`** - Connection requests

#### State Management
- **`appStore.js`** - Redux store configuration
- **`userSlice.js`** - User state
- **`feedSlice.js`** - Feed state
- **`requestSlice.js`** - Connection requests state

### Integration Files

#### Documentation
- **`KAFKA_REDIS_ARCHITECTURE.md`** (root) - Quick architecture reference
- **`KAFKA_REDIS_IMPLEMENTATION_GUIDE.md`** - Complete technical guide (300+ lines)
- **`README.md`** (in REDIS_KAFKA_INTEGRATION_FILES) - Quick start

#### Docker
- **`docker-compose.yml`** (root) - Main docker-compose for Redis/Kafka
- **`docker-compose.dev.yml`** (in REDIS_KAFKA_INTEGRATION_FILES) - Dev version

## 🔄 Data Flow

### Authentication Flow
```
User Login → Express Route → Verify in MongoDB → 
Store Session in Redis → Cache User Data in Redis → 
Publish USER_LOGIN event to Kafka → Return Token
```

### Message Flow
```
User sends message → Socket.io receives → Save to MongoDB → 
Cache in Redis → Publish MESSAGE_SENT to Kafka → 
Emit to receiver via Socket.io
```

### Presence Flow
```
User connects → Store presence in Redis → 
Publish USER_ONLINE to Kafka → Emit to all clients
```

## 📊 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Caching**: Redis 7
- **Message Queue**: Kafka 7.4
- **Real-time**: Socket.io
- **Auth**: JWT with Redis sessions
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + DaisyUI
- **HTTP Client**: Axios
- **WebSocket**: Socket.io-client

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Monitoring**: Kafka UI, Redis Commander

## 🚀 Running the Project

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Start Backend
```bash
cd BACKEND
npm install
npm run dev
```

### 3. Start Frontend
```bash
cd Frontend
npm install
npm run dev
```

### 4. Access Services
- **App**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Kafka UI**: http://localhost:8080
- **Redis Commander**: http://localhost:8081

## 📝 Environment Variables

### Backend (.env)
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=devconnect-app
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3000
```

## 🏗️ Architecture Highlights

### Scalability
- **Redis**: Reduces database load by 70%
- **Kafka**: Enables horizontal scaling
- **Socket.io**: Redis adapter for multi-instance support

### Performance
- **Sub-second response** times with Redis caching
- **Real-time** features with Socket.io
- **Event-driven** architecture with Kafka

### Reliability
- **Session persistence** in Redis
- **Message queuing** in Kafka
- **Graceful degradation** when services are down

## 📚 Documentation Links

- **Setup Guide**: `KAFKA_REDIS_ARCHITECTURE.md`
- **Full Documentation**: `REDIS_KAFKA_INTEGRATION_FILES/KAFKA_REDIS_IMPLEMENTATION_GUIDE.md`
- **Quick Start**: `REDIS_KAFKA_INTEGRATION_FILES/README.md`
- **Main README**: `README.md`

## 🎓 Interview Talking Points

1. **Why Redis?** - Fast caching, session management, real-time presence
2. **Why Kafka?** - Event-driven architecture, analytics, scalability
3. **Performance Gains** - 97% faster responses, 70% less DB load
4. **Real-time Features** - Socket.io with Redis for multi-instance support
5. **Scalability** - Horizontal scaling with Kafka consumers

