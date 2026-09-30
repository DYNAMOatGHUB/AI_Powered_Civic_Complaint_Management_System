# Civic Pulse: Coimbatore Complaint Management MVP

**Civic Pulse** is a production-ready, map-first civic complaint management pilot built for Coimbatore City Municipal Corporation. It empowers citizens to report local infrastructure issues, upvote existing complaints to prevent duplicate queue noise, and provides Ward Officers with a ranked, actionable dashboard with a strict 14-day SLA escalation system.

---

## ✨ Features

- **Map-First Citizen Portal**: Interactive Leaflet map with OpenStreetMap tiles displaying ward boundaries and live complaint pins.
- **Two-Layer Duplicate Prevention**:
  1. *Step 1 Location/Category Pre-Check*: Urges citizens to upvote existing issues.
  2. *Step 2 Gemini AI Semantic Duplicate Check*: Uses Google Gemini 1.5 Flash to detect duplicate meaning regardless of wording differences.
- **Live Camera Photo Capture**: Strict live camera capture (`navigator.mediaDevices`) under 2 MB with Gemini Vision photo-category validation.
- **Officer Ranked Action Dashboard**: Sorts complaints by community upvotes, time open, and SLA escalation status.
- **Grievance Escalation System**: Planned inspection/start/fix date tracking with an automatic 14-day hard SLA limit that triggers officer performance flags/black marks upon expiry.
- **Real-Time WebSockets**: Live status, vote count, and new complaint broadcasts powered by FastAPI WebSockets.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Leaflet.js, Lucide Icons, Axios, WebSockets.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, PostgreSQL (Neon) / SQLite fallback, Uvicorn.
- **AI Integrations**: Google Gemini 1.5 Flash (Semantic Duplicate Detection), Gemini Vision (Live Photo Validation).
- **Storage**: Cloudinary API (Camera Image Uploads).
- **Authentication**: JWT + Username / Password session management.

---

## 🔑 Environment Variables & API Keys

Place environment variables in `src/backend/.env`:

| Environment Variable | Description / Purpose | Key Placement Location |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL (Neon) or SQLite connection string | `src/backend/.env` |
| `JWT_SECRET_KEY` | Secret key used to sign JWT authentication tokens | `src/backend/.env` |
| `GEMINI_API_KEY` | Google Gemini API Key for semantic duplicate comparison & vision validation | `src/backend/.env` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name for storing complaint photos | `src/backend/.env` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `src/backend/.env` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `src/backend/.env` |
| `FRONTEND_BASE_URL` | Frontend URL (`http://localhost:5173`) | `src/backend/.env` |
| `BACKEND_BASE_URL` | Backend API URL (`http://localhost:8000`) | `src/backend/.env` |

---

## 🚀 Local Setup & Seed Data

### 1. Backend Setup
```bash
cd src/backend

# Create & activate virtual environment (optional)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python packages
pip install -r requirements.txt

# Start backend server (seeds 3 Coimbatore wards automatically on launch)
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd src/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Visit `http://localhost:5173` to access the application!

---

## 🧪 Testing

- **Backend API Docs**: Visit `http://localhost:8000/docs` for interactive Swagger testing of authentication, wards, complaints, and admin actions.
- **Test User Accounts**:
  - Citizen: `username: lakshmi`, `password: lakshmi123`
  - Officer: `username: officer1`, `password: officer123`

---

## 📌 Known Limitations & Future Roadmap

- **Single Ward Pilot**: Seeded with 3 Coimbatore wards (RS Puram, Gandhipuram, Peelamedu); expanding to all 100 wards in future releases.
- **GIS Geometry**: Currently uses approximate bounding GeoJSON polygons for the pilot wards; will integrate full QGIS shapefiles upon municipal deployment.
