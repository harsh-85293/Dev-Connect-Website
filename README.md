# DevConnect

DevConnect is a developer-focused networking app where people can create profiles, connect with other developers, send connection requests, chat in real time, and explore opportunities.

It has a React frontend, a Node.js/Express backend, and MongoDB for the main data layer. The app also includes authentication, profile management, messaging, and a few extra social/community features.

## What this project does

- User signup and login
- Profile creation and editing
- Developer connection requests
- Real-time chat
- Search and discovery of other developers
- Google sign-in support
- Email and notification flows
- Admin-like backend APIs for profile and connection features

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: Socket.IO
- Auth: JWT + Firebase Google auth
- Optional services: Redis and Kafka

## Project structure

- `Frontend/` — React app
- `BACKEND/` — Express API
- `docker-compose.yml` — local services for Redis/Kafka setup

## Local setup

### 1. Install dependencies

Backend:

```bash
cd BACKEND
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

### 2. Add environment variables

Create a local `.env` file in the backend and frontend based on your app config.

Backend example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Frontend example:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start the app

Backend:

```bash
cd BACKEND
npm start
```

Frontend:

```bash
cd Frontend
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Common workflow

- Sign up and log in
- Complete your profile
- Search for developers
- Send connection requests
- Chat with accepted connections
- Use Google login if enabled in Firebase

## Notes

This project is meant to be a working developer networking app for local development and demo use. Some optional services like Redis and Kafka may be enabled depending on your setup.

## License

This project is for personal and learning use unless stated otherwise by the owner.

