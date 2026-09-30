# Deployment Guide

This guide covers how to deploy the AI Powered Civic Complaint Management System to a new hosting platform from scratch.

## Backend Deployment (e.g., Render, Railway, DigitalOcean App Platform)

1. **Connect your GitHub repository** to your chosen hosting provider.
2. **Environment Variables**: Set the following environment variables in your hosting provider's dashboard:
   - `DATABASE_URL`: Your PostgreSQL database connection string (e.g., from Neon or Supabase).
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `CLOUDINARY_URL`: Your Cloudinary API connection string.
3. **Build and Run Commands**:
   - **Root Directory**: Set the root directory to `src/backend`.
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Deploy**: Trigger a manual deploy. Once deployed, note down the provided backend URL (e.g., `https://your-backend-api.com`).

## Frontend Deployment (e.g., Vercel, Netlify, Cloudflare Pages)

1. **Connect your GitHub repository** to your chosen hosting provider.
2. **Environment Variables**: Set the following environment variable in your hosting provider's dashboard:
   - `VITE_BACKEND_URL`: Set this to your newly deployed backend URL (e.g., `https://your-backend-api.com`).
3. **Build and Output**:
   - **Root Directory**: Set the root directory to `src/frontend`.
   - **Framework Preset**: Vite (or React).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **CORS Configuration**:
   - After deploying your frontend, make sure to add your frontend URL to the `origins` list in `src/backend/main.py` if strict CORS is needed (currently, a wildcard fallback is in place for development).
5. **Deploy**: Trigger the deployment. Your app should now be live!
