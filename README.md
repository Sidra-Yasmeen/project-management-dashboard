# Project Management Dashboard (Demo)

## Overview
Full-stack project with:
- Backend: Node.js + Express + MySQL
- Frontend: React + Vite + Bootstrap
- Features: Kanban board (To Do, In Progress, Done), create/edit/delete tasks, drag & drop, assign users, progress bar.

## Setup (Backend)
1. Install Node.js (v16+).
2. Create MySQL database and user.
3. Copy `backend/.env.example` to `backend/.env` and fill your DB credentials.
4. Run the SQL migrations:
   - `mysql -u root -p < backend/migrations.sql`
   - `mysql -u root -p < backend/seed.sql`
5. Install backend dependencies:
   - `cd backend`
   - `npm install`
6. Start backend:
   - `npm run dev` (requires nodemon) or `npm start`

## Setup (Frontend)
1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Set API base (optional): create `.env` with `VITE_API_URL=http://localhost:4000`
3. Start dev server:
   - `npm run dev`
4. Open `http://localhost:5173` (default Vite port) in browser.

## Notes
- The backend server runs on port 4000 by default.
- Use migrations and seed SQL to populate demo data.
- This project is a minimal, extendable starting point: add authentication, file uploads, notifications, and charts as next steps.

## What I included
- Backend: API endpoints for tasks and users.
- Frontend: Kanban UI with drag & drop, create/delete tasks, progress indication.

## License
MIT
