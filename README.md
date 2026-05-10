# Traveloop

Traveloop is a comprehensive web application designed for managing travel invoices, bookings, and providing a seamless travel experience.

## Overview

This project is structured as a monorepo and contains the following main components:
- **Web App**: The frontend user interface built with Next.js/React.
- **API**: The backend service handling data processing and database interactions.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (managed via Supabase)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdullah124Arman/Traveloop.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Traveloop
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in the respective application directories (e.g., `apps/web`, `apps/api`).
   - Fill in the required configuration values (database connection string, Supabase keys, etc.).

5. Start the development server:
   ```bash
   npm run dev
   ```

## Documentation

For more detailed architectural choices, database schema, and API documentation, please refer to the `docs/` directory.