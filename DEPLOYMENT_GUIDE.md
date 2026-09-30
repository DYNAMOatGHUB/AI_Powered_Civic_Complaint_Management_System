# Civic Pulse: Complete Production Deployment & Log Guide

This guide provides step-by-step instructions to deploy the entire Civic Pulse stack: **Database (PostgreSQL)**, **Backend API (FastAPI)**, and **Frontend (React)**, including **how to view real-time logs**.

---

## 🗄️ Step 1: Deploy PostgreSQL Database (Neon)

1. Go to [neon.tech](https://neon.tech/) and sign up for a free account.
2. Click **"New Project"** and name it `civic-pulse`.
3. Copy your **PostgreSQL Connection String**:
   ```text
   postgresql://neondb_owner:your_password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 📊 How to View Database Logs:
- Go to **Neon Dashboard** → Select Project → Click **"Monitoring"** or **"Operations"** to view real-time query logs and connection health.

---

## 🐍 Step 2: Deploy Backend API (Render)

1. Push your repository to **GitHub**.
2. Sign in to [render.com](https://render.com/).
3. Click **"New +"** → **"Web Service"** → Connect your GitHub repo.
4. Set the configuration options:
   - **Name**: `civic-pulse-backend`
   - **Root Directory**: `src/backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT --ws none`

5. Add your Environment Variables under **Environment**:
   - `DATABASE_URL`: *(Your Neon Connection String)*
   - `JWT_SECRET_KEY`: `civic_pulse_secret_2026`
   - `GEMINI_API_KEY`: *(Your Google Gemini Key)*
   - `CLOUDINARY_CLOUD_NAME`: *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*

6. Click **"Create Web Service"**. Render will output your live API URL (e.g. `https://civic-pulse-backend.onrender.com`).

### 📊 How to View Live Backend Logs:
- Go to your Render Dashboard → Click your Web Service → Select **"Logs"** in the left sidebar to view **live streaming terminal logs**.

---

## ⚛️ Step 3: Deploy Frontend (Vercel)

1. Sign in to [vercel.com](https://vercel.com/).
2. Click **"Add New..."** → **"Project"** → Import your GitHub repository.
3. Set the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Edit and select `src/frontend`
4. Add Environment Variable:
   - `VITE_BACKEND_URL`: `https://civic-pulse-backend.onrender.com`
5. Click **"Deploy"**.

### 📊 How to View Live Frontend Logs:
- Go to Vercel Dashboard → Select Project → Click **"Deployments"** → Select Active Deployment → View **"Building Logs"** and **"Functions / Runtime Logs"**.

---

## 📋 Quick Log Viewing Summary

| Component | Platform | How to View Live Logs |
| :--- | :--- | :--- |
| **Backend API** | [Render](https://dashboard.render.com/) | Render Dashboard → Service → **"Logs"** tab |
| **Frontend UI** | [Vercel](https://vercel.com/) | Vercel Dashboard → Project → **"Deployments"** → **"Runtime Logs"** |
| **Database** | [Neon](https://console.neon.tech/) | Neon Dashboard → Project → **"Monitoring & Operations"** |
