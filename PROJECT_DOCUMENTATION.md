# GoTrippy Project Documentation

## Project Summary

GoTrippy is a full-stack MERN travel booking platform built as a production-style portfolio project. The platform allows customers to discover and book cars for airport transfers, temple tours, Hyderabad city rides, outstation trips, and self-drive rentals. It also includes a partner/driver portal where vehicle owners can register, list vehicles, and receive booking leads.

The project was designed to represent a real-world local travel marketplace where customers, drivers, vehicle owners, and administrators interact through one platform.

## Live Deployment

Frontend:

```text
https://maheshchilukamari.github.io/GoTrippy/
```

Backend API:

```text
https://gotrippy.onrender.com
```

Health Check:

```text
https://gotrippy.onrender.com/api/health
```

Repository:

```text
https://github.com/maheshchilukamari/GoTrippy
```

## Technology Stack

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
- JWT authentication
- bcryptjs password hashing
- Socket.io
- Helmet
- CORS
- Express rate limiting

Deployment:

- GitHub for source control
- GitHub Pages for frontend hosting
- Render for backend hosting
- MongoDB Atlas for cloud database hosting

## System Architecture

GoTrippy is deployed as three separate services:

```text
GitHub Pages Frontend
        |
        | API requests
        v
Render Node/Express Backend
        |
        | MongoDB connection
        v
MongoDB Atlas Database
```

GitHub Pages only serves static frontend files. It cannot run Node.js, Express, or MongoDB. Because of this, the backend is deployed separately on Render, and the frontend uses an environment variable to call the Render API.

## Main Features

Customer-facing features:

- Modern GoTrippy landing page
- Airport transfer booking
- Temple tour booking
- Hyderabad city ride booking
- Outstation trip booking
- Self-drive car request flow
- Vehicle listing display
- WhatsApp contact support
- Floating chatbot assistant
- Responsive mobile-friendly UI

Partner/driver features:

- Partner login
- Partner registration
- Vehicle listing form
- Vehicle image upload support
- Vehicle details and pricing fields
- Assigned owner/driver connection
- Partner dashboard concept

Admin/platform features:

- Super Admin login
- JWT-based authentication
- Role-based access control
- Booking management
- Vehicle management
- Pricing management
- Agent/partner account support
- Contact message handling

## Database Models

The backend uses MongoDB with Mongoose models for:

- User
- DriverProfile
- Agent
- Car
- Booking
- PricingPackage
- SelfDriveCar
- SelfDriveBooking
- ContactMessage
- Chat
- Message

Detailed schema notes are available in `DATABASE_SCHEMA.md`.

## API Structure

The backend exposes REST API routes under `/api`.

Main route groups:

- `/api/health`
- `/api/auth`
- `/api/accounts`
- `/api/agents`
- `/api/cars`
- `/api/bookings`
- `/api/chats`
- `/api/pricing`
- `/api/self-drive`
- `/api/contact`

Detailed API notes are available in `API_DOCS.md`.

## Deployment Process

### 1. GitHub Repository

The project was pushed to GitHub:

```text
https://github.com/maheshchilukamari/GoTrippy
```

GitHub stores the complete project source code.

### 2. Frontend Deployment on GitHub Pages

The frontend is located inside:

```text
client/
```

GitHub Pages deploys the Vite production build from the `dist` folder using the `gh-pages` package.

Important frontend production settings:

```env
VITE_API_BASE_URL=https://gotrippy.onrender.com/api
VITE_SOCKET_URL=https://gotrippy.onrender.com
VITE_BASE_PATH=/GoTrippy/
```

Deploy command:

```bash
cd client
npm run deploy
```

The `VITE_BASE_PATH=/GoTrippy/` setting is important because the GitHub Pages site is hosted under the repository path.

### 3. Backend Deployment on Render

The backend is located inside:

```text
server/
```

Render deployment settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

The backend runs at:

```text
https://gotrippy.onrender.com
```

Render environment variables include:

```env
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<secure JWT secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://maheshchilukamari.github.io
ADMIN_NAME=<admin name>
ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD=<admin password>
```

Secrets are stored in Render environment variables and are not committed to GitHub.

### 4. Database Deployment on MongoDB Atlas

MongoDB Atlas is used as the production database.

Steps completed:

1. Created a MongoDB Atlas cluster.
2. Created a database user.
3. Added the Atlas connection string to Render as `MONGO_URI`.
4. Allowed Render to connect through Atlas Network Access.
5. Verified the backend using `/api/health`.

## Problems Faced and Fixes

### Problem 1: GitHub Pages Blank Screen

Cause:

The Vite base path did not match the GitHub repository name.

Fix:

Updated Vite production base path:

```js
base: "/GoTrippy/"
```

### Problem 2: Frontend API Requests Failed

Cause:

The GitHub Pages frontend was trying to call API routes without a live backend.

Fix:

Deployed the backend to Render and configured the frontend with:

```env
VITE_API_BASE_URL=https://gotrippy.onrender.com/api
```

### Problem 3: Render Backend Failed with Missing MongoDB URI

Cause:

Render did not have the required backend environment variable.

Fix:

Added:

```env
MONGO_URI=<MongoDB Atlas connection string>
```

### Problem 4: MongoDB Atlas Blocked Render

Cause:

Render's IP address was not allowed in MongoDB Atlas Network Access.

Fix:

Added network access in Atlas:

```text
0.0.0.0/0
```

### Problem 5: Empty Production Database Had No Admin User

Cause:

MongoDB Atlas started empty, so the admin login did not exist.

Fix:

Added a safe startup helper in the backend. When the server starts, it checks whether the first Super Admin exists. If not, it creates the admin using Render environment variables.

## Authentication Flow

1. Admin or partner submits login credentials.
2. Backend finds the user by email.
3. Password is compared using bcrypt.
4. Backend returns a JWT token.
5. Frontend stores the token.
6. Protected API routes verify the token.
7. Role-based middleware controls access for Super Admin and Agent users.

## Booking Flow

1. Customer visits the GoTrippy frontend.
2. Customer chooses a service or vehicle.
3. Customer submits booking details.
4. Frontend sends the request to Render backend.
5. Backend stores the booking in MongoDB Atlas.
6. Booking is linked to the selected vehicle and owner/agent where applicable.
7. Customer can contact the driver or owner through WhatsApp.

## Vehicle Listing Flow

1. Partner registers or logs in.
2. Partner adds vehicle and driver/owner details.
3. Vehicle information is stored in MongoDB.
4. Public listing pages show active vehicles.
5. Bookings can be connected back to the vehicle owner.

## Local Development

Install dependencies:

```bash
npm run install:all
```

Start both frontend and backend:

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

## Environment Variable Notes

Local frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_BASE_PATH=/
```

Production frontend:

```env
VITE_API_BASE_URL=https://gotrippy.onrender.com/api
VITE_SOCKET_URL=https://gotrippy.onrender.com
VITE_BASE_PATH=/GoTrippy/
```

Backend:

```env
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<frontend origin>
```

## Security Notes

- `.env` files are ignored by Git.
- MongoDB connection strings should never be committed.
- JWT secrets should never be committed.
- Passwords are hashed before storage.
- Render environment variables store production secrets.
- MongoDB Atlas should use a strong database password.
- Admin passwords should be changed after first deployment.

## What I Learned

This project helped me understand:

- How a MERN application is split between frontend, backend, and database.
- Why GitHub Pages can only host the frontend.
- How Render hosts a Node.js backend.
- How MongoDB Atlas provides a cloud database.
- How environment variables connect services securely.
- How CORS affects frontend-backend communication.
- How deployment errors can be diagnosed through logs.
- How to use GitHub, Render, and MongoDB Atlas together for a real full-stack deployment.

## Final Production Flow

```text
User opens GoTrippy on GitHub Pages
        |
        v
React frontend loads
        |
        v
Frontend calls https://gotrippy.onrender.com/api
        |
        v
Express backend handles the request
        |
        v
MongoDB Atlas stores or returns data
        |
        v
Frontend shows the result to the user
```

## Future Improvements

- Change initial admin password after deployment.
- Add real payment gateway support.
- Add WhatsApp Business API automation.
- Add driver verification and KYC flow.
- Add production image storage using Cloudinary or S3.
- Add customer accounts and booking history.
- Add ratings and reviews.
- Add automated email/SMS notifications.
- Add analytics reports for partners and admins.

