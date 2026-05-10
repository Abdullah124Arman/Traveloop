🧳 TRAVELOOP
Backend Database Schema
PostgreSQL via Prisma ORM — v2 (Mockup-aligned)
1. Entity Map
User → Trip → Stop → StopActivity ← Activity
City ← Stop
Trip → Note, ChecklistItem, Invoice, CommunityPost
User → CommunityPost
2. Tables
users

The following table:
Column,Type,Constraints,Notes
id,UUID,"PK, default uuid()",
email,VARCHAR(255),"UNIQUE, NOT NULL",
username,VARCHAR(100),"UNIQUE, NOT NULL",Used on login screen
password_hash,VARCHAR(255),NOT NULL,bcrypt
first_name,VARCHAR(100),NOT NULL,
last_name,VARCHAR(100),NOT NULL,
phone,VARCHAR(30),nullable,
city,VARCHAR(100),nullable,
country,VARCHAR(100),nullable,
additional_info,TEXT,nullable,
photo_url,TEXT,nullable,Cloudinary
role,ENUM,"NOT NULL, default USER",USER | ADMIN
created_at,TIMESTAMP,default now(),
updated_at,TIMESTAMP,auto-update,

trips

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
user_id,UUID,FK → users.id,CASCADE delete
name,VARCHAR(100),NOT NULL,
place,VARCHAR(150),nullable,Primary destination label
start_date,DATE,NOT NULL,
end_date,DATE,NOT NULL,
status,ENUM,"NOT NULL, default UPCOMING",UPCOMING | ONGOING | COMPLETED
cover_photo_url,TEXT,nullable,
total_budget,"DECIMAL(10,2)",nullable,User-set cap
payment_status,ENUM,default PENDING,PENDING | PAID | PARTIAL
created_at,TIMESTAMP,default now(),
updated_at,TIMESTAMP,auto-update,

cities

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
name,VARCHAR(100),NOT NULL,
country,VARCHAR(100),NOT NULL,
region,VARCHAR(100),nullable,Continent/area
cost_index,"DECIMAL(4,2)",nullable,1–10
popularity_score,"DECIMAL(4,2)",nullable,1–5
image_url,TEXT,nullable,
lat,"DECIMAL(9,6)",nullable,
lng,"DECIMAL(9,6)",nullable,

stops  (itinerary sections)

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
trip_id,UUID,FK → trips.id,CASCADE delete
city_id,UUID,"FK → cities.id, nullable",nullable if free-text section
description,TEXT,nullable,Section description text
start_date,DATE,NOT NULL,
end_date,DATE,NOT NULL,
section_budget,"DECIMAL(10,2)",nullable,Per-section budget
order_index,INTEGER,"NOT NULL, default 0",Sort order

activities

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
city_id,UUID,"FK → cities.id, nullable",null = global
name,VARCHAR(150),NOT NULL,
description,TEXT,nullable,
type,ENUM,NOT NULL,SIGHTSEEING|FOOD|ADVENTURE|CULTURE|WELLNESS
cost,"DECIMAL(10,2)",default 0,Per person USD
duration_minutes,INTEGER,nullable,
image_url,TEXT,nullable,

stop_activities

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
stop_id,UUID,FK → stops.id,CASCADE delete
activity_id,UUID,FK → activities.id,
scheduled_time,TIME,nullable,
custom_cost,"DECIMAL(10,2)",nullable,Override activity.cost
notes,TEXT,nullable,
order_index,INTEGER,default 0,

checklist_items

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
trip_id,UUID,FK → trips.id,CASCADE delete
name,VARCHAR(200),NOT NULL,
category,ENUM,NOT NULL,ESSENTIALS|CLOTHING|ELECTRONICS|MISC
is_packed,BOOLEAN,default false,
created_at,TIMESTAMP,default now(),

trip_notes

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
trip_id,UUID,FK → trips.id,CASCADE delete
stop_id,UUID,"FK → stops.id, nullable",null = trip-level
title,VARCHAR(200),nullable,
content,TEXT,NOT NULL,
day_number,INTEGER,nullable,For 'by Day' filter
created_at,TIMESTAMP,default now(),
updated_at,TIMESTAMP,auto-update,

invoices

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
trip_id,UUID,"FK → trips.id, UNIQUE",One invoice per trip
subtotal,"DECIMAL(10,2)",NOT NULL,
tax,"DECIMAL(10,2)",default 0,
grand_total,"DECIMAL(10,2)",NOT NULL,
payment_status,ENUM,default PENDING,PENDING|PAID|PARTIAL
pdf_url,TEXT,nullable,Generated PDF link
created_at,TIMESTAMP,default now(),
updated_at,TIMESTAMP,auto-update,

invoice_items

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
invoice_id,UUID,FK → invoices.id,CASCADE delete
category,VARCHAR(100),NOT NULL,"e.g. Hotel, Flight"
description,TEXT,NOT NULL,
quantity,INTEGER,default 1,Nights or count
unit_cost,"DECIMAL(10,2)",NOT NULL,
amount,"DECIMAL(10,2)",NOT NULL,qty × unit_cost
order_index,INTEGER,default 0,

community_posts

The following table:
Column,Type,Constraints,Notes
id,UUID,PK,
user_id,UUID,FK → users.id,
trip_id,UUID,"FK → trips.id, nullable",Optional trip reference
content,TEXT,NOT NULL,
created_at,TIMESTAMP,default now(),
updated_at,TIMESTAMP,auto-update,

3. Indexes

The following table:
Table,Index Columns,Reason
trips,"user_id, status",Filter by user + status (Ongoing/Upcoming/Completed)
stops,"trip_id, order_index",Ordered sections per trip
stop_activities,stop_id,Activities per stop
cities,"name, country",Search queries
activities,"type, cost",Filtered activity search
trip_notes,"trip_id, stop_id, day_number",Filter by All / Day / Stop
invoice_items,"invoice_id, order_index",Invoice line items
community_posts,created_at DESC,Feed ordering