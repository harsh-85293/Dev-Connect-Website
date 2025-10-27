# DevConnect - Workflow Diagrams

## 1. User Registration & Authentication Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Node.js)
    participant DB as MongoDB
    participant E as Email Service

    U->>F: Fill signup form
    F->>B: POST /signup (userData)
    B->>B: Validate input data
    B->>B: Hash password with bcrypt
    B->>DB: Create new user document
    DB-->>B: User created successfully
    B->>B: Generate JWT token
    B->>F: Set HttpOnly cookie + user data
    B->>E: Send welcome email (async)
    F->>U: Redirect to dashboard
    F->>B: GET /profile/view (with cookie)
    B->>B: Verify JWT from cookie
    B->>DB: Fetch user profile
    DB-->>B: User profile data
    B->>F: Return profile data
    F->>U: Display profile
```

## 2. Feed Discovery & ML Recommendations Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Node.js)
    participant ML as ML Engine
    participant DB as MongoDB

    U->>F: Visit feed page
    F->>B: GET /feed?ml=true&limit=10
    B->>B: Verify JWT authentication
    B->>DB: Get user's connection requests
    DB-->>B: Existing connections/interactions
    B->>B: Build hidden users set
    B->>DB: Find available users (exclude hidden)
    DB-->>B: Candidate users list
    
    alt ML Recommendations Enabled
        B->>ML: rankUsersByRecommendation(user, candidates)
        ML->>ML: Calculate Jaccard similarity
        ML->>ML: Calculate cosine similarity
        ML->>ML: Calculate complementary skills
        ML->>ML: Calculate diversity score
        ML->>ML: Calculate experience score
        ML->>ML: Generate weighted final score
        ML-->>B: Ranked users with scores
        B->>B: Apply pagination
    else Standard Random Feed
        B->>B: Randomize user order
    end
    
    B->>F: Return feed data + analytics
    F->>U: Display user cards with recommendations
```

## 3. Connection Request Workflow

```mermaid
sequenceDiagram
    participant U1 as User A
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant E as Email Service

    U1->>F: Click "Connect" on user card
    F->>B: POST /request/send (targetUserId)
    B->>B: Verify JWT authentication
    B->>B: Validate request (not self, not duplicate)
    B->>DB: Create connection request
    DB-->>B: Request created
    B->>F: Success response
    
    Note over B,E: Async email notification
    B->>E: Send connection request email
    E-->>B: Email sent
    
    Note over U2: User B receives notification
    U2->>F: Visit requests page
    F->>B: GET /user/requests/received
    B->>DB: Find pending requests
    DB-->>B: Connection requests
    B->>F: Return requests list
    F->>U2: Display pending requests
    
    U2->>F: Accept/Reject request
    F->>B: PATCH /user/requests/:id/respond
    B->>DB: Update request status
    DB-->>B: Status updated
    B->>F: Success response
    F->>U2: Show updated status
```

## 4. Real-time Chat Workflow

```mermaid
sequenceDiagram
    participant U1 as User A
    participant U2 as User B
    participant F1 as Frontend A
    participant F2 as Frontend B
    participant S as Socket.IO Server
    participant DB as MongoDB

    U1->>F1: Open chat with User B
    F1->>S: Socket connect + register(userId)
    S->>S: Map userId to socketId
    S->>F1: Connection established
    
    U2->>F2: Open chat with User A
    F2->>S: Socket connect + register(userId)
    S->>S: Map userId to socketId
    S->>F2: Connection established
    
    U1->>F1: Type message
    F1->>S: emit "private-message" (toUserId, message)
    S->>S: Validate sender/recipient
    S->>DB: Save message to Messages collection
    DB-->>S: Message saved
    
    S->>F1: emit "private-message" (ack to sender)
    S->>F2: emit "private-message" (to recipient)
    F1->>U1: Show message sent
    F2->>U2: Show incoming message
    
    Note over S: Presence tracking
    S->>F1: emit "presence" (User B online)
    S->>F2: emit "presence" (User A online)
```

## 5. Payment & Premium Activation Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant P as PhonePe API
    participant DB as MongoDB

    U->>F: Click "Upgrade to Premium"
    F->>B: POST /payments/phonepe/create
    B->>B: Verify JWT authentication
    B->>B: Generate merchant transaction ID
    B->>B: Create PhonePe payload
    B->>B: Generate X-VERIFY signature
    B->>P: POST /pg/v1/pay
    P-->>B: Payment URL + transaction ID
    B->>F: Return payment URL
    F->>U: Redirect to PhonePe payment page
    
    U->>P: Complete payment
    P->>F: Redirect to success page
    F->>B: POST /payments/phonepe/confirm
    B->>B: Verify JWT authentication
    B->>P: GET /pg/v1/status/{merchantId}/{txnId}
    P-->>B: Payment status
    B->>B: Verify payment success
    B->>DB: Update user (isPremium=true, membershipTier)
    DB-->>B: User updated
    B->>F: Return updated user data
    F->>U: Show premium activated
```

## 6. Email Notification Workflow

```mermaid
sequenceDiagram
    participant S as System
    participant C as Cron Job
    participant B as Backend
    participant E as Email Service
    participant DB as MongoDB

    Note over C: Daily cron job (9 AM)
    C->>B: Trigger weekly reminder check
    B->>DB: Find users with email preferences enabled
    DB-->>B: User list with preferences
    
    loop For each user
        B->>DB: Get user's recent activity
        DB-->>B: Activity data
        B->>B: Generate personalized recommendations
        B->>E: Send weekly reminder email
        E-->>B: Email sent confirmation
    end
    
    Note over S: Real-time notifications
    S->>B: Connection request received
    B->>DB: Check recipient's email preferences
    DB-->>B: Email preferences
    alt Email notifications enabled
        B->>E: Send connection request email
        E-->>B: Email sent
    end
```

## 7. System Health & Monitoring Workflow

```mermaid
sequenceDiagram
    participant M as Monitoring Service
    participant B as Backend
    participant DB as MongoDB
    participant R as Redis (if configured)
    participant L as Logging Service

    Note over M: Health check every 30 seconds
    M->>B: GET /healthz
    B-->>M: "ok" response
    
    Note over B: Application monitoring
    B->>B: Log API requests/responses
    B->>L: Send structured logs
    
    Note over B: Database monitoring
    B->>DB: Health check query
    DB-->>B: Connection status
    B->>L: Log database metrics
    
    Note over B: Error handling
    B->>B: Catch and log errors
    B->>L: Send error logs with stack traces
    
    Note over M: Alert on failures
    M->>M: Detect service down
    M->>M: Send alert notification
```

## 8. Data Flow Architecture

```mermaid
flowchart TD
    A[User Browser] -->|HTTPS| B[Vercel CDN]
    B -->|Static Assets| C[React Frontend]
    C -->|API Calls| D[Backend API]
    D -->|JWT Auth| E[Authentication Middleware]
    E -->|Validated Requests| F[Route Handlers]
    F -->|CRUD Operations| G[MongoDB Database]
    F -->|Real-time Events| H[Socket.IO Server]
    H -->|WebSocket| C
    F -->|Background Jobs| I[Email Service]
    F -->|Payment Processing| J[PhonePe API]
    F -->|ML Processing| K[Recommendation Engine]
    K -->|Scored Results| F
    
    subgraph "Frontend Layer"
        C
        L[Redux Store]
        M[Component State]
    end
    
    subgraph "Backend Layer"
        D
        E
        F
        N[ML Utils]
        O[Email Templates]
    end
    
    subgraph "Data Layer"
        G
        P[User Collection]
        Q[Messages Collection]
        R[ConnectionRequests Collection]
    end
    
    subgraph "External Services"
        I
        J
        S[SMTP Provider]
    end
```

