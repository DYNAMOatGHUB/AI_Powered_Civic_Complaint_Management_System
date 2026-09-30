# Civic Pulse: Complete Deployment & Log Monitoring Guide

This document provides a step-by-step production deployment guide for the **Database**, **Backend (FastAPI)**, and **Frontend (React)** using **Neon**, **Render**, and **Vercel**, including instructions on **how to view live deployment logs**.

---

## 🗄️ Step 1: Database Deployment (Neon PostgreSQL)

### 1. Create the PostgreSQL Database
1. Go to [neon.tech](https://neon.tech/) and sign in.
2. Click **"New Project"** → Name it `civic-pulse`.
3. On the project dashboard, copy the **Connection Details Connection String**:
   ```text
   postgresql://neondb_owner:your_password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 📊 How to View Database Logs (Neon):
1. In the Neon Console sidebar, click **"Monitoring"** or **"Operations"**.
2. You can view live connection logs, query performance, active connections, and execution statistics in real-time.

---

## 🐍 Step 2: Backend Deployment (Render Web Service)

### 1. Deploy FastAPI to Render
1. Push your code repository to **GitHub**.
2. Log in to [render.com](https://render.com/).
3. Click **"New +"** → Select **"Web Service"**.
4. Connect your GitHub repository.
5. Fill in the deployment details:
   - **Name**: `civic-pulse-backend`
   - **Root Directory**: `src/backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT --ws none`

### 2. Configure Environment Variables in Render:
Scroll down to **Environment Variables** and add:
- `DATABASE_URL`: *(Your Neon PostgreSQL URL from Step 1)*
- `JWT_SECRET_KEY`: *(Any secret string e.g. `civic_pulse_secret_2026`)*
- `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
- `CLOUDINARY_CLOUD_NAME`: *(Your Cloudinary Cloud Name)*
- `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
- `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*

Click **"Create Web Service"**. Render will deploy your API and give you a live URL (e.g., `https://civic-pulse-backend.onrender.com`).

### 📊 How to View Live Backend Logs (Render):
1. Open your Web Service dashboard on Render.
2. Click **"Logs"** in the left sidebar menu.
3. You will see a **live streaming terminal** showing every HTTP request, print statement, error stack trace, and database log in real-time!

---

## ⚛️ Step 3: Frontend Deployment (Vercel)

### 1. Update Frontend API Client Configuration
Open `src/frontend/src/api/client.js` (or set environment variable) to point to your live Render backend URL:

```javascript
// src/frontend/src/api/client.js
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://civic-pulse-backend.onrender.com';
```

### 2. Deploy React Frontend to Vercel
1. Log in to [vercel.com](https://vercel.com/).
2. Click **"Add New..."** → Select **"Project"**.
3. Import your GitHub repository.
4. Fill in the framework settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `src/frontend`
5. Expand **Environment Variables** and add:
   - `VITE_BACKEND_URL`: `https://civic-pulse-backend.onrender.com`
6. Click **"Deploy"**.

### 📊 How to View Live Frontend Logs (Vercel):
1. Go to your Vercel Project Dashboard.
2. Click on **"Deployments"** → Select the active deployment.
3. Click **"Building Logs"** to see build logs or **"Functions / Runtime Logs"** to view real-time frontend logs and network requests!

---

## 🔍 Log Viewing Checklist

| Service | Host | Where to View Live Logs |
| :--- | :--- | :--- |
| **Backend API** | [Render Dashboard](https://dashboard.render.com/) | Web Service → **"Logs"** tab (Real-time stdout / error logs) |
| **Frontend UI** | [Vercel Dashboard](https://vercel.com/) | Project → **"Deployments"** → **"Building / Functions Logs"** |
| **Database** | [Neon Console](https://console.neon.tech/) | Project → **"Monitoring & Operations"** (Query & Connection logs) |
