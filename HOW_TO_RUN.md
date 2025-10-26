# How to run this project

Prerequisites
- Node.js (LTS) and npm or yarn
- Docker (optional, recommended for Redis/Kafka)
- Any DB required by the project (Mongo/Postgres) — start it if applicable
- Copy and edit the environment file: .env from .env.example

PowerShell (Windows)
```powershell
cd "d:\THE FULL STACK DEVELOPER\NODE JS\final project plus redis and kafka\devconnect"
cp .env.example .env
npm install
if (Test-Path client) { cd client; npm install; cd .. }

# Start Redis (Docker)
docker run --name redis -p 6379:6379 -d redis

# Start Kafka (if docker-compose file exists)
docker-compose -f docker-compose-kafka.yml up -d

# Optional DB migrations / seeds
# npm run migrate
# npm run seed

# Start the server
npm run dev   # development (watch)
# or
npm start     # production
# If there is a client folder:
# cd client && npm run start
```

bash (macOS / Linux)
```bash
cd "/d/THE FULL STACK DEVELOPER/NODE JS/final project plus redis and kafka/devconnect"
cp .env.example .env
npm install
[ -d client ] && (cd client && npm install && cd ..)

# Start Redis (Docker)
docker run --name redis -p 6379:6379 -d redis

# Start Kafka (if docker-compose file exists)
docker-compose -f docker-compose-kafka.yml up -d

# Optional DB migrations / seeds
# npm run migrate
# npm run seed

# Start the server
npm run dev   # development (watch)
# or
npm start     # production
# If there is a client folder:
# cd client && npm run start
```

Verify
- Open http://localhost:<PORT> or call API endpoints with curl/Postman.
- Check logs for connection errors and update .env values accordingly.
