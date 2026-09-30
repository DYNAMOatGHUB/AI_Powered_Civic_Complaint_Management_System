# PostgreSQL Setup & Integration Guide (Neon & Local Postgres)

This guide walks you through connecting your **PostgreSQL** database (such as **Neon PostgreSQL** or a **Local PostgreSQL** instance) to the Civic Pulse backend.

---

## 🐘 Option A: Connecting Neon PostgreSQL (Recommended for Hackathons / Production)

[Neon](https://neon.tech/) is a serverless, cloud-hosted PostgreSQL database.

### Step 1: Get your Connection String from Neon
1. Go to [neon.tech](https://neon.tech/) and sign in.
2. Create a new project or select an existing one.
3. On the Dashboard, copy your **Connection Details / Connection String**.
4. It will look like this:
   ```text
   postgresql://neondb_owner:npg_x1y2z3...@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Add it to `src/backend/.env`
Open `d:\projects\civic-pulse\src\backend\.env` and paste your Neon URL into `DATABASE_URL`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_x1y2z3...@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## 💻 Option B: Connecting a Local PostgreSQL Server

If you have PostgreSQL installed locally on your Windows machine (or running in Docker):

### Step 1: Create the Database
In your PostgreSQL shell (`psql` or pgAdmin), create a database named `civic_pulse`:

```sql
CREATE DATABASE civic_pulse;
```

### Step 2: Add it to `src/backend/.env`
Open `d:\projects\civic-pulse\src\backend\.env` and set your local credentials:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/civic_pulse
```

---

## ⚙️ How the Auto-Migration & Table Seeding Works

Once you save `src/backend/.env`, Uvicorn will auto-reload. The backend will automatically:
1. Connect to PostgreSQL using `psycopg2-binary`.
2. Enable connection pooling and `pool_pre_ping=True` (handles idle timeouts gracefully).
3. Create all tables automatically:
   - `users`
   - `officers`
   - `wards`
   - `departments`
   - `complaints`
   - `complaint_votes`
   - `complaint_escalations`
   - `officer_performance_flags`
4. Seed the initial **3 Coimbatore Wards** (RS Puram, Gandhipuram, Peelamedu) and default demo accounts!

---

## 🧪 Verification

1. Start/restart Uvicorn:
   ```powershell
   cd d:\projects\civic-pulse\src\backend
   uvicorn main:app --reload --port 8000 --ws none
   ```

2. Open `http://localhost:8000/docs` in your browser.
3. Execute `GET /wards/` — you will receive the seeded Coimbatore wards directly from PostgreSQL!
