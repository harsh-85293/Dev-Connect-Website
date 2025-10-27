# DevConnect - High-Level Design (HLD)

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        MOBILE[Mobile Browser]
    end
    
    subgraph "CDN & Edge"
        VERCEL[Vercel CDN]
        STATIC[Static Assets]
    end
    
    subgraph "Frontend Application"
        REACT[React 19 + Vite]
        REDUX[Redux Toolkit]
        TAILWIND[Tailwind CSS + DaisyUI]
        SOCKET_CLIENT[Socket.IO Client]
    end
    
    subgraph "Load Balancer & Proxy"
        LB[Load Balancer]
        PROXY[Reverse Proxy]
    end
    
    subgraph "Backend Services"
        API[Node.js + Express API]
        SOCKET[Socket.IO Server]
        AUTH[Authentication Service]
        ML[ML Recommendation Engine]
        EMAIL[Email Service]
        PAYMENT[Payment Service]
    end
    
    subgraph "Data Layer"
        MONGODB[(MongoDB Atlas)]
        REDIS[(Redis Cache)]
        FILES[File Storage]
    end
    
    subgraph "External Services"
        PHONEPE[PhonePe Payment Gateway]
        SMTP[SMTP Email Provider]
        MONITORING[Monitoring & Logging]
    end
    
    subgraph "Background Services"
        CRON[Cron Jobs]
        WORKERS[Background Workers]
        QUEUE[Job Queue]
    end
    
    %% Client connections
    WEB --> VERCEL
    MOBILE --> VERCEL
    
    %% CDN to Frontend
    VERCEL --> STATIC
    STATIC --> REACT
    
    %% Frontend to Backend
    REACT --> API
    SOCKET_CLIENT --> SOCKET
    
    %% Load balancing
    API --> LB
    SOCKET --> LB
    LB --> PROXY
    
    %% Backend services
    PROXY --> API
    PROXY --> SOCKET
    API --> AUTH
    API --> ML
    API --> EMAIL
    API --> PAYMENT
    
    %% Data connections
    API --> MONGODB
    API --> REDIS
    SOCKET --> MONGODB
    SOCKET --> REDIS
    
    %% External integrations
    PAYMENT --> PHONEPE
    EMAIL --> SMTP
    API --> MONITORING
    
    %% Background processing
    CRON --> EMAIL
    WORKERS --> QUEUE
    QUEUE --> EMAIL
    QUEUE --> ML
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef data fill:#e8f5e8
    classDef external fill:#fff3e0
    classDef background fill:#fce4ec
    
    class REACT,REDUX,TAILWIND,SOCKET_CLIENT frontend
    class API,SOCKET,AUTH,ML,EMAIL,PAYMENT backend
    class MONGODB,REDIS,FILES data
    class PHONEPE,SMTP,MONITORING external
    class CRON,WORKERS,QUEUE background
```

## Component Interaction Diagram

```mermaid
graph LR
    subgraph "User Interface Layer"
        UI[React Components]
        STATE[Redux Store]
        ROUTER[React Router]
    end
    
    subgraph "API Gateway Layer"
        GATEWAY[Express Router]
        MIDDLEWARE[Auth Middleware]
        CORS[CORS Handler]
    end
    
    subgraph "Business Logic Layer"
        AUTH_SVC[Auth Service]
        USER_SVC[User Service]
        FEED_SVC[Feed Service]
        CHAT_SVC[Chat Service]
        PAYMENT_SVC[Payment Service]
        EMAIL_SVC[Email Service]
    end
    
    subgraph "Data Access Layer"
        USER_MODEL[User Model]
        MESSAGE_MODEL[Message Model]
        CONNECTION_MODEL[Connection Model]
        ML_UTILS[ML Utils]
    end
    
    subgraph "Infrastructure Layer"
        DB[(MongoDB)]
        CACHE[(Redis)]
        FILES[File Storage]
    end
    
    %% UI to Gateway
    UI --> GATEWAY
    STATE --> UI
    ROUTER --> UI
    
    %% Gateway to Business Logic
    GATEWAY --> MIDDLEWARE
    MIDDLEWARE --> AUTH_SVC
    MIDDLEWARE --> USER_SVC
    MIDDLEWARE --> FEED_SVC
    MIDDLEWARE --> CHAT_SVC
    MIDDLEWARE --> PAYMENT_SVC
    MIDDLEWARE --> EMAIL_SVC
    
    %% Business Logic to Data Access
    AUTH_SVC --> USER_MODEL
    USER_SVC --> USER_MODEL
    FEED_SVC --> USER_MODEL
    FEED_SVC --> ML_UTILS
    CHAT_SVC --> MESSAGE_MODEL
    PAYMENT_SVC --> USER_MODEL
    EMAIL_SVC --> USER_MODEL
    
    %% Data Access to Infrastructure
    USER_MODEL --> DB
    MESSAGE_MODEL --> DB
    CONNECTION_MODEL --> DB
    ML_UTILS --> CACHE
    
    %% Styling
    classDef ui fill:#e3f2fd
    classDef gateway fill:#f1f8e9
    classDef business fill:#fce4ec
    classDef data fill:#fff8e1
    classDef infra fill:#e8f5e8
    
    class UI,STATE,ROUTER ui
    class GATEWAY,MIDDLEWARE,CORS gateway
    class AUTH_SVC,USER_SVC,FEED_SVC,CHAT_SVC,PAYMENT_SVC,EMAIL_SVC business
    class USER_MODEL,MESSAGE_MODEL,CONNECTION_MODEL,ML_UTILS data
    class DB,CACHE,FILES infra
```

## Data Flow Architecture

```mermaid
flowchart TD
    subgraph "Client Side"
        BROWSER[Web Browser]
        REACT_APP[React Application]
        REDUX_STORE[Redux Store]
        LOCAL_STORAGE[Local Storage]
    end
    
    subgraph "Network Layer"
        HTTPS[HTTPS Requests]
        WEBSOCKET[WebSocket Connection]
        CDN[CDN Delivery]
    end
    
    subgraph "Server Side"
        EXPRESS[Express Server]
        SOCKET_IO[Socket.IO Server]
        MIDDLEWARE[Middleware Stack]
        ROUTES[API Routes]
    end
    
    subgraph "Business Logic"
        AUTH[Authentication]
        VALIDATION[Input Validation]
        ML_ENGINE[ML Recommendation Engine]
        EMAIL_SERVICE[Email Service]
        PAYMENT_SERVICE[Payment Service]
    end
    
    subgraph "Data Persistence"
        MONGODB[(MongoDB)]
        REDIS[(Redis Cache)]
        FILE_SYSTEM[File System]
    end
    
    subgraph "External APIs"
        PHONEPE_API[PhonePe API]
        SMTP_SERVER[SMTP Server]
        MONITORING[Monitoring Service]
    end
    
    %% Data flow
    BROWSER --> REACT_APP
    REACT_APP --> REDUX_STORE
    REDUX_STORE --> LOCAL_STORAGE
    
    REACT_APP --> HTTPS
    REACT_APP --> WEBSOCKET
    
    HTTPS --> CDN
    CDN --> EXPRESS
    WEBSOCKET --> SOCKET_IO
    
    EXPRESS --> MIDDLEWARE
    MIDDLEWARE --> ROUTES
    SOCKET_IO --> MIDDLEWARE
    
    ROUTES --> AUTH
    ROUTES --> VALIDATION
    ROUTES --> ML_ENGINE
    ROUTES --> EMAIL_SERVICE
    ROUTES --> PAYMENT_SERVICE
    
    AUTH --> MONGODB
    VALIDATION --> MONGODB
    ML_ENGINE --> REDIS
    EMAIL_SERVICE --> SMTP_SERVER
    PAYMENT_SERVICE --> PHONEPE_API
    
    MONGODB --> FILE_SYSTEM
    REDIS --> MONITORING
    
    %% Response flow
    MONGODB --> ROUTES
    REDIS --> ROUTES
    ROUTES --> EXPRESS
    EXPRESS --> HTTPS
    HTTPS --> REACT_APP
    
    %% Real-time flow
    SOCKET_IO --> WEBSOCKET
    WEBSOCKET --> REACT_APP
```

## Security Architecture

```mermaid
graph TB
    subgraph "Client Security"
        HTTPS_CLIENT[HTTPS Only]
        JWT_CLIENT[JWT in HttpOnly Cookies]
        CSP[Content Security Policy]
        XSS_PROTECTION[XSS Protection]
    end
    
    subgraph "Network Security"
        TLS[TLS 1.3]
        CORS[CORS Policy]
        RATE_LIMIT[Rate Limiting]
        FIREWALL[Firewall Rules]
    end
    
    subgraph "Application Security"
        AUTH_MIDDLEWARE[JWT Authentication]
        INPUT_VALIDATION[Input Validation]
        PASSWORD_HASH[bcrypt Password Hashing]
        SQL_INJECTION[NoSQL Injection Prevention]
    end
    
    subgraph "Data Security"
        ENCRYPTION[Data Encryption at Rest]
        BACKUP[Encrypted Backups]
        ACCESS_CONTROL[Role-based Access]
        AUDIT_LOG[Audit Logging]
    end
    
    subgraph "Infrastructure Security"
        VPC[Virtual Private Cloud]
        SECRETS[Secret Management]
        MONITORING[Security Monitoring]
        PATCHING[Regular Patching]
    end
    
    %% Security flow
    HTTPS_CLIENT --> TLS
    JWT_CLIENT --> AUTH_MIDDLEWARE
    CSP --> XSS_PROTECTION
    
    TLS --> CORS
    CORS --> RATE_LIMIT
    RATE_LIMIT --> FIREWALL
    
    AUTH_MIDDLEWARE --> INPUT_VALIDATION
    INPUT_VALIDATION --> PASSWORD_HASH
    PASSWORD_HASH --> SQL_INJECTION
    
    SQL_INJECTION --> ENCRYPTION
    ENCRYPTION --> BACKUP
    BACKUP --> ACCESS_CONTROL
    ACCESS_CONTROL --> AUDIT_LOG
    
    AUDIT_LOG --> VPC
    VPC --> SECRETS
    SECRETS --> MONITORING
    MONITORING --> PATCHING
    
    %% Styling
    classDef client fill:#e3f2fd
    classDef network fill:#f1f8e9
    classDef app fill:#fce4ec
    classDef data fill:#fff8e1
    classDef infra fill:#e8f5e8
    
    class HTTPS_CLIENT,JWT_CLIENT,CSP,XSS_PROTECTION client
    class TLS,CORS,RATE_LIMIT,FIREWALL network
    class AUTH_MIDDLEWARE,INPUT_VALIDATION,PASSWORD_HASH,SQL_INJECTION app
    class ENCRYPTION,BACKUP,ACCESS_CONTROL,AUDIT_LOG data
    class VPC,SECRETS,MONITORING,PATCHING infra
```

## Scalability Architecture

```mermaid
graph TB
    subgraph "Horizontal Scaling"
        LB[Load Balancer]
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance N]
        SOCKET1[Socket Instance 1]
        SOCKET2[Socket Instance 2]
        SOCKET3[Socket Instance N]
    end
    
    subgraph "Database Scaling"
        MONGODB_PRIMARY[(MongoDB Primary)]
        MONGODB_SECONDARY1[(MongoDB Secondary 1)]
        MONGODB_SECONDARY2[(MongoDB Secondary 2)]
        REDIS_CLUSTER[(Redis Cluster)]
    end
    
    subgraph "Caching Strategy"
        CDN_CACHE[CDN Cache]
        REDIS_CACHE[Redis Cache]
        APPLICATION_CACHE[Application Cache]
        BROWSER_CACHE[Browser Cache]
    end
    
    subgraph "Background Processing"
        QUEUE_MANAGER[Queue Manager]
        WORKER1[Worker 1]
        WORKER2[Worker 2]
        WORKER3[Worker N]
    end
    
    subgraph "Monitoring & Auto-scaling"
        METRICS[Metrics Collection]
        ALERTS[Alert System]
        AUTO_SCALE[Auto Scaling]
        HEALTH_CHECK[Health Checks]
    end
    
    %% Scaling connections
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> SOCKET1
    API2 --> SOCKET2
    API3 --> SOCKET3
    
    %% Database connections
    API1 --> MONGODB_PRIMARY
    API2 --> MONGODB_PRIMARY
    API3 --> MONGODB_PRIMARY
    
    MONGODB_PRIMARY --> MONGODB_SECONDARY1
    MONGODB_PRIMARY --> MONGODB_SECONDARY2
    
    API1 --> REDIS_CLUSTER
    API2 --> REDIS_CLUSTER
    API3 --> REDIS_CLUSTER
    
    %% Caching flow
    CDN_CACHE --> REDIS_CACHE
    REDIS_CACHE --> APPLICATION_CACHE
    APPLICATION_CACHE --> BROWSER_CACHE
    
    %% Background processing
    QUEUE_MANAGER --> WORKER1
    QUEUE_MANAGER --> WORKER2
    QUEUE_MANAGER --> WORKER3
    
    %% Monitoring
    METRICS --> ALERTS
    ALERTS --> AUTO_SCALE
    AUTO_SCALE --> HEALTH_CHECK
    HEALTH_CHECK --> LB
    
    %% Styling
    classDef scaling fill:#e3f2fd
    classDef database fill:#f1f8e9
    classDef cache fill:#fce4ec
    classDef background fill:#fff8e1
    classDef monitoring fill:#e8f5e8
    
    class LB,API1,API2,API3,SOCKET1,SOCKET2,SOCKET3 scaling
    class MONGODB_PRIMARY,MONGODB_SECONDARY1,MONGODB_SECONDARY2,REDIS_CLUSTER database
    class CDN_CACHE,REDIS_CACHE,APPLICATION_CACHE,BROWSER_CACHE cache
    class QUEUE_MANAGER,WORKER1,WORKER2,WORKER3 background
    class METRICS,ALERTS,AUTO_SCALE,HEALTH_CHECK monitoring
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DEV_LOCAL[Local Development]
        DEV_SERVER[Development Server]
        DEV_DB[(Dev Database)]
    end
    
    subgraph "Staging Environment"
        STAGING_FRONTEND[Staging Frontend]
        STAGING_BACKEND[Staging Backend]
        STAGING_DB[(Staging Database)]
    end
    
    subgraph "Production Environment"
        PROD_CDN[Vercel CDN]
        PROD_FRONTEND[Production Frontend]
        PROD_BACKEND[Production Backend]
        PROD_DB[(Production Database)]
    end
    
    subgraph "CI/CD Pipeline"
        GITHUB[GitHub Repository]
        BUILD[Build Process]
        TEST[Automated Tests]
        DEPLOY[Deployment]
    end
    
    subgraph "Monitoring & Logging"
        LOGS[Application Logs]
        METRICS[Performance Metrics]
        ALERTS[Alert Notifications]
    end
    
    %% Development flow
    DEV_LOCAL --> DEV_SERVER
    DEV_SERVER --> DEV_DB
    
    %% Staging flow
    DEV_SERVER --> STAGING_FRONTEND
    DEV_SERVER --> STAGING_BACKEND
    STAGING_BACKEND --> STAGING_DB
    
    %% Production flow
    STAGING_FRONTEND --> PROD_CDN
    STAGING_BACKEND --> PROD_BACKEND
    PROD_CDN --> PROD_FRONTEND
    PROD_BACKEND --> PROD_DB
    
    %% CI/CD flow
    GITHUB --> BUILD
    BUILD --> TEST
    TEST --> DEPLOY
    DEPLOY --> STAGING_FRONTEND
    DEPLOY --> STAGING_BACKEND
    
    %% Monitoring
    PROD_FRONTEND --> LOGS
    PROD_BACKEND --> LOGS
    LOGS --> METRICS
    METRICS --> ALERTS
    
    %% Styling
    classDef dev fill:#e3f2fd
    classDef staging fill:#f1f8e9
    classDef prod fill:#fce4ec
    classDef cicd fill:#fff8e1
    classDef monitoring fill:#e8f5e8
    
    class DEV_LOCAL,DEV_SERVER,DEV_DB dev
    class STAGING_FRONTEND,STAGING_BACKEND,STAGING_DB staging
    class PROD_CDN,PROD_FRONTEND,PROD_BACKEND,PROD_DB prod
    class GITHUB,BUILD,TEST,DEPLOY cicd
    class LOGS,METRICS,ALERTS monitoring
```

