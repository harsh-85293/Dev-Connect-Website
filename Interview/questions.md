# DevConnect — Interview Q&A Cheat Sheet

> Concise answers you can say in interviews. Keep these as short talking points and expand if asked.

---

Q: Give a 60–90s overview of DevConnect.

A: DevConnect is a developer‑focused professional network: React + Vite frontend, Node/Express + MongoDB backend, Socket.IO for realtime chat, server‑side recommendation heuristics, templated emails and PhonePe payments.

---

Q: What problem does DevConnect solve and who is the target user?

A: It addresses noisy general social platforms by offering a dedicated space for developer networking. Target users are developers seeking mentorship, hiring connections, and technical collaboration.

---

Q: Can you describe the end‑to‑end request flow for loading the feed?

A: Frontend calls GET /api/feed with JWT cookie → auth middleware validates → backend queries candidates from MongoDB → rankUsersByRecommendation runs → response returned (ranked list + metadata).

---

Q: How is authentication modeled and enforced across frontend, backend and sockets?

A: JWTs are issued on login and stored in HttpOnly cookies. Express middleware validates requests and attaches user context. Socket connections validate the token on connect and map socketId(s) to userId for presence and messaging.

---

Q: How does the server handle private‑message events end‑to‑end?

A: Client emits `private-message` → server validates sender/recipient → persist message to Messages collection → emit to recipient socket(s) if online → ack sender.

---

Q: How is user presence tracked and shared between clients?

A: Server keeps an in‑process mapping of userId → socketId(s). For multi‑instance deployments, presence is stored in Redis and synchronized via the socket.io Redis adapter.

---

Q: Explain how rankUsersByRecommendation computes scores and what features it uses.

A: It uses heuristic scoring combining skills overlap, location proximity, mutual connections, interaction history and recency. Features are normalized and weighted into a composite score with explainability metadata.

---

Q: How would you evaluate and improve recommendation relevance?

A: Track engagement metrics (clicks, requests, accept rate), run A/B tests on weights/models, collect implicit feedback, and migrate to a learned model once sufficient labeled data exists.

---

Q: Describe the PhonePe payment flow implemented in the project.

A: Frontend requests a payment session → backend creates PhonePe order → PhonePe handles payment → PhonePe calls server webhook → server verifies signature and updates order and entitlement.

---

Q: What precautions are needed for webhook security and idempotency?

A: Verify shared signature/secret, validate payload schema, implement idempotent DB updates (findOneAndUpdate with status checks), and log events for auditing.

---

Q: How does the email service send templated emails?

A: The service renders HTML templates with data substitutions and sends via SMTP/transactional API. Cron jobs trigger scheduled reminders and notifications.

---

Q: Which endpoints should be rate‑limited and how would you implement rate limiting?

A: Rate‑limit login, signup, connection requests, message sends and payment endpoints. Use Redis‑backed token bucket or sliding window counters to enforce limits across instances.

---

Q: How would you scale Socket.IO to multiple instances?

A: Use the socket.io Redis adapter (pub/sub) to propagate events and presence across nodes. Consider sticky sessions or token re‑auth to maintain session continuity on reconnect.

---

Q: Which MongoDB indexes are critical for performance and why?

A: Indexes on user search fields (name, skills), messages by conversationId+createdAt, connectionRequests by toUserId/fromUserId, and payments by providerOrderId to support fast queries.

---

Q: What unit and integration tests would you add first and why?

A: Auth middleware unit tests, message persistence and retrieval integration tests, and payment webhook idempotency tests — these protect security, data integrity and billing flows.

---

Q: How would you diagnose a "messages not delivered" issue in production?

A: Check socket connection logs and presence mapping, verify message writes in DB, inspect Redis/adapter health (if scaled), review emit/ack error logs, and check retry/worker queues.

---

Q: Do you have a quick presentation cue for answering these questions in interviews?

A: Answer in 1–2 sentences, then offer a short example or point to code (app.js for sockets, utils/mlRecommendations.js, routes/paymentsPhonePe.js, middlewares/auth.js).

---

Q: Explain the TCP three‑way handshake and how it relates to establishing a user login session.

A: TCP three‑way handshake (SYN → SYN‑ACK → ACK) establishes a reliable connection between client and server at the transport layer. The login occurs over that connection (typically over TLS). The handshake itself does not provide authentication or confidentiality — TLS on top of TCP provides encryption and server authentication.

---

Q: How is security typically enforced in the user login flow?

A: Use TLS to encrypt the transport, validate server certs, submit credentials over HTTPS, hash passwords with a strong algorithm (bcrypt/argon2) and unique salts, issue short‑lived JWTs (HttpOnly, Secure cookies), apply rate limiting and account lockouts, and use MFA for extra security.

---

Q: What is salting and why is it important for password storage?

A: A salt is a random per‑password value stored with the hash to ensure identical passwords produce different hashes. It prevents rainbow‑table attacks and forces attackers to compute hashes per account instead of using precomputed tables.

---

Q: Is salting alone enough to protect stored passwords?

A: No. Salting must be combined with a slow adaptive hash (bcrypt/argon2/scrypt) to resist brute force. Also use unique salts, consider a pepper, enforce strong password policies, rate limit login attempts, and use MFA.

---

Q: When and why would you use RSA (asymmetric) vs symmetric encryption?

A: Use asymmetric (RSA/ECDSA) for key exchange, certificates and signatures (establish trust, verify payloads). Use symmetric (AES) for bulk data encryption because it's faster. TLS uses asymmetric crypto to negotiate symmetric session keys.

---

Q: How should webhook signatures be verified?

A: Use HMAC with a shared secret or verify an RSA/ECDSA signature with the provider's public key. Check timestamps/nonces to prevent replay, validate payload schema, and process idempotently.

---

Q: Which HTTP methods should you use for different actions in a REST API?

A: GET for safe reads, POST for creates or non‑idempotent actions, PUT/PATCH for updates (PUT idempotent, PATCH partial), DELETE for removals. Avoid side effects on GET and use proper status codes and idempotency where needed.

---

Q: Can hashing/salting replace transport security (TLS)?

A: No. Hashing protects stored secrets at rest; TLS protects data in transit. Both are required: always use TLS for login and API calls even when passwords are hashed on the server.

---

Q: Quick interview cue for these security topics?

A: Start by distinguishing transport (TLS) from at‑rest protections (hash+salt), explain adaptive hashing and MFA, mention RSA for key exchange/signing vs AES for bulk data, and conclude with operational controls (rate limits, monitoring, secret management).

---

Q: What are the key considerations when designing system architecture for scalability?

A: Design stateless services behind a load balancer, use caching (Redis) for hot data, index and shard the database as needed, move heavy tasks to async workers, use a publish/subscribe layer for realtime, implement rate limiting and circuit breakers, and ensure observability (metrics/tracing/logs) for bottleneck detection.

---

Q: How do you design for high availability and fault tolerance?

A: Use redundancy across instances and AZs, health checks and automated failover, stateless services with shared storage, retry/backoff patterns, graceful degradation, database replicas and backups, and continuous monitoring with alerts.

---

Q: What is bcrypt and why is it used for password hashing?

A: bcrypt is a slow adaptive password‑hashing function (based on Blowfish) that includes a salt and a configurable work factor (cost). Its slowness and per‑password salt make brute‑force and rainbow‑table attacks expensive.

---

Q: How should you choose a bcrypt cost/work factor?

A: Benchmark hash time on target servers and pick the highest cost that keeps authentication latency acceptable (e.g., <100–300ms). Increase the cost over time as hardware improves and rehash passwords on login when cost increases.

---

Q: What is the difference between PUT and PATCH in REST APIs?

A: PUT replaces the entire resource at the given URI and is idempotent. PATCH applies a partial update (only provided fields) and is not inherently idempotent (but can be implemented idempotently). Use PUT for full replace and PATCH for partial changes.

---

Q: When should you use POST vs PUT vs PATCH?

A: Use POST to create resources or trigger non‑idempotent actions, PUT to create or fully replace a resource at a known URI (idempotent), and PATCH to partially update an existing resource.

---

Q: How does Socket.IO authenticate and authorize a connection?

A: Send the JWT in the connection query or via an initial auth event; server validates the token, attaches the user context, and checks permissions (e.g., allowed rooms). Reject or disconnect unauthorized sockets and use middleware on the server to centralize checks.

---

Q: How do you handle socket reconnection and backoff strategies?

A: Use exponential backoff on client reconnect attempts to avoid thundering herds. On reconnect, re‑authenticate the token, rejoin rooms, and reconcile missed messages (fetch recent history via REST or server side queue). Use socket.io client's built‑in reconnection options.

---

Q: How do you ensure message ordering and delivery guarantees?

A: For ordering, include server timestamps or sequence numbers and apply ordering on the client. For delivery guarantees: use ACKs from recipient (Socket.IO ack callbacks) and persist messages before emit. For offline users, queue messages in DB and deliver on reconnect. Stronger guarantees require message queues and at‑least‑once semantics with de‑duplication.

---

Q: When should you use rooms vs namespaces in Socket.IO?

A: Use namespaces to separate large functional areas or versioned APIs (different endpoints). Use rooms to group sockets for a conversation or topic (many small groups). Rooms are lighter and commonly used for chat conversations and presence groups.

---

Q: How do you broadcast messages efficiently to many users?

A: Use rooms and the Redis adapter to broadcast from any node. Avoid sending per‑socket emits in a loop; instead emit to a room. For very large broadcasts, use fanout services or a pub/sub pipeline and stagger delivery to avoid spikes.

---

Q: How do you handle offline users and missed messages?

A: Persist messages in DB on send. If recipient is offline, mark message as undelivered and send a notification (email/push). On reconnect, client requests recent history or server pushes queued messages and updates delivery status.

---

Q: What socket security best practices should be applied?

A: Validate origin/CORS, enforce auth on connect, limit allowed transports if needed, rate limit socket events, sanitize payloads, and use the Redis adapter securely. Monitor for abnormal event rates and implement ACL checks for sensitive events.

---

Q: How would you load test and benchmark socket infrastructure?

A: Use tools that simulate many concurrent WebSocket connections (e.g., Artillery, Gatling, k6 with websocket support). Measure connection rates, average message latency, CPU/memory per instance, and Redis pub/sub throughput; identify bottlenecks and tune backpressure.

---

Q: What metrics and logs are most important for socket observability?

A: Connection counts, connect/disconnect rates, avg message latency, event error rates, fallback to polling rate, Redis pub/sub lag, and per‑room delivery stats. Correlate with request/trace IDs for debugging.

---

Q: Quick interview cue for socket topics?

A: Explain connection auth (JWT + middleware), reconnection strategy, persistence for delivery guarantees, scaling via Redis adapter, and operational practices (monitoring, rate limiting, testing).

---

Good luck — continue practicing these concise answers aloud.