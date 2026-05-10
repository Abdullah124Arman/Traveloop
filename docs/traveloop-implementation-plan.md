🧳 TRAVELOOP
Implementation Plan
Sprint-Based Development Roadmap — Hackathon Edition
1. Team Roles

The following table:
Role,Responsibilities
Frontend Lead,"React app scaffold, routing, core UI components, state management"
Backend Lead,"Express API, Prisma schema, auth, all endpoints"
Full Stack Dev,"Itinerary builder, budget screen, city/activity search"
UI/UX,"Tailwind styling, responsive layout, component polish"
QA / DevOps,"Testing, deployment, seed data, integration"

2. Sprint Plan

Sprint 0 — Setup (Hours 0–2)

The following table:
Task,Owner,Output
Init React + Vite + TypeScript,Frontend,Working dev server
Init Express + Prisma + PostgreSQL,Backend,DB connection verified
"Define Prisma schema, run migrations",Backend,All tables created
Setup Railway/Render deployment,DevOps,CI pipeline active
Configure environment variables,All,.env.example committed
Seed cities and activities data,Backend,"50+ cities, 200+ activities"

Sprint 1 — Auth & Core Trip CRUD (Hours 2–6)

The following table:
Task,Owner,Output
Login/Signup UI,Frontend,Auth screens complete
"POST /auth/login, /auth/signup",Backend,JWT returned
Auth middleware + protected routes,Backend,verifyToken working
Dashboard screen skeleton,Frontend,Layout + nav
GET/POST/DELETE /trips,Backend,Trip CRUD API
My Trips screen + Create Trip form,Frontend,Trip list functional

Sprint 2 — Itinerary Builder (Hours 6–12)

The following table:
Task,Owner,Output
City search screen + GET /cities,Full Stack,Search working
Stop CRUD: POST/PATCH/DELETE /stops,Backend,Stops API
Itinerary builder UI + add stop flow,Frontend,Builder screen
Activity search screen + GET /activities,Full Stack,Filtered results
Stop-activity CRUD endpoints,Backend,Activities linkable
Drag-to-reorder stops (dnd-kit),Frontend,Reorder works
Itinerary view screen (list mode),Frontend,View screen

Sprint 3 — Budget, Checklist, Notes (Hours 12–18)

The following table:
Task,Owner,Output
GET /trips/:id/budget (aggregation),Backend,Cost totals by category
Budget screen: charts (Recharts),Frontend,Pie + bar charts
Over-budget alert logic,Full Stack,Red highlight days
Checklist CRUD endpoints,Backend,Checklist API
Packing checklist screen,Frontend,Functional checklist
Notes CRUD endpoints,Backend,Notes API
Trip notes screen,Frontend,Add/edit/delete notes

Sprint 4 — Share, Profile, Polish (Hours 18–24)

The following table:
Task,Owner,Output
Share token generation + GET /share/:token,Backend,Public URL working
Public itinerary view screen,Frontend,Read-only view
Social share buttons,Frontend,Copy/WhatsApp/Twitter
Profile & settings screen,Frontend,PATCH /users/me
Calendar view toggle (itinerary),Frontend,Calendar layout
Responsive mobile pass,UI,375px+ fully usable
Admin dashboard (if time permits),Full Stack,Stats + tables

3. MVP Priority Matrix

The following table:
Feature,Priority,Sprint,Effort
Auth (login/signup),P0 Must,1,Small
Create & manage trips,P0 Must,1,Small
Add stops + activities,P0 Must,2,Medium
Itinerary view,P0 Must,2,Small
City & activity search,P0 Must,2,Medium
Budget breakdown,P1 Should,3,Medium
Packing checklist,P1 Should,3,Small
Trip notes,P1 Should,3,Small
Share/public URL,P1 Should,4,Small
Profile & settings,P2 Nice,4,Small
Calendar view,P2 Nice,4,Medium
Drag reorder stops,P2 Nice,2,Small
Admin dashboard,P3 Optional,4,Large

4. Risk Register

The following table:
Risk,Likelihood,Impact,Mitigation
DB schema changes mid-sprint,Medium,High,"Finalize schema in Sprint 0, use Prisma migrations"
Time overrun on builder drag-drop,High,Medium,"Ship manual reorder first, add dnd as enhancement"
Cloudinary setup delays,Low,Low,Use local /uploads fallback initially
Budget aggregation complexity,Medium,Medium,"Pre-calculate on write, cache in trip record"
Responsive breakpoints,Medium,Medium,Use Tailwind sm: prefix throughout from start

5. Definition of Done
Feature works end-to-end (frontend → API → DB)
Mobile-responsive at 375px
No console errors in browser
API returns correct status codes (200/201/400/401/404)
Prisma types match API response shape
Deployed to staging environment and accessible via public URL