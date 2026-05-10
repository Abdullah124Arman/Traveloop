# 🧳 Traveloop

Traveloop is a modern, multi-city travel planning platform designed to help users create personalized itineraries, track budgets, build packing lists, journal trip notes, and generate expense invoices. It also features a community feed for sharing travel experiences.

## 🚀 Features

- **Multi-City Itinerary Builder**: Section-based builder with drag-and-drop stop reordering.
- **Budget Tracking**: Inline expense tracking with day-wise budget summaries and charts.
- **Packing Checklist**: Categorized checklists with per-trip items and "packed" toggles.
- **Trip Journaling**: Per-trip and per-stop notes with filtering capabilities.
- **Expense Invoices**: Generate professional invoices with PDF export functionality.
- **Community Feed**: Share trip experiences and reviews with other travelers.
- **Admin Dashboard**: Comprehensive analytics and usage trends for platform administrators.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit

### Backend
- **Runtime**: Node.js + Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Stateless)
- **File Storage**: Cloudinary (for photos and trip covers)
- **PDF Generation**: pdfkit / Puppeteer

## 📂 Project Structure

This project is a monorepo using **npm workspaces**:

```text
traveloop/
├── apps/
│   ├── web/          # React frontend application
│   └── api/          # Express backend API
├── packages/         # Shared configurations or libraries
├── docs/             # Product and technical documentation
└── package.json      # Root package.json with workspace definitions
```

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Cloudinary account (for file storage)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Abdullah124Arman/Traveloop.git
   cd Traveloop
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
You can run the web and api applications simultaneously or individually:

- **Run both**:
  ```bash
  npm run dev --workspaces
  ```
- **Run Web only**:
  ```bash
  npm run dev:web
  ```
- **Run API only**:
  ```bash
  npm run dev:api
  ```

## 📄 Documentation
Detailed documentation is available in the `docs/` directory:
- [Product Requirements Document (PRD)](docs/traveloop-prd.md)
- [Tech Stack & Architecture](docs/traveloop-techstack.md)
- [Implementation Plan](docs/traveloop-implementation-plan.md)
- [Database Schema](docs/traveloop-schema.md)

## ⚖️ License
This project is licensed under the MIT License.