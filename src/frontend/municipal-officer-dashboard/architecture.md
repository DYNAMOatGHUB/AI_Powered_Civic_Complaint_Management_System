# Project Architecture

## Overview

High level description of system architecture. The Municipal Civic Complaint Officer Dashboard is designed as an operational, single-page web workspace. It connects ward-level officers to real-time citizen-submitted complaints, providing streamlined workflows for triage, response planning, proof-of-work submission, citizen verification, and escalation handling.

## Tech Stack

Frontend:
- Framework: React 19 + Vite 8
- Styling: Tailwind CSS v4 (Vanilla CSS variables + Utility classes)
- Mapping: Leaflet.js + React-Leaflet
- Icons: Lucide React

Backend Integration Ready:
- Framework: FastAPI (Python REST APIs & WebSockets)
- Database: PostgreSQL with SQLAlchemy ORM
- Auth: JWT Bearer Tokens & Mobile OTP Verification
- WebSockets: Real-time complaint state and notification streaming

Hosting & Deployment:
- Web App: Vercel / Netlify static build or Node container
- Database & API: Dockerized FastAPI + PostgreSQL on cloud infrastructure

## System Components

### Frontend
- **Auth Module**: Officer login with role-based filtering (Electrical, Water, Roads, Sanitation).
- **Dashboard Header & Filters**: Ward info, active notifications dropdown, search bar, and priority/date filters.
- **Queue Manager**: Tabbed complaint queue (Pending | Ongoing | Completed) with backend-driven priority sorting (P1 Critical to P4 Low).
- **Complaint Detail Drawer / Page**: Multi-panel view detailing Citizen Report (photo zoom), Interactive Leaflet Map, AI Assessment, Community Impact, Response Form, Completion Evidence Uploader, and Citizen Verification Simulator.
- **History & Escalation Tracker**: Full chronological audit log for each complaint ID (CID) preserving all reopen attempts and escalation warnings.

### Backend (Interface Design)
- `/api/v1/auth/login`: Authenticates officer and returns department role, ward ID, and JWT token.
- `/api/v1/complaints/queue`: Returns filtered complaints for officer department sorted by priority score and submission timestamp.
- `/api/v1/complaints/{id}/respond`: Records expected resolution date/time, action plan, and updates status to `ONGOING`.
- `/api/v1/complaints/{id}/complete`: Accepts proof of work photo and description, moving status to `AWAITING_VERIFICATION`.
- `/api/v1/complaints/{id}/verify`: Processes citizen feedback (Issue Fixed -> `COMPLETED`, Issue Not Fixed -> `REOPENED` with same CID & incremented failure count).

### Database Schema (Prepared Models)
- `users`: id, name, email, role, department, ward_id, created_at
- `complaints`: id (CID), title, description, department, priority_level (P1-P4), priority_score, status, ward_id, citizen_id, location_lat, location_lng, image_url, affected_count, ai_assessment_json, created_at, updated_at
- `officer_responses`: id, complaint_id, officer_id, message, expected_date, expected_time, action_plan, created_at
- `resolution_evidence`: id, complaint_id, photo_url, description, uploaded_at
- `citizen_verifications`: id, complaint_id, status (fixed/not_fixed), rejection_reason, new_photo_url, verified_at
- `complaint_logs`: id, complaint_id, action_type, actor, details, timestamp

## Folder Structure

```text
municipal-officer-dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── LoginModal.jsx
│   │   ├── NotificationDropdown.jsx
│   │   ├── ComplaintCard.jsx
│   │   ├── ComplaintDetail.jsx
│   │   ├── CitizenVerificationModal.jsx
│   │   └── LeafletMap.jsx
│   ├── data/
│   │   └── mockComplaints.js
│   ├── services/
│   │   └── api.js
│   ├── types/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── current.md
├── architecture.md
├── plan.md
└── rules.md
```

## Data Flow

1. **Login Flow**: Officer logs in -> Account specifies department (e.g. Electrical) -> Dashboard loads complaints targeted ONLY for Electrical department in Ward 1.
2. **Pending -> Ongoing Flow**: Officer opens P1 complaint -> Inputs expected resolution time (e.g., Tomorrow 3 PM) -> Status transitions to `Ongoing` -> Log appended.
3. **Ongoing -> Awaiting Verification Flow**: Physical work complete -> Officer uploads rectification photo + description -> Status changes to `Awaiting Verification`.
4. **Verification & Reopening Flow**:
   - If Citizen approves -> Status changes to `Completed` (visible in Completed tab until citizen removes it).
   - If Citizen rejects -> Status changes to `🔴 REOPENED` on the SAME CID -> Escalation counter increments -> Complaint re-enters Officer's active queue with rejection notes and photo evidence.

## Architecture Decisions

Decision 1: Single Complaint ID (CID) Lifecycle Preservation
Reason: Reopened issues must maintain the original CID and complete historical log rather than generating new CIDs. This ensures accountability, prevents duplicate counts, and enables supervisor escalation detection.

Decision 2: Information-First & Operational Visual Hierarchy
Reason: Officers process 30-40 complaints daily. Avoiding nested pages, complex graphs, and dark SaaS clutter reduces cognitive fatigue and maximizes operational speed.
