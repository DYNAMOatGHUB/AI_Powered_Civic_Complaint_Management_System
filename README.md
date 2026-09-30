# AI-Powered Civic Complaint Management System (Civic Pulse)

🚀 **Live Demo:** [https://civic-pulse-frontend-gamma.vercel.app/](https://civic-pulse-frontend-gamma.vercel.app/)

## 🚨 The Problem: Urban Infrastructure Management
In rapidly growing municipalities, maintaining civic infrastructure (roads, water supply, sanitation, streetlights) is a massive logistical challenge. 

### The Cause
Citizens report issues through a fragmented mix of WhatsApp groups, phone calls, and outdated grievance portals. Ward officers—such as Sanitary Inspectors or Assistant Engineers—receive 30 to 50+ unstructured complaints daily. There is no automated triage system to categorize these complaints or determine their urgency.

### The Effect
- **Dangerous Delays:** Genuine emergencies (e.g., a burst main water pipe flooding a street) get buried under routine requests (e.g., a faded road marking).
- **Redundancy & Duplication:** The same pothole might be reported by 15 different residents, creating 15 separate tickets that the officer must manually review and close.
- **Resource Inefficiency:** Officers waste hours every morning manually sorting through the backlog instead of deploying field teams. Citizens lose trust due to slow response times.

---

## 💡 Our Solution
**Civic Pulse** is an end-to-end, AI-driven civic complaint management platform designed to eliminate the noise. It empowers citizens with a transparent reporting system and equips municipal officers with an intelligent, self-organizing dashboard. 

Instead of an endless chronological list of tickets, our system actively **reads, sees, categorizes, and ranks** the complaints based on real-world severity and community impact.

---

## ⚙️ How It Works: Architecture & Workflow

The system bridges the gap between citizens and municipal authorities through a 4-step intelligent workflow:

### 1. Transparent Citizen Reporting
Citizens access a responsive web application featuring a live, interactive map. Instead of filling out long forms, they simply drop a pin at the exact location of the issue. 
If a neighbor has already reported the issue (e.g., a broken streetlight), the citizen sees it on the map and can **Upvote** the existing pin instead of filing a duplicate.

### 2. AI Multimodal Triage (Powered by Gemini)
When a new complaint is filed, it is immediately passed to our AI Understanding Agent. The AI:
- **Analyzes the text description** to understand the context.
- **Processes the uploaded photo** to validate the issue (e.g., ensuring a picture of a pothole actually shows a pothole, filtering out spam or irrelevant images).
- **Determines the Category & Department:** It automatically routes the issue (e.g., "Water Leak" goes to the *Water Supply* department, "Garbage" goes to *Sanitation*).

### 3. Dynamic Priority Scoring Intelligence
The core innovation is our AI Priority Agent, which ensures critical issues are addressed first. The priority is not static; it dynamically evolves based on a custom algorithm:
**`Priority = Base AI Severity + (Community Upvotes × Weight) + Time Elapsed Penalty`**
- *Base Severity:* AI recognizes a "burst pipe" is inherently more dangerous than "overgrown weeds".
- *Community Impact:* As more citizens upvote a pin, its priority dynamically rises.
- *Time Factor:* Older, unresolved complaints slowly increase in priority to prevent them from being forgotten.

### 4. Smart Officer Dashboard
When the Ward Officer logs in, they aren't greeted by an inbox. They see an actionable, ranked dashboard. The most critical, highly-voted emergencies sit at the absolute top. The officer can instantly review the AI’s justification, check the photo evidence, and transition the issue (`Open → In Progress → Resolved`), triggering real-time notifications to the citizens.

---

## ✨ Features & Capabilities

- 🗺️ **Live Geospatial Mapping:** Built on Leaflet/OpenStreetMap, allowing precise geolocation of civic issues.
- 🧠 **LLM-Powered Validation:** Uses Google Gemini to detect spam and validate the severity of complaints from raw text and images.
- 🗳️ **Community Deduplication:** An upvoting mechanism that transforms 20 identical complaints into 1 high-priority mega-complaint.
- 🏢 **Intelligent Routing:** Automatically assigns complaints to specific government departments without human intervention.
- 📊 **Real-time Analytics:** Ward officers get immediate oversight on resolution times and high-density problem zones.
- 📱 **Progressive Web App (PWA) Ready:** A mobile-first citizen interface designed to work seamlessly on any smartphone browser.

---

**Civic Pulse** isn't just a ticketing system—it's an intelligent middleman that respects the citizen's time and supercharges the municipal officer's efficiency.
