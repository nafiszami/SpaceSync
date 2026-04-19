# SpaceSync — Resource Allocation System
> Jahangirnagar University | Full-Stack Web Application

A modernized dashboard for booking departmental resources: computer labs, seminar rooms, libraries, and multimedia equipment.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js + Express.js                |
| ORM       | Sequelize                           |
| Database  | MySQL                               |
| Frontend  | React + Vite                        |
| Styling   | Tailwind CSS                        |
| Routing   | React Router v6                     |

---

## Project Structure

```
spacesync/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Sequelize MySQL connection
│   │   ├── models/
│   │   │   ├── Resource.js        # Resource model (PK, name, type, capacity)
│   │   │   └── Booking.js         # Booking model (FK, requested_by, date, status)
│   │   ├── routes/
│   │   │   ├── resources.js       # GET + POST /api/resources
│   │   │   └── bookings.js        # GET + POST + DELETE /api/bookings
│   │   └── index.js               # Express server entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation bar
    │   │   └── BookingModal.jsx    # Booking form modal
    │   ├── pages/
    │   │   ├── ResourcesDashboard.jsx  # Section 7.3.1
    │   │   └── ScheduleViewer.jsx      # Section 7.3.3
    │   ├── api.js                  # Axios API calls
    │   ├── App.jsx                 # SPA routing
    │   ├── main.jsx
    │   └── index.css               # Tailwind + custom styles
    ├── vite.config.js
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL running locally

### 1. MySQL — Create Database

```sql
CREATE DATABASE spacesync;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env: set DB_USER, DB_PASSWORD, DB_NAME=spacesync

# Start the server
npm start
```

The server will:
- Connect to MySQL
- Auto-create `resources` and `bookings` tables (Sequelize sync)
- Seed 6 initial resources automatically
- Run on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open: http://localhost:5173

---

## API Endpoints

| Method | Endpoint             | Description                                      |
|--------|----------------------|--------------------------------------------------|
| GET    | /api/resources       | Fetch all available resources                    |
| POST   | /api/resources       | Create a new resource                            |
| GET    | /api/bookings        | Fetch all bookings (with Resource via JOIN)      |
| POST   | /api/bookings        | Create a new booking (resource-level booking lock) |
| DELETE | /api/bookings/:id    | Cancel/delete a booking by ID                    |

### POST /api/resources — Body
```json
{
  "name": "Computer Lab C",
  "type": "Room",
  "capacity": 35
}
```

### POST /api/bookings — Body
```json
{
  "resource_id": 1,
  "requested_by": "Dr. Ali",
  "booking_date": "2025-08-15"
}
```

---

## Features Implemented

### Backend
- [x] RESTful API with Express.js
- [x] Sequelize ORM with MySQL
- [x] One-to-Many relationship (Resource → Bookings)
- [x] Eager loading (JOIN) in GET /api/bookings
- [x] Auto-seed 6 initial resources on first run
- [x] **Booking lock rule**: Once a resource is booked, future booking requests for that same resource are rejected until that booking is canceled

### Frontend
- [x] Single-Page Application with React Router
- [x] Resource Dashboard — card grid with Book Now button
- [x] Booking Modal — form with loading indicator and success/error messages
- [x] Schedule Viewer — table with booking stats and Cancel button
- [x] Filter/search bookings by name or resource
- [x] No page refresh on cancel (UI updates instantly)
- [x] Tailwind CSS styling with dark theme

---

## Team Ownership And Push Plan

For teammate-wise file ownership, push sequence, and GitHub workflow, see:

- [TEAM_PUSH_PLAN.md](TEAM_PUSH_PLAN.md)

---

## Database Schema

### `resources` table
| Column    | Type    | Notes      |
|-----------|---------|------------|
| id        | INT     | PK, Auto   |
| name      | VARCHAR | e.g. "Networking Lab" |
| type      | VARCHAR | "Room" or "Equipment" |
| capacity  | INT     |            |

### `bookings` table
| Column       | Type    | Notes            |
|--------------|---------|------------------|
| id           | INT     | PK, Auto         |
| resource_id  | INT     | FK → resources   |
| requested_by | VARCHAR | e.g. "Dr. Ali"   |
| booking_date | DATE    |                  |
| status       | VARCHAR | Default: "Confirmed" |

---

## Postman Seeding (as required)

After starting the backend, open Postman and POST to create resources:

```
POST http://localhost:5000/api/resources
Content-Type: application/json

{ "name": "Lab X", "type": "Room", "capacity": 25 }
```

*(The server auto-seeds 6 resources on first run, so this is optional.)*
