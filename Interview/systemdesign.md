# DevConnect — System Design (HLD + LLD)

A compact, interview‑ready system design for DevConnect: goals, architecture, data model, flows, scaling, security and ops notes.

---

## Goals & Non‑functional Requirements

- Functional: user profiles, personalized feed, connection requests, realtime private chat, email notifications, payments.  
- Non‑functional: low message latency (<100ms online), feed responsiveness (<300ms cached), secure payments, horizontal scalability, observability and resilience.

---

## High‑Level Architecture (components)

- Client: React + Vite + Redux (web). Uses HTTPS REST and Socket.IO.  
- API: Node.js + Express (stateless REST + Socket.IO endpoints).  
- Realtime: Socket.IO (single process -> Redis adapter for multi‑instance).  
- DB: MongoDB (users, messages, connectionRequests, payments).  
- Cache/PubSub: Redis (cache, socket adapter, rate limits).  
- Workers: Background jobs (BullMQ + Redis) for email, ML recompute, retries.  
- External: PhonePe (payments), transactional email provider (SMTP/SendGrid).  
- Infra: Frontend CDN (Vercel), backend containers (K8s/ECS), managed MongoDB + Redis.

---

## Key Data Models (fields + recommended indexes)

- User
  - Fields: _id, name, email (unique), passwordHash, skills[], headline, location, bio, prefs, createdAt
  - Indexes: { email:1 }, text index on name/skills/bio

- Message
  - Fields: _id, conversationId, fromUserId, toUserId, text, attachments[], status, createdAt
  - Indexes: { conversationId:1, createdAt:-1 }, { fromUserId:1, toUserId:1 }

- ConnectionRequest
  - Fields: _id, fromUserId, toUserId, status, message, createdAt, updatedAt
  - Indexes: { toUserId:1, fromUserId:1 }

- Payment
  - Fields: _id, userId, providerOrderId, amount, currency, status, providerPayload, createdAt, processedAt
  - Indexes: { providerOrderId:1 }, { userId:1 }

- Cache keys: recommendations:user:{userId}, feed:user:{userId}:cursor

---

## API Contracts (examples)

- Auth
  - POST /api/auth/signup {name,email,password} → 201 + set-cookie JWT
  - POST /api/auth/login {email,password} → 200 + set-cookie JWT

- Feed
  - GET /api/feed?cursor=&limit=20
    - Auth: JWT cookie
    - Response: { items: [{profile, score, explain}], nextCursor }

- Connections
  - POST /api/connection-requests { toUserId, message } → 201
  - PATCH /api/connection-requests/:id { status } → 200

- Messages (history)
  - GET /api/conversations/:id/messages?limit=50 → { messages[] }
  - Real‑time: via Socket.IO events

- Payments
  - POST /api/payments/create { amount } → { paymentUrl, orderId }
  - POST /api/payments/webhook → 200 (signature verified, idempotent update)

---

## Realtime Design (Socket.IO)

Handshake
- Client connects and provides JWT (query or initial auth event).  
- Server validates token, attaches user context and maps socketId ↔ userId.

Private message flow
1. Client emits `private-message` { toUserId, tempId, text }.  
2. Server validates token and recipient, persists Message in MongoDB.  
3. Server emits `incoming-message` to recipient socket(s) if online; else mark for offline delivery/notification.  
4. Server emits ack `message-delivered` to sender with final messageId and timestamps.

Presence
- Server publishes presence updates to relevant peers; use Redis store for cross‑instance presence.

Scaling
- Use socket.io Redis adapter for pub/sub across nodes; optionally use sticky sessions or token re‑auth to recover sessions.

---

## Recommendation System (LLD)

- Current approach: heuristic scorer (utils/mlRecommendations.js).  
- Features: skills overlap (Jaccard), location proximity, mutual connections, past interactions, recency.  
- Scoring: normalize features, apply tunable weights, sum into composite score. Return per‑feature contributions for explainability.
- Deployment: compute on request for freshness; cache in Redis (TTL 5–30m). For scale, precompute offline batches nightly and update cached results.
- Evaluation: track CTR, connection accept rate, and engagement; A/B test weight sets; transition to learned model once labeled data is sufficient.

---

## Payments Flow (PhonePe)

1. Frontend requests server to create order.  
2. Server calls PhonePe API to create order and returns paymentUrl/session to client.  
3. User completes payment on PhonePe.  
4. PhonePe fires webhook to POST /api/payments/webhook.  
5. Server verifies signature, checks idempotency (providerOrderId + status), updates Payment record and grants entitlement.

Security
- Verify webhook signature and required headers; optional IP allowlist.  
- Ensure idempotent updates (findOneAndUpdate with status check).  
- Log and alert on unexpected states.

---

## Scaling & State Management

- Make API servers stateless; scale horizontally behind LB.  
- Redis responsibilities: socket adapter, cache, rate limiting counters, shared presence sets.  
- Messages: durable in MongoDB. For heavy write volumes, shard messages by conversationId or userId.  
- Workers: background job queue for emails, ML recompute, failed delivery retries.

---

## Reliability, Observability & Testing

- Metrics: socket connect rate, avg message latency, feed latency, payment success rate, email failure rate.  
- Logs: structured with requestId; correlate webhook → DB update → entitlement.  
- Tracing: distributed traces across frontend→backend→DB→external providers.  
- Alerts: payment webhook failures, Redis down, worker backlog high.  
- Tests: unit tests for auth, payment verification; integration tests for webhook idempotency and message persistence; E2E tests for chat flows using headless clients.

---

## Security & Compliance

- JWT in HttpOnly Secure cookies (SameSite). Use refresh tokens if needed.  
- Input validation (Joi/express‑validator) and output sanitization.  
- Rate limit sensitive endpoints (login, payments, messages) using Redis counters.  
- Store secrets in secret manager; rotate regularly.  
- Do not store PCI card data — rely on provider.

---

## Deployment & Infra Recommendations

- Frontend: Vercel/Netlify (CDN edge).  
- Backend: containerized Node services in K8s/ECS with autoscaling.  
- MongoDB: managed Atlas with replica sets, backups and indexes.  
- Redis: managed Redis (Elasticache/Redis Cloud).  
- CI/CD: lint → unit tests → build → deploy to staging → smoke tests → promote to prod.

---

## Tradeoffs & Future Enhancements

- Heuristics vs learned models: heuristics are fast to iterate; collected engagement data enables ML later.  
- Socket single‑process is simple; Redis adapter required to scale.  
- For large scale: push attachments to S3, stream messages via queues for delivery guarantees, and partition/shard DB.

---

## Two Whiteboardable Sequences

Feed request (simplified)
Client → GET /api/feed (JWT cookie) → Auth middleware validates → Query candidates (MongoDB) → rankUsersByRecommendation → Cache result (Redis) → Return ranked list → Client renders

Private message
Client emits `private-message` → Socket.IO server validates → Persist Message (MongoDB) → Emit to recipient socket(s) or queue if offline → Ack sender → Optional push/email notification for offline user

---

## Code Pointers (where to reference in repo)
- Backend entry & sockets: BACKEND/src/app.js  
- Recommendations: BACKEND/src/utils/mlRecommendations.js  
- Payments: BACKEND/src/routes/paymentsPhonePe.js  
- Auth middleware: BACKEND/src/middlewares/auth.js  
- Frontend chat component: Frontend/src/Components/Chat.jsx

---

Keep this page as your whiteboard script: diagram the components, walk one user flow, then deep‑dive into realtime or recommendations as requested.