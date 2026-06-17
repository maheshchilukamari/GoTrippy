# GoTrippy - Travel & Vehicle Booking Platform

GoTrippy is a full-stack travel and vehicle booking platform built with React/Vite, Node.js, Express, and MongoDB. I built this project to help local drivers and vehicle owners receive direct booking leads while customers can find airport transfers, temple tours, Hyderabad city rides, outstation trips, and self-drive cars from one platform.

## Project Overview

GoTrippy combines a customer-facing booking website with a partner/driver portal and an admin dashboard concept. Customers can explore ride services, submit booking requests, contact drivers through WhatsApp, and request self-drive cars. Partners can register, list vehicles, manage booking leads, and view their assigned bookings. The backend stores vehicles, bookings, users, pricing, self-drive inventory, contact messages, and booking chat data in MongoDB.

## Why I Built This

I built GoTrippy to solve a real-world problem for small local travel operators and independent drivers. Many local vehicle owners depend on phone calls, WhatsApp messages, and word-of-mouth bookings. I wanted to design a platform where customers can discover services easily and partners can list vehicles, receive leads, and manage trips in a cleaner workflow.

## My Role & Contributions

- Designed and developed the full-stack booking platform.
- Built the React/Vite responsive frontend with reusable UI components.
- Created the booking-focused homepage, service cards, animated hero, chatbot, and partner portal UI.
- Developed Node.js/Express backend APIs for auth, vehicles, bookings, pricing, contacts, chat, and self-drive workflows.
- Integrated MongoDB models with relationships between users, vehicles, bookings, agents, and self-drive cars.
- Implemented customer booking and partner vehicle listing flows.
- Designed the partner/driver portal concept for local vehicle owners.
- Improved chatbot UI and WhatsApp booking support.
- Prepared the project for GitHub portfolio deployment with documentation and GitHub Pages setup.

## Key Features

- Airport transfer booking
- Temple tour booking
- Hyderabad city rides
- Outstation trip option
- Self-drive car rental requests
- Partner/driver registration and login
- Vehicle listing with image upload support
- Partner dashboard concept
- Booking management
- Customer chatbot assistant
- Call Now and Book Now CTAs
- WhatsApp customer-driver contact flow
- Responsive homepage and mobile-friendly layout
- MongoDB-based data storage
- Express API backend
- GitHub Pages-ready frontend deployment setup

## Customer Features

- Browse airport, temple, city, outstation, and self-drive services.
- View available ride listings and vehicle details.
- Submit cab booking requests with pickup, drop, date, time, passenger count, and notes.
- Request self-drive cars with pickup/return dates and document notes.
- Use chatbot quick options for airport pickup, temple tours, city rides, self-drive, and partner login.
- Contact GoTrippy through phone and WhatsApp CTAs.

## Partner / Driver Features

- Register as a partner/driver.
- Login through the partner portal.
- Add vehicle listings with car details, image, seating, luggage, pricing, and driver information.
- Manage own vehicles and pricing.
- View bookings assigned to owned vehicles.
- Receive customer booking details and WhatsApp contact flow.

## Admin / Platform Features

- Super Admin login.
- View and manage all bookings.
- Create and manage partner/admin accounts.
- Add/edit/delete vehicles and pricing packages.
- Manage assigned agents/drivers.
- View contact messages.
- Manage self-drive cars and self-drive booking requests.
- Role-based access control using JWT.

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.io client
- Lucide React icons

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.io
- express-validator
- Helmet, CORS, rate limiting

## Frontend Architecture

The frontend is organized under `client/src` with:

- `pages/` for customer, partner, admin, booking, and service pages.
- `components/` for layout, navbar, footer, chatbot, cards, protected routes, and shared UI.
- `api/` for the Axios HTTP client.
- `context/` for authentication state.
- `data/` for public site data and fallback content.
- `utils/` for formatting and WhatsApp helper functions.

I designed the UI around a booking-first customer journey: service discovery, ride exploration, booking submission, and direct driver contact.

## Backend Architecture

The backend is organized under `server/src` with:

- `routes/` for REST API route definitions.
- `controllers/` for business logic.
- `models/` for MongoDB/Mongoose schemas.
- `middleware/` for authentication, validation, and error handling.
- `config/` for database connection.
- `seed/` for sample data and migration helpers.

The backend separates public routes from protected partner/admin routes. JWT middleware protects sensitive data and ensures agents only manage their own assigned vehicles/bookings.

## Database Design

The project uses MongoDB with Mongoose models for:

- `User`
- `DriverProfile`
- `Agent`
- `Car`
- `Booking`
- `PricingPackage`
- `SelfDriveCar`
- `SelfDriveBooking`
- `ContactMessage`
- `Chat`
- `Message`

Detailed schema documentation is available in [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

## API Overview

The backend includes API groups for:

- Auth
- Accounts
- Agents
- Vehicles
- Bookings
- Chat
- Pricing
- Self-drive cars/bookings
- Contact messages

Detailed API documentation is available in [API_DOCS.md](./API_DOCS.md).

## Authentication Flow

1. Admin or partner submits login credentials.
2. Backend verifies the password using bcrypt.
3. Backend returns a JWT token.
4. Frontend stores the token locally for partner/admin requests.
5. Protected API routes verify the token using authentication middleware.
6. Role middleware restricts Super Admin and Agent permissions.

## Booking Flow

1. Customer selects a service or vehicle.
2. Customer submits pickup, drop, date, time, passenger count, preferred car, and notes.
3. Backend creates a booking record in MongoDB.
4. If a selected vehicle has an owner/agent, the booking is linked to that agent.
5. Customer can notify the agent/driver through WhatsApp.
6. Admin or assigned partner can update booking status.

## Vehicle Listing Flow

1. Partner registers or logs in.
2. Partner adds vehicle details, image, seating, luggage, service type, pricing, and description.
3. Vehicle is linked to the partner account.
4. Approved/active vehicles appear in public listings.
5. Bookings for that vehicle are assigned back to the vehicle owner/agent.

## Chatbot Feature

I added a floating GoTrippy assistant widget for quick guidance. It includes quick options for:

- Airport Pickup
- Temple Tour
- City Ride
- Self Drive Car
- Outstation Trip
- Partner Login
- Talk on WhatsApp

The chatbot UI is frontend-only and helps customers quickly understand the available booking options.

## Responsive UI

The frontend uses Tailwind CSS for responsive layouts. The homepage, service cards, destination cards, chatbot, footer, partner portal section, and booking forms are designed to stack cleanly on mobile and remain polished on desktop.

## Security Considerations

- Passwords are hashed with bcrypt.
- JWT is used for protected routes.
- Role-based middleware separates Super Admin and Agent permissions.
- `.env` files are ignored by Git.
- MongoDB URI, JWT secrets, and private credentials should never be committed.
- Helmet, CORS, rate limiting, and validation middleware are used on the backend.

## Local Setup Instructions

Install all dependencies:

```bash
npm run install:all
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Seed sample data:

```bash
npm run seed
```

Start the complete app:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000/api
```

## Environment Variables

Frontend `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_BASE_PATH=/
VITE_BUSINESS_PHONE=8885863662
VITE_WHATSAPP_NUMBER=918885863662
```

Backend `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/gotrippy
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173

ADMIN_NAME=Mahesh Chilukamari
ADMIN_EMAIL=admin@gotrippy.in
ADMIN_PASSWORD=ChangeMe123!
```

## How to Run Frontend

```bash
cd client
npm install
npm run dev
npm run build
npm run preview
```

If port `5173` is busy:

```bash
npm run dev -- --port 5176 --host 127.0.0.1
```

## How to Run Backend

```bash
cd server
npm install
npm run dev
```

For production:

```bash
npm start
```

## MongoDB Setup

Local MongoDB:

```text
mongodb://127.0.0.1:27017/gotrippy
```

MongoDB Atlas:

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Add network access for the backend host.
4. Copy the connection string.
5. Add it to `server/.env` as `MONGO_URI`.

## GitHub Pages Deployment

Important: GitHub Pages only hosts the static React/Vite frontend. It does not run the Node.js/Express backend.

Deploy only the `client` frontend to GitHub Pages.

Backend deployment should be separate using Render, Railway, Vercel serverless, or another Node.js host.

Frontend production env:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
VITE_BASE_PATH=/gotrippy/
```

If the GitHub repository name is different, update:

```env
VITE_BASE_PATH=/REPOSITORY_NAME/
```

Deploy:

```bash
cd client
npm install
npm run build
npm run deploy
```

The Vite config uses a production base path for GitHub Pages and local `/` base for development.

More deployment details are available in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Screenshots Placeholder

Add screenshots after deployment:

- Home page
- Book Now page
- Ride listing page
- Vehicle details page
- Partner registration page
- Partner dashboard
- Admin dashboard
- Booking confirmation page

## Future Enhancements

- Firebase push notifications for drivers.
- WhatsApp Business API automation.
- SMS booking alerts.
- Cloudinary signed image uploads.
- Online payment integration.
- Driver KYC verification.
- Customer login and booking history.
- Review and rating system.
- Admin revenue and commission reports.

## Resume Project Summary

- Built a full-stack travel booking platform using React, Node.js, Express, and MongoDB with customer booking, vehicle listing, and partner portal workflows.
- Designed responsive booking-focused UI for airport transfers, temple tours, city rides, outstation trips, and self-drive vehicle options.
- Developed backend API documentation, database schema documentation, and deployment workflow for GitHub portfolio presentation.

## Author

**Mahesh Chilukamari**

I built GoTrippy as an end-to-end full-stack portfolio project to demonstrate frontend UI development, backend API design, MongoDB schema modeling, authentication, booking workflows, and deployment preparation.
