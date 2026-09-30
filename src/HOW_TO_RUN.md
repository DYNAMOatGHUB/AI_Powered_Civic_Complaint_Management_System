# How to Run Civic Pulse

Follow these step-by-step instructions to set up and run both the backend API and frontend application.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher) & **npm**: [Download Node.js](https://nodejs.org/)
- **Python** (v3.10 or higher) & **pip**: [Download Python](https://www.python.org/)

---

## 🐍 1. Setting Up & Running the Backend (FastAPI)

1. Open your terminal / command prompt.
2. Navigate to the backend directory from the project root:
   ```bash
   cd src/backend
   ```

3. *(Optional but Recommended)* Create and activate a Python virtual environment:
   - **Mac/Linux:**
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```

4. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the Database:**
   Seed the PostgreSQL/SQLite database with default wards, departments, and demo officers:
   ```bash
   python seed_data.py
   ```

6. Start the backend development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

7. **Verify Backend:**
   - Open your browser and go to `http://localhost:8000/docs`.
   - You should see the FastAPI interactive Swagger API documentation.

---

## ⚛️ 2. Setting Up & Running the Frontend (React + Vite)

1. Open a **new / second** terminal window.
2. Navigate to the frontend directory from the project root:
   ```bash
   cd src/frontend
   ```

3. Install the Node.js packages:
   ```bash
   npm install
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. **Verify Frontend:**
   - Open your browser and visit `http://localhost:5173`.
   - You should see the Civic Pulse application dashboard!

---

## 🔑 Test Credentials (Dev Mode)

### Officer Login (Pre-seeded by `seed_data.py`)
- Official Mobile: `9988776655` (Electricity) or `9988776656` (Water Supply)
- Password: `officer123`
- Role: `ward_officer`

### Registration / Signup (Citizen)
- Endpoint: `POST http://localhost:8000/auth/register`
- JSON Body:
  ```json
  {
    "mobile_number": "9876543210",
    "password": "password123",
    "username": "citizen1",
    "name": "Lakshmi",
    "email": "lakshmi@example.com"
  }
  ```

### Login API Payload Structure (Citizen or Officer)
- Endpoint: `POST http://localhost:8000/auth/login`
- JSON Body:
  ```json
  {
    "mobile_number": "9876543210",
    "password": "password123",
    "role": "citizen"
  }
  ```
