# Civic Pulse: AI Agents & System Architecture Guide

This document details the **AI Engine Roles**, **File Locations**, and **Key Lines of Code** that power **Coimbatore Civic Pulse** and make it significantly superior to traditional civic complaint systems.

---

## 🤖 1. AI Agents & Intelligent Engines

### 1️⃣ **Real-Time Risk Assessor & Dynamic Hazard Classifier**
* **Role**: Evaluates citizen complaint descriptions in real-time, calculating a **Severity Score (1-10)**, assigning a **Hazard Type**, and generating a **custom 2-sentence explanation** tailored specifically to the problem (e.g. dark street light vs. pothole vs. water leak).
* **Location**: `src/backend/services/ai_service.py` (`analyze_complaint_severity_and_hazard`)
* **Trigger Site**: `src/backend/api/routers/complaints.py` (`create_complaint`)
* **Key Code Snippet**:
  ```python
  ai_result = analyze_complaint_severity_and_hazard(category, description)
  # Generates real-time severity score, hazard classification, and context-aware explanation
  ```

---

### 2️⃣ **Semantic Duplicate Detection Agent**
* **Role**: Uses Gemini 1.5 Flash to compare incoming complaint descriptions against open nearby complaints in the same ward. Prevents duplicate submissions and prompts citizens to upvote existing issues.
* **Location**: `src/backend/services/ai_service.py` (`detect_semantic_duplicate`)
* **Trigger Site**: `src/backend/api/routers/complaints.py` (`create_complaint`)
* **Key Code Snippet**:
  ```python
  dup_result = detect_semantic_duplicate(description, nearby_list)
  if dup_result.get("is_duplicate"):
      raise HTTPException(status_code=400, detail="Already reported — please upvote the existing complaint.")
  ```

---

### 3️⃣ **Vision AI Photo Verification Engine**
* **Role**: Analyzes uploaded camera evidence using Gemini Vision model to verify if the photo matches the reported civic issue category, filtering out blank photos or unrelated images.
* **Location**: `src/backend/services/ai_service.py` (`validate_photo_with_gemini`)
* **Trigger Site**: `src/backend/api/routers/complaints.py` (`create_complaint`)

---

### 4️⃣ **Intelligent Municipal Department Router**
* **Role**: Dynamically inspects category keywords and description context to assign complaints to the correct official department (`Street Lighting`, `Water Supply`, `Roads & Highways`, `Sanitation`, `Drainage`).
* **Location**: `src/backend/api/routers/complaints.py` (`get_department_for_complaint`)
* **Key Code Snippet**:
  ```python
  def get_department_for_complaint(category: str, description: str, db: Session):
      text = (category + " " + description).lower()
      if any(k in text for k in ["street light", "light", "electrical"]):
          return db.query(Department).filter(Department.name.ilike("%Street Lighting%")).first().id
  ```

---

### 5️⃣ **Autonomous 14-Day SLA & Escalation Engine**
* **Role**: Tracks resolution deadlines and automatically flags overdue or reopened complaints with supervisor escalation banners.
* **Location**: `src/backend/models.py` (`Complaint.escalation_due_at`) & `src/backend/api/routers/complaints.py`

---

## ⚡ 2. Outstanding Key Features (Why Civic Pulse Beats Traditional Systems)

| Feature | Civic Pulse Advantage | Key File Location |
| :--- | :--- | :--- |
| **0ms Upvote Responsiveness** | Optimistic state updates render UI upvotes instantly while writing to PostgreSQL asynchronously. | `src/frontend/src/App.jsx` |
| **PostgreSQL High-Speed Indexing** | Indexed columns on `ward_id`, `department_id`, `status`, and `vote_count` guarantee sub-50ms API endpoints. | `src/backend/models.py` |
| **Dual-Role Single Portal** | Unified Citizen & Municipal Officer authentication flow with 10-digit mobile number validation. | `src/frontend/src/pages/LandingLoginPage.jsx` |
| **Live Work Evidence Capture** | Live webcam capture integration for municipal officers to upload photographic completion proof. | `src/frontend/src/officer-dashboard/components/WebcamCapture.jsx` |

---

## 📁 3. Production Project Structure

```text
d:\projects\civic-pulse\
├── render.yaml                             # 1-Click Render Blueprint
├── AI_AGENTS_AND_CORE_ARCHITECTURE.md      # Core Architecture & AI Agents Guide
└── src/
    ├── backend/
    │   ├── api/routers/
    │   │   ├── admin.py                    # Officer SLA & Escalation API
    │   │   ├── auth.py                     # Mobile Number Auth API
    │   │   ├── complaints.py               # Grievances & AI Assessment Router
    │   │   └── wards.py                    # Coimbatore Ward Boundaries API
    │   ├── services/
    │   │   ├── ai_service.py               # Gemini AI Reasoning & Duplicate Engine
    │   │   └── cloudinary_service.py       # Cloud Photo Storage Engine
    │   ├── database.py                     # Neon PostgreSQL Engine
    │   ├── main.py                         # FastAPI Application Entrypoint
    │   ├── models.py                       # SQLAlchemy Models & DB Indexes
    │   ├── Procfile                        # Production Deployment Command
    │   ├── requirements.txt                # Python Dependencies
    │   ├── schemas.py                      # Pydantic Schemas
    │   └── seed_data.py                    # Official Coimbatore Wards & Depts Seeder
    └── frontend/
        ├── src/
        │   ├── api/client.js               # Production Axios API Client
        │   ├── components/                 # Citizen Map & Reporting UI
        │   ├── officer-dashboard/          # Municipal Officer Action Dashboard
        │   ├── pages/                      # Landing, Login & Citizen Pages
        │   ├── App.jsx                     # Application Root Controller
        │   ├── index.css                   # Global Tailwind Styling
        │   └── main.jsx                    # React Entrypoint
        ├── index.html                      # HTML Shell
        ├── package.json                    # Node Dependencies
        ├── vercel.json                     # Vercel SPA Routing Configuration
        └── vite.config.js                  # Vite Build Config
```
