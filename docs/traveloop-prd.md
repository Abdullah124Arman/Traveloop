🧳 TRAVELOOP
Product Requirements Document
Version 2.0 — Updated from Mockup
1. Overview
Traveloop is a multi-city travel planning platform. Users create personalized itineraries, track budgets, build packing lists, journal trip notes, generate expense invoices, and share experiences in a community feed.
2. Screen Inventory (14 Screens)

The following table:
#,Screen,Purpose
1,Login,Authenticate returning users
2,Registration,"Create new account with photo, personal details"
3,Main Landing / Dashboard,"Home hub: banner, regional picks, previous trips"
4,Create New Trip,"Start a trip: name, place, dates"
5,Build Itinerary,"Section-based builder: description, date range, budget per stop"
6,User Trip Listing,All trips grouped: Ongoing / Upcoming / Completed
7,User Profile,View/edit profile; access preplanned and previous trips
8,Search (City + Activity),Unified search with filters for cities and activities
9,Itinerary View + Budget,Day-wise view with inline expense tracking
10,Community Tab,Social feed: users share trip experiences and reviews
11,Packing Checklist,Per-trip categorized checklist with packed toggle
12,Admin Panel,Charts + tables for platform analytics (admin only)
13,Trip Notes / Journal,Per-trip/per-stop notes with day and stop filters
14,Expense Invoice / Billing,"Invoice table, payment status, PDF export, budget summary"

3. Functional Requirements
3.1 Login (Screen 1)
Username + password fields
Optional profile photo upload on login screen
Login button → POST /auth/login → JWT → /dashboard
Link to /signup
3.2 Registration (Screen 2)
Photo upload (avatar circle)
Fields: First Name, Last Name, Email, Phone Number, City, Country, Additional Information (textarea)
Register User → POST /auth/signup → /dashboard
3.3 Dashboard / Main Landing (Screen 3)
Hero banner image (full width)
Search bar with Group by / Filter / Sort controls
Top Regional Selections: 5 destination thumbnail cards
Previous Trips: 3 recent trip thumbnails
'Plan a Trip' CTA button → /trips/create
3.4 Create New Trip (Screen 4)
Inputs: Name, Select a Place (city), Start Date, End Date
Suggestion grid: 6 place/activity suggestion cards
Save → POST /trips → redirect to /trips/:id/builder
3.5 Build Itinerary — Section-based (Screen 5)
Each section card represents one stop/segment (hotel, activity block, transit, etc.)
Section fields: description text, date range (xxx to yyy), budget amount
'+ Add another Section' appends a new card
Sections stored as stops with order_index
Top nav search icon → opens search modal
3.6 User Trip Listing (Screen 6)
Search + Group by / Filter / Sort controls
Three status groups: Ongoing, Up-coming, Completed
Each group shows trip cards with short overview text
Tap card → /trips/:id/view
3.7 User Profile (Screen 7)
Large profile image, editable user details (name, email, phone, city, country)
Preplanned Trips section: trip cards with View button
Previous Trips section: trip cards with View button
View → /trips/:id/view
3.8 Unified Search (Screen 8)
Single search endpoint covering both cities and activities
Query param: type=city|activity (or auto-detect)
Results list with Group by / Filter / Sort controls
Each result row: name + meta details (country, cost, category, duration)
Tap row → add to current trip or view detail
3.9 Itinerary View + Budget (Screen 9)
Search + filter controls at top
'Itinerary for a selected place' heading
Day labels (Day 1, Day 2…) as sticky section dividers
Per-day table: Physical Activity column + Expense column
Budget section inline below itinerary (totals, breakdown)
3.10 Community Tab (Screen 10)
Social feed of user-shared trip experiences/reviews
Search + Group by / Filter / Sort to narrow posts
Post card: avatar (left circle) + text content (right)
Users can create posts sharing their trip experiences
GET /community/posts, POST /community/posts
3.11 Packing Checklist (Screen 11)
Add item input with item count indicator
Preset categories: Essentials (Passport, Tickets, Insurance, Hotel confirmation), Travel Shirts (shoes, jacket), Electronics (charger, adapter, headphones)
Checkbox per item → toggle packed state
'Reset all' and 'Save Checklist' bottom actions
3.12 Admin Panel (Screen 12)
Admin-only route (role=ADMIN)
Stats table: Image Name, Promo Notes, Popular Activities, User Trends
Line chart: engagement/trip trends over time
Pie chart: category distribution
Bar chart: volume per category
3.13 Trip Notes / Journal (Screen 13)
'+ Add Note' button top right
Filter tabs: All / by Day / by Stop
Note cards: title + body text + expand/collapse toggle
CRUD: add, edit inline, delete
Scoped to trip or individual stop
3.14 Expense Invoice / Billing (Screen 14)
Breadcrumb: Back to My Trips
Trip header: image, name, location, dates, payment status badge (Pending/Paid)
Budget Summary panel (right): Total Budget, Amount Spent, Remaining, 'Use Full Budget' button
Expense table: #, Category, Description, Qty/Nights, Unit Cost, Amount
Totals: Subtotal, Tax, Grand Total
Bottom actions: Download Invoice, Export as PDF, Mark as Paid
4. Non-Functional Requirements

The following table:
Category,Requirement
Performance,Page load < 2s on 4G; API < 300ms p95
Mobile,"Fully responsive, min 375px wide"
Security,"JWT auth, HTTPS, input sanitization, rate limiting"
Accessibility,WCAG 2.1 AA
Availability,99.5% uptime
PDF Export,Invoice PDF generated server-side (puppeteer or pdfkit)

5. Out of Scope (v1)
Real-time collaborative editing
Flight/hotel booking integration
AI itinerary suggestions
Native iOS/Android app
Live currency conversion