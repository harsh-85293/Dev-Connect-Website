# DevConnect - Low-Level Design (LLD)

## Database Schema Design

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String firstName
        String lastName
        String emailId UK
        String password
        Number age
        String gender
        String photoUrl
        String about
        Array skills
        Object emailPreferences
        Boolean isPremium
        Date premiumActivatedAt
        String membershipTier
        Date createdAt
        Date updatedAt
    }
    
    MESSAGE {
        ObjectId _id PK
        ObjectId fromUserId FK
        ObjectId toUserId FK
        String text
        Date ts
        Date createdAt
        Date updatedAt
    }
    
    CONNECTIONREQUEST {
        ObjectId _id PK
        ObjectId fromUserId FK
        ObjectId toUserId FK
        String status
        Date createdAt
        Date updatedAt
    }
    
    PAYMENT {
        ObjectId _id PK
        ObjectId userId FK
        String providerOrderId
        Number amount
        String currency
        String status
        Object providerPayload
        Date createdAt
        Date processedAt
    }
    
    USER ||--o{ MESSAGE : sends
    USER ||--o{ MESSAGE : receives
    USER ||--o{ CONNECTIONREQUEST : sends
    USER ||--o{ CONNECTIONREQUEST : receives
    USER ||--o{ PAYMENT : makes
```

## API Endpoint Design

```mermaid
graph TB
    subgraph "Authentication Routes"
        AUTH_SIGNUP[POST /signup]
        AUTH_LOGIN[POST /login]
        AUTH_LOGOUT[POST /logout]
    end
    
    subgraph "User Routes"
        USER_REQUESTS[GET /user/requests/received]
        USER_CONNECTIONS[GET /user/connections]
        USER_CHAT[GET /chat/:targetUserId/history]
        USER_FEED[GET /feed]
        USER_UPDATE[PATCH /user/:userId]
        USER_RESPOND[PATCH /user/requests/:requestId/respond]
    end
    
    subgraph "Profile Routes"
        PROFILE_VIEW[GET /profile/view]
        PROFILE_EDIT[PATCH /profile/edit]
    end
    
    subgraph "Request Routes"
        REQUEST_SEND[POST /request/send]
        REQUEST_STATUS[GET /request/status]
    end
    
    subgraph "Email Routes"
        EMAIL_PREFERENCES[GET /email-preferences]
        EMAIL_UPDATE[PATCH /email-preferences]
    end
    
    subgraph "Payment Routes"
        PAYMENT_CREATE[POST /payments/phonepe/create]
        PAYMENT_CONFIRM[POST /payments/phonepe/confirm]
        PAYMENT_CALLBACK[POST /payments/phonepe/callback]
    end
    
    subgraph "Socket Events"
        SOCKET_REGISTER[socket.on register]
        SOCKET_MESSAGE[socket.on private-message]
        SOCKET_PRESENCE[socket.on presence:query]
        SOCKET_DISCONNECT[socket.on disconnect]
    end
    
    %% Route connections
    AUTH_SIGNUP --> USER_MODEL
    AUTH_LOGIN --> USER_MODEL
    USER_REQUESTS --> CONNECTION_MODEL
    USER_CONNECTIONS --> CONNECTION_MODEL
    USER_CHAT --> MESSAGE_MODEL
    USER_FEED --> ML_ENGINE
    PROFILE_VIEW --> USER_MODEL
    PROFILE_EDIT --> USER_MODEL
    REQUEST_SEND --> CONNECTION_MODEL
    PAYMENT_CREATE --> PHONEPE_API
    PAYMENT_CONFIRM --> USER_MODEL
    
    %% Socket connections
    SOCKET_REGISTER --> USER_MODEL
    SOCKET_MESSAGE --> MESSAGE_MODEL
    SOCKET_PRESENCE --> USER_MODEL
```

## Component Architecture (Frontend)

```mermaid
graph TB
    subgraph "App Structure"
        APP[App.jsx]
        ROUTER[BrowserRouter]
        PROVIDER[Redux Provider]
        THEME[Theme Provider]
    end
    
    subgraph "Layout Components"
        NAVBAR[NavBar.jsx]
        FOOTER[Footer.jsx]
        BODY[Body.jsx]
    end
    
    subgraph "Page Components"
        LOGIN[Login.jsx]
        PROFILE[Profile.jsx]
        EDIT_PROFILE[EditProfile.jsx]
        FEED[Feed.jsx]
        CONNECTIONS[Connections.jsx]
        REQUESTS[Requests.jsx]
        CHAT[Chat.jsx]
        PREMIUM[Premium.jsx]
        CHECKOUT[Checkout.jsx]
    end
    
    subgraph "Utility Components"
        USER_CARD[userCard.jsx]
        THEME_TOGGLE[ThemeToggle.jsx]
        CHATBOT[AIChatbot.jsx]
        CHATBOT_WRAPPER[ChatbotWrapper.jsx]
    end
    
    subgraph "Redux Store"
        USER_SLICE[userSlice.js]
        FEED_SLICE[feedSlice.js]
        CONNECTION_SLICE[connectionSlice.js]
        REQUEST_SLICE[requestSlice.js]
        APP_STORE[appStore.js]
    end
    
    subgraph "Utils & Services"
        API[api.js]
        CONSTANTS[constants.js]
        THEME_CONTEXT[ThemeContext.jsx]
    end
    
    %% Component hierarchy
    APP --> ROUTER
    ROUTER --> PROVIDER
    PROVIDER --> THEME
    THEME --> NAVBAR
    THEME --> BODY
    THEME --> FOOTER
    
    BODY --> FEED
    BODY --> PROFILE
    BODY --> CONNECTIONS
    BODY --> REQUESTS
    
    %% Redux connections
    PROVIDER --> APP_STORE
    APP_STORE --> USER_SLICE
    APP_STORE --> FEED_SLICE
    APP_STORE --> CONNECTION_SLICE
    APP_STORE --> REQUEST_SLICE
    
    %% API connections
    FEED --> API
    PROFILE --> API
    CONNECTIONS --> API
    REQUESTS --> API
    LOGIN --> API
    CHECKOUT --> API
    
    %% Utility connections
    FEED --> USER_CARD
    PROFILE --> EDIT_PROFILE
    CHAT --> CHATBOT_WRAPPER
    CHATBOT_WRAPPER --> CHATBOT
```

## ML Recommendation Engine Design

```mermaid
graph TB
    subgraph "Input Processing"
        USER_INPUT[Current User Profile]
        CANDIDATES[Available Users]
        FILTERS[Exclusion Filters]
    end
    
    subgraph "Feature Extraction"
        SKILLS_NORMALIZE[Skill Normalization]
        CATEGORY_MAPPING[Category Mapping]
        WEIGHT_CALCULATION[Weight Calculation]
    end
    
    subgraph "Similarity Algorithms"
        JACCARD[Jaccard Similarity]
        COSINE[Cosine Similarity]
        COMPLEMENTARY[Complementary Skills]
        DIVERSITY[Skill Diversity]
        EXPERIENCE[Experience Level]
    end
    
    subgraph "Scoring & Ranking"
        WEIGHTED_SCORE[Weighted Score Calculation]
        RANKING[User Ranking]
        FILTERING[Score Filtering]
        PAGINATION[Pagination]
    end
    
    subgraph "Output Generation"
        RECOMMENDATIONS[Ranked Recommendations]
        REASONING[Recommendation Reasoning]
        METADATA[Analytics Metadata]
    end
    
    %% Processing flow
    USER_INPUT --> SKILLS_NORMALIZE
    CANDIDATES --> SKILLS_NORMALIZE
    FILTERS --> SKILLS_NORMALIZE
    
    SKILLS_NORMALIZE --> CATEGORY_MAPPING
    CATEGORY_MAPPING --> WEIGHT_CALCULATION
    
    WEIGHT_CALCULATION --> JACCARD
    WEIGHT_CALCULATION --> COSINE
    WEIGHT_CALCULATION --> COMPLEMENTARY
    WEIGHT_CALCULATION --> DIVERSITY
    WEIGHT_CALCULATION --> EXPERIENCE
    
    JACCARD --> WEIGHTED_SCORE
    COSINE --> WEIGHTED_SCORE
    COMPLEMENTARY --> WEIGHTED_SCORE
    DIVERSITY --> WEIGHTED_SCORE
    EXPERIENCE --> WEIGHTED_SCORE
    
    WEIGHTED_SCORE --> RANKING
    RANKING --> FILTERING
    FILTERING --> PAGINATION
    
    PAGINATION --> RECOMMENDATIONS
    RECOMMENDATIONS --> REASONING
    RECOMMENDATIONS --> METADATA
    
    %% Styling
    classDef input fill:#e3f2fd
    classDef feature fill:#f1f8e9
    classDef algorithm fill:#fce4ec
    classDef scoring fill:#fff8e1
    classDef output fill:#e8f5e8
    
    class USER_INPUT,CANDIDATES,FILTERS input
    class SKILLS_NORMALIZE,CATEGORY_MAPPING,WEIGHT_CALCULATION feature
    class JACCARD,COSINE,COMPLEMENTARY,DIVERSITY,EXPERIENCE algorithm
    class WEIGHTED_SCORE,RANKING,FILTERING,PAGINATION scoring
    class RECOMMENDATIONS,REASONING,METADATA output
```

## Socket.IO Event Flow Design

```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant C2 as Client 2
    participant S as Socket.IO Server
    participant DB as MongoDB
    participant M as Message Model
    
    Note over C1,S: Connection Establishment
    C1->>S: socket.connect()
    S->>S: Generate socket.id
    S-->>C1: connection event
    
    Note over C1,S: User Registration
    C1->>S: emit("register", userId)
    S->>S: Map userId to socketId
    S->>S: Store in userIdToSocketId Map
    S->>S: Store in socketIdToUserId Map
    S-->>C1: Registration confirmed
    
    Note over S,C2: Broadcast Presence
    S->>C2: emit("presence", {userId, online: true})
    
    Note over C1,C2: Message Exchange
    C1->>S: emit("private-message", {toUserId, message, fromUserId})
    S->>S: Validate sender/recipient
    S->>M: Create message document
    M->>DB: Save message
    DB-->>M: Message saved
    M-->>S: Save confirmation
    
    S-->>C1: emit("private-message", {message, fromUserId, ts})
    
    alt Recipient Online
        S->>S: Lookup recipient socketId
        S-->>C2: emit("private-message", {message, fromUserId, ts})
    else Recipient Offline
        Note over S: Message stored for later delivery
    end
    
    Note over C1,S: Presence Query
    C1->>S: emit("presence:query", {userId})
    S->>S: Check userIdToSocketId Map
    S-->>C1: emit("presence:state", {userId, online})
    
    Note over C1,S: Disconnection
    C1->>S: socket.disconnect()
    S->>S: Remove from Maps
    S->>C2: emit("presence", {userId, online: false})
    S-->>C1: disconnect event
```

## Authentication & Authorization Flow

```mermaid
graph TB
    subgraph "Authentication Process"
        LOGIN_REQUEST[Login Request]
        CREDENTIAL_CHECK[Validate Credentials]
        JWT_GENERATION[Generate JWT Token]
        COOKIE_SET[Set HttpOnly Cookie]
        USER_CONTEXT[Attach User Context]
    end
    
    subgraph "Authorization Middleware"
        TOKEN_EXTRACT[Extract Token from Cookie]
        TOKEN_VERIFY[Verify JWT Signature]
        USER_LOOKUP[Lookup User in Database]
        REQUEST_ATTACH[Attach User to Request]
    end
    
    subgraph "Protected Routes"
        PROFILE_ROUTES[Profile Routes]
        FEED_ROUTES[Feed Routes]
        CHAT_ROUTES[Chat Routes]
        PAYMENT_ROUTES[Payment Routes]
    end
    
    subgraph "Socket Authentication"
        SOCKET_CONNECT[Socket Connection]
        SOCKET_TOKEN[Token Validation]
        SOCKET_REGISTER[User Registration]
        PRESENCE_TRACK[Presence Tracking]
    end
    
    %% Authentication flow
    LOGIN_REQUEST --> CREDENTIAL_CHECK
    CREDENTIAL_CHECK --> JWT_GENERATION
    JWT_GENERATION --> COOKIE_SET
    COOKIE_SET --> USER_CONTEXT
    
    %% Authorization flow
    USER_CONTEXT --> TOKEN_EXTRACT
    TOKEN_EXTRACT --> TOKEN_VERIFY
    TOKEN_VERIFY --> USER_LOOKUP
    USER_LOOKUP --> REQUEST_ATTACH
    
    %% Route protection
    REQUEST_ATTACH --> PROFILE_ROUTES
    REQUEST_ATTACH --> FEED_ROUTES
    REQUEST_ATTACH --> CHAT_ROUTES
    REQUEST_ATTACH --> PAYMENT_ROUTES
    
    %% Socket authentication
    SOCKET_CONNECT --> SOCKET_TOKEN
    SOCKET_TOKEN --> SOCKET_REGISTER
    SOCKET_REGISTER --> PRESENCE_TRACK
    
    %% Styling
    classDef auth fill:#e3f2fd
    classDef middleware fill:#f1f8e9
    classDef routes fill:#fce4ec
    classDef socket fill:#fff8e1
    
    class LOGIN_REQUEST,CREDENTIAL_CHECK,JWT_GENERATION,COOKIE_SET,USER_CONTEXT auth
    class TOKEN_EXTRACT,TOKEN_VERIFY,USER_LOOKUP,REQUEST_ATTACH middleware
    class PROFILE_ROUTES,FEED_ROUTES,CHAT_ROUTES,PAYMENT_ROUTES routes
    class SOCKET_CONNECT,SOCKET_TOKEN,SOCKET_REGISTER,PRESENCE_TRACK socket
```

## Payment Integration Design

```mermaid
graph TB
    subgraph "Payment Initiation"
        PREMIUM_REQUEST[Premium Upgrade Request]
        PAYMENT_CREATE[Create Payment Session]
        PHONEPE_PAYLOAD[Generate PhonePe Payload]
        SIGNATURE_GEN[Generate X-VERIFY Signature]
    end
    
    subgraph "PhonePe Integration"
        PHONEPE_API[PhonePe API Call]
        PAYMENT_URL[Payment URL Generation]
        REDIRECT[Redirect to Payment Page]
    end
    
    subgraph "Payment Processing"
        USER_PAYMENT[User Payment on PhonePe]
        CALLBACK_URL[Callback URL]
        STATUS_CHECK[Payment Status Check]
        VERIFICATION[Payment Verification]
    end
    
    subgraph "Premium Activation"
        USER_UPDATE[Update User Premium Status]
        MEMBERSHIP_TIER[Set Membership Tier]
        ACTIVATION_DATE[Set Activation Date]
        SUCCESS_RESPONSE[Success Response]
    end
    
    %% Payment flow
    PREMIUM_REQUEST --> PAYMENT_CREATE
    PAYMENT_CREATE --> PHONEPE_PAYLOAD
    PHONEPE_PAYLOAD --> SIGNATURE_GEN
    
    SIGNATURE_GEN --> PHONEPE_API
    PHONEPE_API --> PAYMENT_URL
    PAYMENT_URL --> REDIRECT
    
    REDIRECT --> USER_PAYMENT
    USER_PAYMENT --> CALLBACK_URL
    CALLBACK_URL --> STATUS_CHECK
    STATUS_CHECK --> VERIFICATION
    
    VERIFICATION --> USER_UPDATE
    USER_UPDATE --> MEMBERSHIP_TIER
    MEMBERSHIP_TIER --> ACTIVATION_DATE
    ACTIVATION_DATE --> SUCCESS_RESPONSE
    
    %% Styling
    classDef initiation fill:#e3f2fd
    classDef integration fill:#f1f8e9
    classDef processing fill:#fce4ec
    classDef activation fill:#fff8e1
    
    class PREMIUM_REQUEST,PAYMENT_CREATE,PHONEPE_PAYLOAD,SIGNATURE_GEN initiation
    class PHONEPE_API,PAYMENT_URL,REDIRECT integration
    class USER_PAYMENT,CALLBACK_URL,STATUS_CHECK,VERIFICATION processing
    class USER_UPDATE,MEMBERSHIP_TIER,ACTIVATION_DATE,SUCCESS_RESPONSE activation
```

## Error Handling & Logging Design

```mermaid
graph TB
    subgraph "Error Types"
        VALIDATION_ERROR[Validation Errors]
        AUTH_ERROR[Authentication Errors]
        DATABASE_ERROR[Database Errors]
        EXTERNAL_API_ERROR[External API Errors]
        SOCKET_ERROR[Socket.IO Errors]
    end
    
    subgraph "Error Handling"
        TRY_CATCH[Try-Catch Blocks]
        ERROR_MIDDLEWARE[Error Middleware]
        CUSTOM_ERRORS[Custom Error Classes]
        ERROR_RESPONSE[Error Response Format]
    end
    
    subgraph "Logging System"
        REQUEST_LOG[Request Logging]
        ERROR_LOG[Error Logging]
        PERFORMANCE_LOG[Performance Logging]
        AUDIT_LOG[Audit Logging]
    end
    
    subgraph "Monitoring"
        HEALTH_CHECK[Health Check Endpoint]
        METRICS_COLLECTION[Metrics Collection]
        ALERT_SYSTEM[Alert System]
        DASHBOARD[Monitoring Dashboard]
    end
    
    %% Error handling flow
    VALIDATION_ERROR --> TRY_CATCH
    AUTH_ERROR --> TRY_CATCH
    DATABASE_ERROR --> TRY_CATCH
    EXTERNAL_API_ERROR --> TRY_CATCH
    SOCKET_ERROR --> TRY_CATCH
    
    TRY_CATCH --> ERROR_MIDDLEWARE
    ERROR_MIDDLEWARE --> CUSTOM_ERRORS
    CUSTOM_ERRORS --> ERROR_RESPONSE
    
    %% Logging flow
    ERROR_RESPONSE --> REQUEST_LOG
    ERROR_RESPONSE --> ERROR_LOG
    ERROR_RESPONSE --> PERFORMANCE_LOG
    ERROR_RESPONSE --> AUDIT_LOG
    
    %% Monitoring flow
    REQUEST_LOG --> HEALTH_CHECK
    ERROR_LOG --> METRICS_COLLECTION
    PERFORMANCE_LOG --> METRICS_COLLECTION
    AUDIT_LOG --> METRICS_COLLECTION
    
    METRICS_COLLECTION --> ALERT_SYSTEM
    ALERT_SYSTEM --> DASHBOARD
    
    %% Styling
    classDef error fill:#e3f2fd
    classDef handling fill:#f1f8e9
    classDef logging fill:#fce4ec
    classDef monitoring fill:#fff8e1
    
    class VALIDATION_ERROR,AUTH_ERROR,DATABASE_ERROR,EXTERNAL_API_ERROR,SOCKET_ERROR error
    class TRY_CATCH,ERROR_MIDDLEWARE,CUSTOM_ERRORS,ERROR_RESPONSE handling
    class REQUEST_LOG,ERROR_LOG,PERFORMANCE_LOG,AUDIT_LOG logging
    class HEALTH_CHECK,METRICS_COLLECTION,ALERT_SYSTEM,DASHBOARD monitoring
```

## Performance Optimization Design

```mermaid
graph TB
    subgraph "Frontend Optimization"
        CODE_SPLITTING[Code Splitting]
        LAZY_LOADING[Lazy Loading]
        MEMOIZATION[React Memoization]
        BUNDLE_OPTIMIZATION[Bundle Optimization]
    end
    
    subgraph "Backend Optimization"
        DATABASE_INDEXING[Database Indexing]
        QUERY_OPTIMIZATION[Query Optimization]
        CACHING_STRATEGY[Caching Strategy]
        CONNECTION_POOLING[Connection Pooling]
    end
    
    subgraph "Network Optimization"
        CDN_USAGE[CDN Usage]
        COMPRESSION[Response Compression]
        HTTP_CACHING[HTTP Caching]
        WEBSOCKET_OPTIMIZATION[WebSocket Optimization]
    end
    
    subgraph "ML Optimization"
        ALGORITHM_EFFICIENCY[Algorithm Efficiency]
        CACHED_RECOMMENDATIONS[Cached Recommendations]
        BATCH_PROCESSING[Batch Processing]
        INCREMENTAL_UPDATES[Incremental Updates]
    end
    
    %% Optimization flow
    CODE_SPLITTING --> LAZY_LOADING
    LAZY_LOADING --> MEMOIZATION
    MEMOIZATION --> BUNDLE_OPTIMIZATION
    
    DATABASE_INDEXING --> QUERY_OPTIMIZATION
    QUERY_OPTIMIZATION --> CACHING_STRATEGY
    CACHING_STRATEGY --> CONNECTION_POOLING
    
    CDN_USAGE --> COMPRESSION
    COMPRESSION --> HTTP_CACHING
    HTTP_CACHING --> WEBSOCKET_OPTIMIZATION
    
    ALGORITHM_EFFICIENCY --> CACHED_RECOMMENDATIONS
    CACHED_RECOMMENDATIONS --> BATCH_PROCESSING
    BATCH_PROCESSING --> INCREMENTAL_UPDATES
    
    %% Styling
    classDef frontend fill:#e3f2fd
    classDef backend fill:#f1f8e9
    classDef network fill:#fce4ec
    classDef ml fill:#fff8e1
    
    class CODE_SPLITTING,LAZY_LOADING,MEMOIZATION,BUNDLE_OPTIMIZATION frontend
    class DATABASE_INDEXING,QUERY_OPTIMIZATION,CACHING_STRATEGY,CONNECTION_POOLING backend
    class CDN_USAGE,COMPRESSION,HTTP_CACHING,WEBSOCKET_OPTIMIZATION network
    class ALGORITHM_EFFICIENCY,CACHED_RECOMMENDATIONS,BATCH_PROCESSING,INCREMENTAL_UPDATES ml
```

