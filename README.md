# NEXORAE 2.0 — Techno-Cultural Fest Web Application

![NEXORAE 2.0](public/hero-bg.jpg)

> **Where Innovation Meets the Future**  
> NEXORAE 2.0 is a flagship techno-cultural festival platform built for the IEEE GCET Student Branch, featuring a dark high-concept Stranger Things "Upside Down" visual design, interactive WebGL 3D galleries, dynamic particle fog physics, and an end-to-end student registration & payment verification portal.

---

## 🚀 Key Features

- **Stranger Things Themed UI/UX**: High-contrast dark void palette (`#050505`), glassmorphism, crimson glows, floating ember canvas particles, andStranger Things title styling.
- **Interactive 3D Dome Gallery**: Custom WebGL/OGL curved dome gallery showcasing event memories and glimpses.
- **Interactive Volumetric Fog**: Physics-driven particle fog effect that reacts dynamically to cursor movements across section backgrounds.
- **Dynamic Event Showcase**: Filterable showcase featuring 12 arenas across Technical, Design, and Fun categories.
- **Student Registration & Portal**: Registration workflow for IEEE and Non-IEEE students with automated ID generation (`NEX26XXXX`).
- **Payment Verification Workflow**: Secure proof submission with QR code / UPI intent integration and admin verification status tracking.
- **Admin Management Portal**: Administrative dashboard for viewing registrations, verifying payments, managing events, and exporting CSV reports.
- **Vercel & Cloud Ready**: Fully optimized for Vercel SPA deployment with rewrite routing and HTTP security headers.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: TailwindCSS v4 + Custom Glassmorphism System
- **Animations & Physics**: Framer Motion, GSAP 3, Canvas Embers & Particle Physics
- **3D & WebGL**: OGL (Minimal WebGL Library), Three.js
- **Routing & State**: React Router DOM v7, React Context API

### Backend
- **Runtime**: Node.js + Express.js (TypeScript)
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt password hashing
- **Media & File Storage**: Cloudinary API + Multer
- **Utilities**: QR Code generation, CSV stringify, Nodemailer

---

## 📁 Repository Structure

```
.
├── backend/                  # Express.js REST API Server
│   ├── src/
│   │   ├── config/           # Database & Cloudinary config
│   │   ├── controllers/      # Route handlers (Students, Payments, Events, Admin)
│   │   ├── middleware/       # Auth, Rate Limiting, Upload validation
│   │   ├── models/           # Mongoose schemas (Student, Event, Payment, Admin)
│   │   ├── routes/           # API Endpoint definitions
│   │   └── services/         # Email, ID generation, QR utilities
│   └── package.json
│
├── public/                   # Static media assets & images
├── src/                      # Frontend Application
│   ├── api/                  # Axios API client modules
│   ├── assets/               # Local asset imports
│   ├── components/           # Reusable UI components & Sections
│   │   ├── admin/            # Admin protection guards & components
│   │   ├── layout/           # Navbar, Footer, Page transitions
│   │   ├── registration/     # Event registration modal
│   │   ├── sections/         # CinematicHero, About, EventsShowcase, Glimpses
│   │   └── ui/               # WebGL DomeGallery, FogEffect, GlassCard, CustomCursor
│   ├── context/              # Authentication & Session context
│   ├── data/                 # Static event definitions & navigation links
│   ├── pages/                # Page routes (Home, Events, Register, Dashboard, Admin)
│   ├── types/                # TypeScript interfaces
│   └── utils/                # Animation configs, easings & constants
│
├── .env.example              # Environment variables template
├── vercel.json               # Vercel deployment & routing configuration
└── vite.config.ts            # Vite bundler configuration
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

### Frontend (`.env`)
```ini
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexorae
JWT_SECRET=your-secure-jwt-secret-key
CLIENT_URL=http://localhost:5173,https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> ⚠️ **Security Note**: Never commit actual `.env` files or credentials to Git. All secret variables are listed in `.gitignore`.

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local instance or MongoDB Atlas cluster

### 1. Clone Repository
```bash
git clone https://github.com/Hitenmalviya/NEXORAE2.O.git
cd NEXORAE2.O
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend will run at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend

# Install backend dependencies
npm install

# Seed initial events and admin account
npm run seed:events
npm run seed:admin

# Start backend dev server
npm run dev
```
The backend API will run at `http://localhost:5000/api`.

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Import the repository into your [Vercel Dashboard](https://vercel.com).
2. Set **Framework Preset** to `Vite`.
3. Configure Environment Variable:
   - `VITE_API_URL`: Your deployed production backend API URL (e.g. `https://your-backend.onrender.com/api`).
4. Click **Deploy**. Vercel will automatically use `vercel.json` for SPA rewrites and security headers.

### Backend (Render / Railway / AWS)
1. Deploy the `backend/` directory to your hosting provider.
2. Set Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`).
3. Build command: `npm run build`
4. Start command: `npm run start`

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets**: All API endpoints and backend credentials are managed via environment variables.
- **JWT Authorization**: Admin and student session tokens are validated server-side on every restricted request.
- **Input Sanitization & Rate Limiting**: Abuse-prone routes (such as student registration) enforce IP rate limiting (`express-rate-limit`).
- **HTTP Security Headers**: `vercel.json` and `helmet` enforce `X-Frame-Options`, `X-Content-Type-Options`, and `X-XSS-Protection`.



---

## 👤 Author

- GitHub: [@Hitenmalviya](https://github.com/Hitenmalviya)
