🧳 TRAVELOOP
Tech Stack
Architecture & Technology Decisions — v2
1. Stack Overview

The following table:
Layer,Technology,Rationale
Frontend,React 18 + TypeScript,"Component reuse, strong typing"
Styling,Tailwind CSS,"Utility-first, fast responsive layout"
State,Zustand,"Lightweight, no Redux boilerplate"
Routing,React Router v6,"Nested routes, protected route wrapper"
Charts,Recharts,Budget pie/bar + admin line/pie/bar charts
Drag & Drop,dnd-kit,Accessible stop reordering
Backend,Node.js + Express,"Consistent JS stack, fast setup"
ORM,Prisma,"Type-safe queries, migrations"
Database,PostgreSQL,"Relational, JSON support, reliable"
Auth,JWT (jsonwebtoken),"Stateless, simple"
PDF Generation,pdfkit or puppeteer,Invoice export (Screen 14)
File Storage,Cloudinary,"Profile photos, trip covers"
Deployment,Railway (backend + DB) + Vercel (frontend),"Free tier, GitHub CI"

2. Frontend Structure
src/
pages/Login, Register, Dashboard, CreateTrip, Builder, TripList, Profile, Search, ItineraryView, Community, Checklist, Admin, Notes, Invoice
components/  — Nav, TripCard, SectionCard, ActivityRow, CommunityPost, InvoiceTable, BudgetSummary, Charts
hooks/       — useTrips, useSearch, useBudget, useInvoice, useCommunity
store/       — authStore, tripStore, uiStore
services/    — api wrappers per resource
types/       — Trip, Stop, Activity, City, Invoice, CommunityPost, User
3. Key Packages

The following table:
Package,Purpose
react + typescript,UI + type safety
tailwindcss,Styling
react-router-dom v6,Routing
zustand,State management
axios,HTTP client
recharts,All charts (budget + admin)
@dnd-kit/core,Stop section drag reorder
date-fns,Date formatting and manipulation
react-hot-toast,Notifications
pdfkit (server),Invoice PDF generation
bcryptjs,Password hashing
jsonwebtoken,JWT sign/verify
multer,File upload middleware
cloudinary (SDK),Photo uploads
prisma + @prisma/client,ORM

4. API Endpoint Summary

The following table:
Method,Endpoint,Screen
POST,/auth/login,1
POST,/auth/signup,2
GET,/dashboard,3
POST,/trips,4
GET,/trips,6
GET,/trips/:id,9
PATCH,/trips/:id,5
DELETE,/trips/:id,6
POST,/trips/:id/stops,5
PATCH,/stops/:id,5
DELETE,/stops/:id,5
PATCH,/trips/:id/stops/reorder,5
GET,/search?q=&type=city|activity,8
POST,/stops/:id/activities,8
DELETE,/stops/:stopId/activities/:actId,9
GET,/trips/:id/budget,9
GET,/trips/:id/invoice,14
PATCH,/trips/:id/invoice,14
POST,/trips/:id/invoice/export,14
GET,/trips/:id/checklist,11
POST,/trips/:id/checklist,11
PATCH,/checklist/:id,11
DELETE,/checklist/:id,11
GET,/trips/:id/notes,13
POST,/trips/:id/notes,13
PATCH,/notes/:id,13
DELETE,/notes/:id,13
GET,/community/posts,10
POST,/community/posts,10
GET,/users/me,7
PATCH,/users/me,7
GET,/admin/stats,12