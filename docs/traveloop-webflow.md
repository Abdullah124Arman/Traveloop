🧳 TRAVELOOP
Web Flow & Screen Architecture
Based on Mockup — 14 Screens
1. Screen Index

The following table:
#,Screen Name,Route,Auth
1,Login Screen,/login,Public
2,Registration Screen,/signup,Public
3,Main Landing Page (Dashboard),/dashboard,Required
4,Create a New Trip,/trips/create,Required
5,Build Itinerary Screen,/trips/:id/builder,Required
6,User Trip Listing,/trips,Required
7,User Profile Page,/profile,Required
8,Activity Search / City Search,/search,Required
9,Itinerary View with Budget Section,/trips/:id/view,Required
10,Community Tab,/community,Required
11,Packing Checklist,/trips/:id/checklist,Required
12,Admin Panel,/admin,Admin only
13,Trip Notes / Journal,/trips/:id/notes,Required
14,Expense Invoice / Billing,/trips/:id/invoice,Required

2. Navigation Flow
Unauthenticated:
/login → on success → /dashboard
/signup → on success → /dashboard

Authenticated (persistent top nav: Traveloop logo + search icon):
/dashboard → /trips/create, /trips, /search, /community, /profile
/trips/create → /trips/:id/builder (after save)
/trips/:id/builder → /search (city/activity modal), back to /trips
/trips → /trips/:id/view, /trips/:id/builder, /trips/:id/checklist, /trips/:id/notes, /trips/:id/invoice
/trips/:id/view → /trips/:id/builder (edit), /trips/:id/invoice
/profile → /trips (preplanned/previous trip cards with View buttons)
/admin → standalone, no nav back to user flows

3. Screen Specifications

Screen 1 — Login

The following table:
Element,Detail
Photo/Avatar upload,Optional profile photo circle at top
Username field,Text input
Password field,Password input with show/hide
Login Button,POST /auth/login → JWT → redirect /dashboard
Link to Register,Navigates to /signup

Screen 2 — Registration

The following table:
Element,Detail
Photo upload circle,Optional avatar at top center
First Name + Last Name,Side-by-side inputs
Email Address + Phone Number,Side-by-side inputs
City + Country,Side-by-side inputs
Additional Information,"Textarea, optional"
Register User button,POST /auth/signup → redirect /dashboard

Screen 3 — Main Landing Page (Dashboard)

The following table:
Element,Detail
Top nav,Traveloop logo + search icon (right)
Banner Image,"Hero banner, full width"
Search bar,Search for destinations/activities
Group by / Filter / Sort controls,Horizontal row below search
Top Regional Selections,Row of 5 small destination cards/thumbnails
Previous Trips,Row of 3 trip card thumbnails
Plan a Trip button,Fixed CTA bottom → /trips/create

Screen 4 — Create a New Trip

The following table:
Element,Detail
Plan a new trip header,Section title
Name field,Trip name text input
Select a Place,City selector/search
Start Date,Date picker
End Date,"Date picker, must be after start"
Suggestion grid (2x3),6 place/activity suggestion cards below form
Save / Continue,POST /trips → redirect /trips/:id/builder

Screen 5 — Build Itinerary Screen

The following table:
Element,Detail
Section 1 / 2 / 3 cards,Each section = one stop/segment of the trip
Section description,"Text describing the stop (hotel, activity, transit, etc.)"
Date Range (xxx to yyy),Per-section date range picker
Budget of this section,Per-section budget input
+ Add another Section button,Appends a new section card → POST /stops
Top nav search icon,Access city/activity search mid-build

Screen 6 — User Trip Listing

The following table:
Element,Detail
Search bar + Group by / Filter / Sort,Top controls
Ongoing section,Cards for currently active trips
Up-coming section,Cards for future trips
Completed section,Cards for past trips
Trip card,Short overview text of the trip; tap → /trips/:id/view

Screen 7 — User Profile Page

The following table:
Element,Detail
User image (large),"Profile photo, editable"
User Details text,"Name, email, phone, city, country — editable fields"
Preplanned Trips,Row of trip cards with View button each
Previous Trips,Row of trip cards with View button each
View button,Navigates to /trips/:id/view

Screen 8 — Activity Search / City Search

The following table:
Element,Detail
Search bar (top),Live query → GET /cities?q= or GET /activities?q=
Group by / Filter / Sort controls,Horizontal filter row
Results list,"7+ result rows, each = 'Option and its details'"
Result row,"Name, meta info (cost, country, type, duration)"
Tap result,"Add to current trip stop, or navigate to detail"

Screen 9 — Itinerary View with Budget Section

The following table:
Element,Detail
Search + Group by / Filter / Sort,Top controls
Itinerary for a selected place,Section heading
Day 1 / Day 2 labels,"Day dividers, sticky on scroll"
Physical Activity column,Activity name per row
Expense column,Cost per activity row
Row entries per day,3 rows shown per day in mockup
Budget section,"Inline below itinerary — totals, breakdown"

Screen 10 — Community Tab

The following table:
Element,Detail
Search + Group by / Filter / Sort,Top controls
Community Tab heading,Section header
Community posts list,4 large post cards visible
Post card,Avatar circle (left) + content block (right)
Post content,User's shared trip experience or review
Sidebar note (mockup),Users can share trip experiences; search/group/filter narrows results

Screen 11 — Packing Checklist

The following table:
Element,Detail
Search + Group by / Filter / Sort,Top controls
Add item input,Text field at top with $ counter (item count)
Category: Essentials,"Passport, Flight Tickets (printed), Travel Insurance, Hotel booking confirmation"
Category: Travel Shirts,"Comfortable walking shoes, Light jacket / windbreaker"
Category: Electronics,"Laptop charger, Universal power adapter, Headphones / Earplugs"
Checkbox per item,Toggle packed state
I still have to install button,Action / link CTA
Reset all / Save Checklist buttons,Bottom action row

Screen 12 — Admin Panel

The following table:
Element,Detail
Search + Group by / Filter / Sort,Top controls
Stats table (top),"Columns: Image Name, Promo notes, Popular activities, User trends add-ons"
Line chart,Trend data over time (engagement/trips)
Pie chart (green),Category distribution
Bar chart (orange),Volume metric per category
Admin-only route,Accessible only to role=ADMIN users

Screen 13 — Trip Notes / Journal

The following table:
Element,Detail
Search + Group by / Filter / Sort,Top controls
+ Add Note button,Top right → opens note input
Filter tabs: All / by Day / by Stop,Scope note view
Note cards,Title + body text + toggle (top right per card)
Example notes,Hotel check-in details — Home stop (with sub-detail text)
Note actions,"Edit inline, delete via toggle"

Screen 14 — Expense Invoice / Billing Screen

The following table:
Element,Detail
Back to My Trips link,Top left breadcrumb
Trip header card,Trip image + name (Trip to Europe/Adventure) + location + dates
Finance Details,"Payment status (Pending), Expense breakdown labels"
Budget Summary (right),"Total Budget, Amount Spent, Remaining — with 'Use Full Budget' button"
Expense table,"Columns: #, Category, Description, Qty/Nights, Unit Cost, Amount"
Example rows,"Hotel booking (4 nights), Flight booking (Ibis + PAN)"
Totals row,"Subtotal, Tax, Grand Total"
Bottom actions,"Download Invoice, Export as PDF, Mark as paid"

4. Updated API Endpoints (from mockup)

The following table:
Resource,Method,Endpoint,Screen
Auth,POST,/auth/login,1
Auth,POST,/auth/signup,2
Dashboard,GET,/dashboard,3
Trips,POST,/trips,4
Trips,GET,/trips,6
Trips,GET,/trips/:id,9
Trips,PATCH,/trips/:id,5
Trips,DELETE,/trips/:id,6
Stops,POST,/trips/:id/stops,5
Stops,PATCH,/stops/:id,5
Stops,DELETE,/stops/:id,5
Search,GET,/search?q=&type=city|activity,8
Activities,POST,/stops/:id/activities,8
Budget,GET,/trips/:id/budget,9
Invoice,GET,/trips/:id/invoice,14
Invoice,POST,/trips/:id/invoice/export,14
Checklist,GET,/trips/:id/checklist,11
Checklist,POST,/trips/:id/checklist,11
Checklist,PATCH,/checklist/:id,11
Notes,GET,/trips/:id/notes,13
Notes,POST,/trips/:id/notes,13
Notes,PATCH,/notes/:id,13
Notes,DELETE,/notes/:id,13
Community,GET,/community/posts,10
Community,POST,/community/posts,10
Profile,GET,/users/me,7
Profile,PATCH,/users/me,7
Admin,GET,/admin/stats,12

5. Changes from v1 Webflow

The following table:
Change,Detail
Screen 2 is Registration (not Forgot Password),"Has First/Last Name, Phone, City, Country, Additional Info fields + photo upload"
Screen 3 renamed Main Landing Page,"Includes banner image, regional selections, previous trips — not just recent trips list"
Screen 5 is Itinerary Builder (Section-based),"Sections have description + date range + budget per section, not just stop cards"
Screen 7 is User Profile (not Settings),Shows preplanned + previous trips with View buttons directly on profile
Screen 8 is unified Search,Single search screen for both city and activity search
Screen 9 has inline Budget,"Budget section embedded in itinerary view, not a separate screen"
Screen 10 is Community Tab (new),Not in v1 — social feed where users share trip experiences
Screen 14 is Invoice/Billing (new),"Expense invoice with table, totals, payment status, PDF export — replaces abstract budget screen"
No separate Share screen,Sharing implied via community tab and invoice export
Admin is Screen 12 (confirmed required),"Has stats table + 3 chart types (line, pie, bar)"
