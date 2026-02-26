# DevConnect - Professional Developer Networking Platform

A modern full-stack application for developers to connect, collaborate, and grow together. Built by [Harsh Ramchandani](https://github.com/harsh-85293).

Developer

**Harsh Ramchandani**
- GitHub: [@harsh-85293](https://github.com/harsh-85293)
- LinkedIn: [harsh-ramchandani007](https://www.linkedin.com/in/harsh-ramchandani007/)

---

This project demonstrates a complete professional networking system with frontend and backend integration.

Features

### Backend API Endpoints
- `GET /profile/view` - Retrieve user profile data
- `PATCH /profile/edit` - Update user profile information

### Frontend Components
- **Profile.jsx** - Main profile display component with real-time data
- **EditProfile.jsx** - Profile editing interface
- **API Integration** - Centralized API utilities for clean code

## API Integration Details

### Profile Data Flow
1. **Initial Load**: Body component fetches user profile on app mount
2. **Real-time Updates**: Profile component can refresh data on demand
3. **State Management**: Redux store maintains user data with localStorage persistence
4. **Error Handling**: Comprehensive error handling with user notifications

### Key Features
- **Profile Completion Indicator** - Visual progress bar showing profile completeness
- **Real-time Sync** - Refresh button to sync with backend
- **Loading States** - Smooth loading animations during API calls
- **Error Handling** - User-friendly error messages and notifications
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Data Persistence** - Local storage backup for offline access

## Technical Stack

- **Frontend**: React 19 + Redux Toolkit + Tailwind CSS + DaisyUI
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Caching**: Redis for session management and data caching
- **Message Queue**: Kafka for event streaming and analytics
- **API**: RESTful endpoints with JWT authentication
- **State Management**: Redux with localStorage persistence
- **Real-time**: Socket.io with Redis adapter for scalability

## Usage

### Viewing Profile
- Navigate to `/profile` route
- Profile data is automatically loaded from backend
- Use refresh button to sync latest changes

### Editing Profile
- Click edit button to modify profile information
- Changes are saved to backend via API
- Real-time updates reflect in UI

### API Utilities
```javascript
import { profileAPI } from '../utils/api';

// Get profile
const profile = await profileAPI.getProfile();

// Update profile
const result = await profileAPI.updateProfile(profileData);

// Refresh profile
const freshData = await profileAPI.refreshProfile();
```

## Authentication

- JWT-based authentication with cookies
- Protected routes require valid user session
- Automatic redirect to login for unauthorized access

## Profile Fields

- **Basic Info**: firstName, lastName, age, gender
- **Contact**: emailId
- **Media**: photoUrl (with fallback)
- **Professional**: about, skills array
- **Metadata**: createdAt, timestamps

## Getting Started

### Prerequisites
- Docker (for Redis and Kafka)
- MongoDB
- Node.js 18+

### Quick Start

1. **Start Services** (Redis, Kafka, Zookeeper):
   ```bash
   docker-compose up -d
   ```

2. **Backend**: 
   ```bash
   cd BACKEND
   npm install
   npm run dev
   ```

3. **Frontend**: 
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. **Access**: Navigate to `http://localhost:5173`

### Docker Services
- **Redis**: `localhost:6379` - For caching and session management
- **Kafka**: `localhost:9092` - For event streaming
- **Kafka UI**: `http://localhost:8080` - Kafka monitoring
- **Redis Commander**: `http://localhost:8081` - Redis GUI

See `DOCUMENTATION/KAFKA_REDIS_ARCHITECTURE.md` and `REDIS_KAFKA_INTEGRATION_FILES/README.md` for detailed setup.

## API Response Format

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://example.com/photo.jpg",
  "about": "Full-stack developer...",
  "skills": ["React", "Node.js", "MongoDB"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Future Enhancements

- [ ] Profile analytics and insights
- [ ] Social connections and networking
- [ ] Profile verification system
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Profile sharing and embedding

---

## Deployment Guide (Render backend + Vercel frontend)

### 1) Prepare environment variables

Backend (Node/Express):

- `MONGODB_URI` = your Mongo connection string
- `JWT_SECRET` = a strong secret
- `EMAIL_USER`, `EMAIL_PASS` (optional: email features)
- `FRONTEND_URL` = your Vercel domain, e.g. `https://dev-connect-website.vercel.app`
- `BACKEND_URL` = your backend public URL (optional, used in templates)
- `PHONEPE_BASE_URL`, `PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY`, `PHONEPE_SALT_INDEX` (optional: PhonePe)

Frontend (Vite):

- `VITE_API_BASE_URL` = your backend public URL (e.g. `https://YOUR-BACKEND.onrender.com`)

### 2) Deploy backend (Render)

1. Push this repo to GitHub (done)
2. Create a new Web Service on Render → select this repo
3. Root Directory: `BACKEND`
4. Runtime: Node 18+
5. Build Command: leave empty (Render will install deps)
6. Start Command: `npm start`
7. Add Environment Variables from the list above
8. Deploy → copy the service URL (e.g. `https://devconnect-backend.onrender.com`)

Note: Render provides a `PORT` env; the app already respects `process.env.PORT`.

### 3) Deploy frontend (Vercel)

1. Go to `https://vercel.com/new` → import `harsh-85293/Dev-Connect-Website`
2. Root Directory: `Frontend`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables → add `VITE_API_BASE_URL` with your backend URL
7. Deploy → note the Vercel domain and set it back on your backend as `FRONTEND_URL`

### 4) Post-deploy checks

- Verify API calls from Vercel site succeed (CORS is configured via `FRONTEND_URL`)
- Socket.IO client should connect to the backend URL. If needed, use:

```js
// client example
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_API_BASE_URL, { withCredentials: true, transports: ['websocket'] });
```

### 5) Local development

- Backend: `cd BACKEND && npm run dev`
- Frontend: `cd Frontend && npm run dev`
- Open `http://localhost:5173`

---

## Environment quick reference (no secrets)

Backend (`BACKEND/.env` on your host):

- `PORT` = 3000 (Render provides one; app uses `process.env.PORT`)
- `MONGODB_URI` = <your Mongo URI>
- `JWT_SECRET` = <your secret>
- `EMAIL_USER` = <optional>
- `EMAIL_PASS` = <optional>
- `FRONTEND_URL` = `https://YOUR-APP.vercel.app`
- `BACKEND_URL` = `https://YOUR-BACKEND.onrender.com` (optional, email templates)
- `PHONEPE_BASE_URL` = `https://api-preprod.phonepe.com/apis/pg-sandbox`
- `PHONEPE_MERCHANT_ID` = <optional>
- `PHONEPE_SALT_KEY` = <optional>
- `PHONEPE_SALT_INDEX` = `1`

Frontend (`Frontend/.env` in Vercel):

- `VITE_API_BASE_URL` = `https://YOUR-BACKEND.onrender.com`

---

## Render setup (screenshots placeholders)

1. Create Web Service → select repo → Root Dir: `BACKEND`
   - [screenshot: render-new-service.png]
2. Runtime: Node 18+; Start: `npm start`; Build: empty
   - [screenshot: render-runtime-start.png]
3. Add Environment variables
   - [screenshot: render-env-vars.png]
4. Deploy → copy backend URL
   - [screenshot: render-deployed-url.png]
5. After frontend deploy, set `FRONTEND_URL` and redeploy
   - [screenshot: render-redeploy.png]
