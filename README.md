# AuthDash 🚀  (Currently Working...)
A Scalable Full-Stack Web Application with Authentication & Dashboard

## 📌 Overview
AuthDash is a full-stack web application featuring secure user authentication, protected routes, and a responsive dashboard with CRUD functionality.  
The project is built with a **frontend-first approach**, focusing on clean UI/UX, scalability, and seamless frontend–backend integration.

This project demonstrates real-world patterns used in modern web applications, including JWT-based authentication, modular frontend architecture, and RESTful API design.

## Demo
Link: https://authdash-tau.vercel.app/

---

## 🖥️ Tech Stack

### Frontend
- Next.js + TypeScript
- Tailwind CSS / Material UI / Bootstrap
- Axios / Fetch API
- React Hook Form / Formik
- Client-side form validation

### Backend
- Node.js + Express *(or FastAPI)*
- JWT-based authentication
- bcrypt for password hashing
- RESTful API architecture

### Database
- MongoDB

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected dashboard routes
- Secure logout flow

### 📊 Dashboard
- Fetch and display user profile
- Update user profile information
- CRUD operations on a sample entity (Tasks / Notes / Posts)
- Search and filter functionality
- Responsive UI for all screen sizes

---

## 🔒 Security Practices
- Password hashing using **bcrypt**
- JWT token verification middleware
- Protected API routes
- Client-side and server-side input validation
- Centralized error handling

---

## 📁 Project Structure (Scalable Design)
    project-root/
    ├── frontend/                      # Next.js 14 + TypeScript application
    │   ├── app/                       # App Router (routes & layouts)
    │   │   ├── layout.tsx             # Root layout
    │   │   ├── page.tsx               # Home page
    │   │   ├── globals.css            # Global styles
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx       # Login page
    │   │   │   └── register/
    │   │   │       └── page.tsx       # Registration page
    │   │   └── dashboard/
    │   │       └── page.tsx           # Protected dashboard with task management
    │   │
    │   ├── components/                # Reusable UI components
    │   │   ├── Navbar.tsx             # Navigation component
    │   │   └── Layout/
    │   │       ├── Sidebar.tsx        # Sidebar navigation
    │   │       └── StatsGrid.tsx      # Stats display component
    │   │
    │   ├── lib/                       # API & utility logic
    │   │   ├── api.ts                 # Axios API client with auth token management
    │   │   └── taskService.ts         # Task API service
    │   │
    │   ├── next-env.d.ts              # Next.js TypeScript environment types
    │   ├── tsconfig.json
    │   ├── next.config.ts
    │   ├── postcss.config.mjs
    │   ├── eslint.config.mjs
    │   ├── package.json
    │   └── README.md
    │
    ├── backend/                       # Node.js + Express API
    │   ├── src/
    │   │   ├── controllers/
    │   │   │   ├── authController.js  # Login, register, user profile handlers
    │   │   │   └── taskController.js  # Task CRUD handlers
    │   │   │
    │   │   ├── routes/
    │   │   │   ├── authRoutes.js      # /auth endpoints
    │   │   │   └── taskRoutes.js      # /tasks endpoints
    │   │   │
    │   │   ├── models/
    │   │   │   ├── User.js            # User schema & model
    │   │   │   └── Task.js            # Task schema & model
    │   │   │
    │   │   ├── middleware/
    │   │   │   └── authMiddleware.js  # JWT verification middleware
    │   │   │
    │   │   ├── config/
    │   │   │   └── db.js              # MongoDB connection setup
    │   │   │
    │   │   ├── utils/                 # Helper utilities
    │   │   │
    │   │   ├── app.js                 # Express app initialization
    │   │   └── server.js              # Server entry point
    │   │
    │   ├── .env                       # Environment variables
    │   └── package.json
    │
    └── README.md


---

## 🧪 API Documentation
- Postman collection included in the repository
- All endpoints follow RESTful conventions
- Authentication-protected routes require a valid JWT

---

## 🚀 Scaling for Production
If this application were scaled for production, the following improvements would be implemented:

- Refresh tokens with HTTP-only cookies
- Role-based access control (RBAC)
- API versioning
- Pagination & filtering at the API level
- Caching with Redis
- CI/CD pipelines for automated deployments
- Separate deployment for frontend and backend services

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/tarunpandore/authdash.git
cd authdash
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 4. Environment Variables

Create a .env file in backend directory, .env.local in frontend directory and configure:
# Backend
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```
# Frontend
```bash
NEXT_PUBLIC_API_URL=your_backend_url
```