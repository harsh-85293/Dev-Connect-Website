# DevConnect

DevConnect is a full-stack networking platform for developers. Users build a profile, discover other developers, send connection requests, and chat after connecting.

The project is built as a separate React client and Express API. It uses MongoDB for application data, signed HTTP-only cookies for sessions, and Socket.IO for real-time messaging.

## Live Demo

- Frontend: https://dev-connect-website.vercel.app
- API: https://dev-connect-website.onrender.com

## Highlights

- Developer profiles with editable skills, experience, and profile details
- Feed-based developer discovery and connection requests
- Connection management and real-time chat with Socket.IO
- Google sign-in using Google Identity Services
- JWT-backed sessions stored in secure, HTTP-only cookies
- Profile, connection, email-preference, and payment-related API routes
- Responsive interface with theme switching and mobile-friendly layouts
- Optional Redis and Kafka integrations for session/data workflows and background processing

## Architecture

```text
React + Vite (Vercel)
        |
        | HTTPS / credentials-enabled API requests
        v
Express API (Render) ---- MongoDB
        |
        +---- Socket.IO for chat
        +---- Redis/Kafka integrations when enabled
```

The Google login flow is intentionally split into two steps:

1. Google Identity Services returns an ID token in the browser.
2. The Express API verifies that token with Google's Auth Library, finds or creates the user, and issues the application's normal session cookie.

This keeps Google credentials out of the database and gives the rest of the application one consistent session model.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS and daisyUI
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Google Auth Library
- JWT and HTTP-only cookies
- Socket.IO
- Redis and Kafka integrations
- Jest and Supertest test tooling

## Repository Layout

```text
Frontend/              React application
BACKEND/               Express API, models, routes, and services
docker-compose.yml     Optional local Redis/Kafka services
```

## Run Locally

### 1. Install dependencies

From the repository root:

```bash
npm install
cd BACKEND && npm install
cd ../Frontend && npm install
```

Or use the root helper:

```bash
npm run install:all
```

### 2. Configure environment variables

Create `BACKEND/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
```

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
```

The Google client ID must be the same in both files. Create a Web OAuth client in Google Cloud Console and add these authorized JavaScript origins:

```text
http://localhost:5173
https://dev-connect-website.vercel.app
```

Preview deployments need their own origin added to the OAuth client, or can be tested through the production URL.

### 3. Start the services

Run the API:

```bash
cd BACKEND
npm run dev
```

Run the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

Open http://localhost:5173.

The root command starts both services together:

```bash
npm run dev
```

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start frontend and backend together from the root |
| `npm run frontend:dev` | Start the Vite development server |
| `npm run backend:dev` | Start the API with nodemon |
| `npm run build --prefix Frontend` | Create a production frontend build |
| `npm run lint --prefix Frontend` | Lint the frontend |
| `npm test --prefix BACKEND` | Run backend tests with coverage |
| `npm run test:unit --prefix BACKEND` | Run backend unit tests |

## Deployment

- Vercel builds and serves the `Frontend` application.
- Render runs `BACKEND/src/app.js` with `npm start`.
- `VITE_API_BASE_URL` points the frontend to the Render API.
- `VITE_GOOGLE_CLIENT_ID` is configured in Vercel.
- `GOOGLE_CLIENT_ID` is configured in Render.

When deploying a new frontend environment, remember that Vite variables are embedded at build time. Save the environment variable first, then create a new deployment.

## Testing

Backend tests cover password hashing, password validation, JWT creation, and user model behavior. Run them from `BACKEND`:

```bash
npm run test:unit
```

The repository also includes integration-test setup for MongoDB-backed API tests.

## Notes

- Never commit `.env` files, OAuth client secrets, service-account JSON files, or private keys.
- Google Client IDs are browser-facing configuration values; client secrets are not used by this application flow.
- Redis and Kafka are optional for local development. The core API runs with MongoDB and the configured application environment.

## License

This project is maintained as a personal portfolio and learning project.
