# Comprehensive Deployment Guide: Civic Pulse

This guide provides a highly detailed, step-by-step walkthrough to deploy the AI-Powered Civic Complaint Management System completely from scratch. 

We will use **Render** for the Backend, **Vercel** for the Frontend, and **Neon** for the PostgreSQL database.

---

## Phase 1: Database Setup (Neon PostgreSQL)

1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Click **Create Project**.
3. Name your project (e.g., `civic-pulse-db`), choose a region closest to your users, and select PostgreSQL version 15 or 16.
4. Click **Create Project**.
5. Once created, you will see a connection string that looks like this:
   `postgresql://username:password@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
6. **Save this Connection String**; you will need it for the Backend Deployment.

---

## Phase 2: Acquiring API Keys

### 1. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Get API key** and then **Create API key**.
4. **Save this API key**.

### 2. Cloudinary API Key (Image Storage)
1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account.
2. Go to your Dashboard.
3. You will need your `Cloudinary URL`. It looks like:
   `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
4. **Save this Cloudinary URL**.

---

## Phase 3: Backend Deployment (Render)

Render is great for hosting Python FastAPI backends.

1. Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2. On the Render Dashboard, click **New +** and select **Web Service**.
3. **Connect a repository**: Select your `AI_Powered_Civic_Complaint_Management_System` repository.
4. Fill in the deployment details:
   - **Name**: `civic-pulse-backend`
   - **Region**: Choose the one closest to your Neon database region.
   - **Branch**: `main`
   - **Root Directory**: `src/backend` *(This is extremely important!)*
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Scroll down to **Environment Variables** and add the following keys exactly as written:
   - `DATABASE_URL`: *(Paste your Neon connection string here)*
   - `GEMINI_API_KEY`: *(Paste your Gemini API key here)*
   - `CLOUDINARY_URL`: *(Paste your Cloudinary URL here)*
6. Click **Create Web Service**.
7. Render will now build and deploy your backend. It may take 3-5 minutes.
8. Once complete, you will see a green "Live" badge. 
9. **Save your Backend URL** (e.g., `https://civic-pulse-backend-xxxx.onrender.com`).

---

## Phase 4: Frontend Deployment (Vercel)

Vercel is perfect for React/Vite frontends.

1. Go to [Vercel.com](https://vercel.com/) and sign up with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Import your `AI_Powered_Civic_Complaint_Management_System` repository.
4. **Configure Project**:
   - **Project Name**: `civic-pulse-frontend`
   - **Framework Preset**: `Vite` (Vercel usually auto-detects this).
   - **Root Directory**: Click `Edit` and select `src/frontend`. *(This is extremely important!)*
5. **Environment Variables**:
   - Open the Environment Variables dropdown.
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: *(Paste your Render Backend URL here, e.g., `https://civic-pulse-backend-xxxx.onrender.com` without a trailing slash)*
6. Click **Deploy**.
7. Vercel will build and deploy your frontend. It usually takes less than a minute.
8. Once complete, click **Continue to Dashboard** and click **Visit** to see your live website.
9. **Save your Frontend URL** (e.g., `https://civic-pulse-frontend.vercel.app`).

---

## Phase 5: Linking Frontend to Backend (CORS Configuration)

By default, the backend has a dynamic wildcard CORS policy, meaning it will allow requests from your new frontend immediately. 

However, if you want to strictly secure your API:
1. Open `src/backend/main.py` in your repository.
2. Locate the `origins` list around line 16.
3. Add your Vercel Frontend URL to the list:
   ```python
   origins = [
       "https://your-new-frontend-url.vercel.app",
       "http://localhost:5173",
       "http://localhost:3000"
   ]
   ```
4. Commit and push this change to GitHub. Render will automatically redeploy your backend with the updated CORS policy.

---

## Phase 6: Verify Deployment

1. Open your Live Frontend URL.
2. Create a new test complaint.
3. Check the "View Complaints" page or map to verify it appears.
4. Log into the Officer Dashboard (using the credentials generated in your system) and verify the AI successfully assigned a priority score.

Congratulations! Your application is fully deployed and live.
