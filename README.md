# Job Board App (Full Stack)

## 🧾 Features
- Search, Filter, View, Save, and Apply for Jobs
- Auth via Clerk (Email/Gmail)
- PostgreSQL DB for persistent state
- REST API via Express.js
- Deployed via Render (Frontend + Backend)

## 📁 Project Structure
```
client/   # React frontend (Vite + Clerk + shadcn/ui)
server/   # Express backend API
schema.sql  # DB schema
```

## 🔐 Environment Setup
Create `.env` files for both frontend and backend:

### server/.env
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NODE_ENV=development
```

### client/.env
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=https://your-backend.onrender.com
```

## 📦 Install Dependencies
```bash
cd client && npm install
cd ../server && npm install
```

## 🧪 Seed DB
```bash
psql < schema.sql
```

## ▶️ Run Locally
```bash
cd server && node index.js
cd ../client && npm run dev
```

## 🚀 Deploy to Render
- Push both `client` and `server` to GitHub
- Backend: Render Web Service → `node index.js`
- Frontend: Render Static Site → build with `vite build`
- Point frontend to `VITE_API_URL` Render backend URL

## ✅ API Endpoints
```
GET    /jobs
GET    /jobs/:id
GET    /favorites
POST   /favorites { jobId }
GET    /applied
POST   /applied { jobId }
```

## 🧠 Notes
- Use PostgreSQL for relational data
- `favorites` & `applied` are keyed by job_id only for simplicity
- Secure Clerk integration guards private routes

---
Ready to submit deployed URL & GitHub repo per assignment.
