# Architecture Proposal

> Fill this out and commit it by **Friday, July 24 · 11:59 PM IST**. This file *is*
> your Ideation-Phase submission — no separate form. Keep it living; update it as
> your design evolves.

- **Team name:** _<!-- your team name -->_
- **Team code:** _<!-- e.g. TEAM-000 (from your organizers) -->_
- **Track:** _<!-- AI for Good Health & Well-being / Zero Hunger & Economic Growth / Sustainable Cities & Climate Action / Strong Institutions -->_
- **Members:** _<!-- Name (GitHub @handle), Name (@handle), … -->_

## 1. Problem
Mr. Karthikeyan, the Sanitary Inspector for a Coimbatore ward  responsible for civic complaints like potholes, water leaks, and broken streetlights  currently sorts through 30–40 reports a day arriving as WhatsApp messages, phone calls, and portal entries, spending up to an hour each morning manually figuring out what's urgent. There's no way to tell a burst pipe from a faded road marking until someone visits the site. Citizens, meanwhile, have no way to signal that an issue is urgent or affects many people, so genuine emergencies sit in the same undifferentiated queue as routine complaints and the same issue often gets reported multiple times as separate, disconnected entries with no way to recognize they're one problem.

## 2. Who it helps
The Ward Officer is the primary user of the system. 
For example: 
Mr. Karthikeyan, Sanitary Inspector for a Coimbatore ward, currently receives 30–40 civic complaints a day through phone calls, WhatsApp groups, and the public grievance portal, and spends up to an hour each morning manually sorting them to identify what's urgent. Instead, he uses the AI-powered dashboard to instantly see prioritized issues, assign them to the right department, and track resolution.

Municipal Departments : once a complaint is prioritized, it's forwarded to the department responsible: Roads & Highways (potholes, damaged roads), Water Supply (leaks, shortages, drainage), Sanitation (garbage, unclean areas), Street Lighting (non-functional lights). Each receives categorized, prioritized complaints instead of raw unsorted ones.

Citizens :specifically, resident citizens living within the ward who encounter or are affected by these civic issues daily. 
For example, Mrs. Lakshmi, a resident of the same Coimbatore ward, reports a water leak near her street, upvotes an existing pothole complaint instead of filing a duplicate, and confirms once the issue is actually fixed  helping keep Mr. Karthikeyan's dashboard accurate and up to date.

## 3. Proposed solution
For the hackathon, we build the smallest working version of the system focused on one ward, one Ward Officer, one citizen reporting scenario, and one core AI function. The goal is to help Mr. Karthikeyan, the Sanitary Inspector, quickly identify the most urgent public infrastructure complaint in his ward instead of manually reviewing every report  a real gap, since he once had a burst pipe complaint sit buried for nearly a day among 30+ same-day reports before it flooded part of the street. The solution focuses on citizens (for example, a resident named Mrs. Lakshmi) reporting issues through a web application, while AI performs only one task  analyzing each complaint to determine its severity. For example, consider Mr. Karthikeyan, the Sanitary Inspector of Ward 1. One morning, Lakshmi, a resident of the same ward, notices a burst water pipeline on her street. She opens the web application and finds that another resident has already reported the issue on the live map. Instead of creating a duplicate complaint, she simply upvotes the existing report, while nearby residents do the same, showing that the problem affects multiple people urgency here comes from votes, not keywords, so a leak with 17 upvotes outranks a noise complaint with 10. The complaint is analyzed once by AI, which reads the description and optional photo to assign a severity score. Combined with community upvotes and time open, it is automatically ranked so the most urgent complaints appear first. When Mr. Karthikeyan opens the dashboard, he immediately sees Lakshmi's complaint ranked higher on urgency and votes; optionally he can directly call Lakshmi to verify the severity before dispatching the field team. The officer updates the complaint status (Open → In Progress → Resolved), and citizens receive real-time status updates through the web application.
Deployment: How Citizens Adopt It: Citizens (for example: Lakshmi in Ward 1) access the web application through links shared on the municipality's website, social media pages, and resident WhatsApp groups. Unlike a phone call to the ward office, the app shows her the report is actually logged, lets her upvote instead of duplicating, and shows votes stacking as proof the issue is shared, not lost. They report issues on a live map, upvote existing complaints, and receive status updates.
How the Ward Officer Adopts It: ward officer (for example: Mr. Karthikeyan, sanitary officer) opens the browser-based dashboard on his existing office computer and immediately sees a ranked list of complaints instead of manually reviewing reports from multiple sources.
Rollout Path: The solution will be piloted in a single municipal ward and gradually expanded to additional wards after validating its effectiveness

## 4. High-level architecture
Citizen Reports
(Login • Ward Selection • Live Map • Upvote / New Issue)
                     │
                     ▼
            Node.js Backend API
                     │
                     ▼
      AI Report Understanding Agent
 (Issue Understanding • Validation • Categorization)
                     │
                     ▼
      AI Priority Intelligence Agent
 (Severity Analysis • Vote-Based Priority • Waiting Time)
                     │
                     ▼
      Ward & Department Assignment Agent
 (Ward Detection • Department Routing • Officer Assignment)
                     │
                     ▼
      PostgreSQL + Image Storage
 (Issue Records • Votes • Photos • Status)
                     │
                     ▼
          Official Dashboard
      (Assignment • Progress • Resolution)
                     │
                     ▼
     Resolution Verification Agent
 (Resolution Validation • Citizen Confirmation)
                     │
                     ▼
          Notification Agent
 (Status Updates • Reopen Requests • Issue Closure)
                     │
                     ▼
        Citizen Dashboard / Live Map

```
<!-- e.g. Mobile PWA → Vercel function → Gemini API (OCR) → Postgres
             ↘ Cloud Run cron for the nightly sync -->
```

## 5. Tech stack
Frontend: React.js (Vite), Tailwind CSS, Leaflet.js Backend: FastAPI (Python) Database: PostgreSQL (Neon) AI Framework: LangGraph LLM: Gemini 2.5 Flash Vision Model: Gemini Vision Maps: OpenStreetMap+QGIS Authentication: JWT + OTP ORM: SQLAlchemy Storage: Cloudinary Real-Time: FastAPI WebSockets Deployment: Vercel, Render
## 6. Milestones to hackathon day
_A rough plan from now to Aug 8–9._

- [ ] …
- [ ] …

## 7. Open questions / help needed
_Anything you're unsure about or want mentor input on._
