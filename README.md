## Eventino Backend

This is the Node.js + Express backend for Eventino, the event management platform. It handles authentication, event creation, user registration, and attendee tracking, using PostgreSQL as the database.

## Features

-- JWT-based authentication via HTTP-only cookies

-- Staff-only event creation & management

-- Attendee registration & capacity tracking

-- Image & ticket data handled as JSON arrays

-- Event "full" status handling

## Tech Stack

Node.js / Express

PostgreSQL

bcrypt for password hashing

jsonwebtoken for secure auth

cors, cookie-parser, and pg (node-postgres)

## Installation

git clone https://github.com/AnastasiaKaldi/Events-Backend.git
cd eventino-backend
npm install

## Environment Setup

Please ask me directly at kaldianastasia@gmail.com, for security purposes.

## Running Locally

npm run dev

Your server will start on http://localhost:5050

## Database Setup

--Tables are defined in schema.sql and include:

-users: for staff and regular users

-events: contains event details and status

-event_attendees: joins users and events

--Seed sample users with seed.sql:

INSERT INTO users (...) VALUES (...);

## Project Structure

controllers/
├── authController.js # Handles login and registration logic
├── eventController.js # Handles creating, updating, deleting, and joining events

middleware/
├── authMiddleware.js # Extracts user info from JWT stored in HTTP-only cookies
├── requireAuth.js # Middleware to protect routes (ensures user is authenticated)

models/
├── db.js # Sets up and exports the PostgreSQL pool using 'pg'

router/
├── authRoutes.js # Defines routes for login and registration
├── eventRoutes.js # Defines routes for event-related operations

app.js # Sets up the Express app, applies middleware, mounts routes
connection.js # Helper for setting up and testing raw DB connections
generate-hash.js # CLI utility to hash passwords using bcrypt
schema.sql # SQL schema: defines tables for users, events, attendees
seed.sql # Seeds initial data (staff + user accounts for testing)

## User Roles

user: can join events

staff: can create, update, and delete events

Role is stored in the users table and enforced via middleware.

## Feedback

Please feel free to submit pull requests or open issues. For questions, contact kaldianastasia@gmail.com
