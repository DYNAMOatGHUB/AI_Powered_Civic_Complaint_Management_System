# Civic Pulse: API Keys & Credentials Guide

This guide explains **where to get each API key**, **what website to visit**, and **which exact feature/action each key powers** in the Civic Pulse application.

---

## 🔑 Summary Table of API Keys

| Environment Variable | Official Website | Exact Action / Feature Powered |
| :--- | :--- | :--- |
| **`GEMINI_API_KEY`** | [Google AI Studio](https://aistudio.google.com/) | 🤖 **AI Duplicate Detection** (Gemini 1.5 Flash) & **Live Photo Validation** (Gemini Vision) |
| **`CLOUDINARY_CLOUD_NAME`** | [Cloudinary Console](https://cloudinary.com/) | 📷 **Image Cloud Storage**: Uploads camera photos & generates image URLs |
| **`CLOUDINARY_API_KEY`** | [Cloudinary Console](https://cloudinary.com/) | 📷 Authentication credential for image uploads |
| **`CLOUDINARY_API_SECRET`** | [Cloudinary Console](https://cloudinary.com/) | 📷 Secret signature credential for image uploads |
| **`DATABASE_URL`** | [Neon PostgreSQL](https://neon.tech/) | 🐘 **Main Database**: Stores users, wards, complaints, upvotes, and SLA logs |
| **`JWT_SECRET_KEY`** | Self-Generated (Any random string) | 🔒 **Authentication**: Cryptographically signs citizen session tokens |

---

## 1. 🤖 Google Gemini API Key (`GEMINI_API_KEY`)

### 🌐 Website to Get Key:
👉 **[https://aistudio.google.com/](https://aistudio.google.com/)**

### 📋 Step-by-Step Instructions:
1. Open [aistudio.google.com](https://aistudio.google.com/) and sign in with your Google account.
2. Click **"Get API key"** in the top left or center menu.
3. Click **"Create API key in new project"**.
4. Copy the generated string (starts with `AIzaSy...`).
5. Paste it in `src/backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

### ⚡ Which Actions / Features it Powers:
1. **Semantic Duplicate Detection**: When a citizen submits a complaint, Gemini 1.5 Flash reads the text and checks nearby open complaints. If it detects the same physical issue (even with different wording), it blocks creation and urges the user to upvote the existing complaint!
2. **Live Photo Validation**: Uses Gemini Vision to analyze live camera photos, verifying that the image visually depicts the reported issue (e.g. pothole, water leak) and rejecting selfies, documents, or unrelated images.

---

## 2. 📷 Cloudinary API Credentials (`CLOUDINARY_*`)

### 🌐 Website to Get Keys:
👉 **[https://cloudinary.com/](https://cloudinary.com/)**

### 📋 Step-by-Step Instructions:
1. Go to [cloudinary.com](https://cloudinary.com/) and click **"Sign Up for Free"**.
2. Once signed in, go to your **Dashboard / Console**.
3. Under **Product Environment Credentials**, copy your 3 values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Paste them into `src/backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=1234567890
   CLOUDINARY_API_SECRET=abcdefg_12345
   ```

### ⚡ Which Actions / Features it Powers:
- **Cloud Photo Upload**: Stores live camera captures of civic complaints securely in the cloud and provides CDN image URLs displayed on map pins and complaint detail cards.

---

## 3. 🐘 Neon PostgreSQL Database URL (`DATABASE_URL`)

### 🌐 Website to Get Connection URL:
👉 **[https://neon.tech/](https://neon.tech/)**

### 📋 Step-by-Step Instructions:
1. Go to [neon.tech](https://neon.tech/) and create a free account.
2. Click **"Create Project"** and name it `civic-pulse`.
3. On the project dashboard, locate **Connection Details**.
4. Copy the **PostgreSQL Connection String**.
5. Paste it into `src/backend/.env`:
   ```env
   DATABASE_URL=postgresql://neondb_owner:your_password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### ⚡ Which Actions / Features it Powers:
- **Persistent Data Storage**: Manages users, seeded Coimbatore ward boundaries (GeoJSON), complaint entries, upvote counts, status transitions, and 14-day SLA escalation logs.

---

## 4. 🔒 JWT Secret Key (`JWT_SECRET_KEY`)

### 🌐 Website:
No website required! Generate any secure random text string.

### 📋 Step-by-Step Instructions:
Set any secret string in `src/backend/.env`:
```env
JWT_SECRET_KEY=coimbatore_civic_pulse_super_secret_jwt_key_2026
```

### ⚡ Which Actions / Features it Powers:
- Encrypts and verifies user session JWT tokens after citizen login and registration.

---

## 📝 Example `src/backend/.env` File

Here is what your complete `src/backend/.env` file will look like once all keys are added:

```env
# PostgreSQL Database (Neon)
DATABASE_URL=postgresql://neondb_owner:your_password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require

# Security / JWT
JWT_SECRET_KEY=coimbatore_civic_pulse_super_secret_jwt_key_2026

# AI Integration (Google Gemini)
GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Host Settings
FRONTEND_BASE_URL=http://localhost:5173
BACKEND_BASE_URL=http://localhost:8000
```
