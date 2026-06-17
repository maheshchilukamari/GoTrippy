# GoTrippy API Documentation

Base URL:

```text
http://localhost:5000/api
```

Production frontend deployments should set:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

Authenticated routes require:

```http
Authorization: Bearer <jwt_token>
```

## Health

### GET `/health`

Checks whether the API is running.

Response:

```json
{
  "status": "ok",
  "service": "GoTrippy API"
}
```

## Auth Routes

### POST `/auth/login`

Logs in a Super Admin or Agent.

Request:

```json
{
  "email": "admin@gotrippy.in",
  "password": "ChangeMe123!"
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Mahesh Chilukamari",
    "email": "admin@gotrippy.in",
    "phone": "8885863662",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE"
  }
}
```

### POST `/auth/register-driver`

Registers a new partner/driver account.

Request:

```json
{
  "name": "Mahesh",
  "email": "mahesh@example.com",
  "phone": "8885863662",
  "whatsappNumber": "918885863662",
  "city": "Hyderabad",
  "password": "Password123!",
  "profilePhoto": "data:image/png;base64,..."
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Mahesh",
    "email": "mahesh@example.com",
    "phone": "8885863662",
    "whatsappNumber": "918885863662",
    "city": "Hyderabad",
    "role": "AGENT",
    "status": "ACTIVE"
  }
}
```

### GET `/auth/me`

Returns the authenticated user profile.

Auth: required.

Response:

```json
{
  "user": {
    "_id": "user_id",
    "name": "Mahesh",
    "email": "mahesh@example.com",
    "role": "AGENT",
    "status": "ACTIVE"
  }
}
```

## Account Routes

### GET `/accounts/me`

Returns the logged-in account profile.

Auth: Super Admin or Agent.

### GET `/accounts`

Lists all partner/admin accounts.

Auth: Super Admin only.

### POST `/accounts`

Creates a Super Admin or Agent account.

Auth: Super Admin only.

Request:

```json
{
  "name": "Partner Name",
  "email": "partner@example.com",
  "phone": "8885863662",
  "role": "AGENT",
  "status": "ACTIVE",
  "password": "Password123!"
}
```

### PUT `/accounts/:id`

Updates an account.

Auth: Super Admin only.

Request:

```json
{
  "name": "Updated Partner",
  "email": "partner@example.com",
  "phone": "8885863662",
  "role": "AGENT",
  "status": "ACTIVE"
}
```

## Agent Routes

### GET `/agents`

Lists assigned driver/agent profiles.

Auth: Super Admin only.

### GET `/agents/reports`

Returns agent report data.

Auth: Super Admin only.

### POST `/agents`

Creates an assigned driver/agent profile.

Auth: Super Admin only.

Request:

```json
{
  "fullName": "Driver Name",
  "mobileNumber": "8885863662",
  "whatsappNumber": "918885863662",
  "alternateNumber": "",
  "licenseNumber": "TS123456789",
  "status": "Active",
  "profilePhoto": "data:image/png;base64,..."
}
```

### PUT `/agents/:id`

Updates an assigned driver/agent profile.

Auth: Super Admin only.

### DELETE `/agents/:id`

Deletes an assigned driver/agent profile.

Auth: Super Admin only.

## Vehicle Routes

### GET `/cars`

Returns public vehicle listings. If authenticated, admin/agent scoped data can also be included by controller logic.

### GET `/cars/:id`

Returns one vehicle by ID.

### POST `/cars`

Creates a vehicle listing.

Auth: Super Admin or Agent.

Request:

```json
{
  "name": "Toyota Innova",
  "slug": "toyota-innova",
  "registrationNumber": "TS02EW9999",
  "imageUrl": "data:image/jpeg;base64,...",
  "fuelType": "Diesel",
  "transmission": "Manual",
  "acType": "AC",
  "vehicleCategory": "MPV",
  "serviceType": "With Driver",
  "assignedAgent": "agent_id",
  "seatingCapacity": "6-7",
  "luggageCapacity": "2 bags",
  "priceEstimate": "Contact driver for price",
  "description": "Clean family vehicle for airport, temple, and outstation rides."
}
```

### PUT `/cars/:id`

Updates a vehicle listing.

Auth: Super Admin or owning Agent.

### DELETE `/cars/:id`

Deletes a vehicle listing.

Auth: Super Admin or owning Agent.

## Booking Routes

### POST `/bookings`

Creates a customer cab booking request.

Request:

```json
{
  "customerName": "Ravi Kumar",
  "phoneNumber": "9876543210",
  "pickupLocation": "Hyderabad Airport",
  "dropLocation": "Yadadri Temple",
  "tripType": "Temple Trip",
  "travelDate": "2026-08-20",
  "travelTime": "06:30 AM",
  "passengers": 4,
  "selectedVehicleId": "vehicle_id",
  "preferredCarName": "Toyota Innova",
  "additionalNotes": "Need early pickup."
}
```

Response:

```json
{
  "message": "Booking request submitted successfully",
  "booking": {
    "_id": "booking_id",
    "customerName": "Ravi Kumar",
    "status": "Pending",
    "agentId": "owner_agent_user_id"
  }
}
```

### GET `/bookings`

Lists bookings.

Auth: Super Admin sees all bookings. Agent sees only bookings assigned to that agent.

Supported filters include `status`, `tripType`, `car`, `agent`, and `date`.

### GET `/bookings/public/:id`

Returns a safe public booking confirmation payload.

### GET `/bookings/:id`

Returns a protected booking record.

Auth: Super Admin or assigned Agent.

### PATCH `/bookings/:id/status`

Updates booking status.

Auth: Super Admin or assigned Agent.

Request:

```json
{
  "status": "Confirmed"
}
```

Allowed statuses: `Pending`, `Confirmed`, `Completed`, `Cancelled`.

### DELETE `/bookings/:id`

Deletes a booking.

Auth: Super Admin only.

## Chat Routes

### GET `/chats/booking/:bookingId`

Returns chat messages for a booking.

Auth: optional.

### POST `/chats/booking/:bookingId/messages`

Adds a booking chat message.

Auth: optional.

Request:

```json
{
  "senderName": "Ravi Kumar",
  "text": "Please confirm airport pickup timing."
}
```

## Pricing Routes

### GET `/pricing`

Returns pricing packages.

Auth: optional.

### POST `/pricing`

Creates a pricing package.

Auth: Super Admin or Agent.

Request:

```json
{
  "title": "Airport Fixed Price",
  "category": "Airport",
  "price": 1500,
  "unit": "fixed",
  "carType": "Both",
  "description": "Hyderabad airport pickup/drop package."
}
```

### PUT `/pricing/:id`

Updates a pricing package.

Auth: Super Admin or owning Agent.

### DELETE `/pricing/:id`

Deletes a pricing package.

Auth: Super Admin or owning Agent.

## Self-Drive Routes

### GET `/self-drive/cars`

Returns self-drive car inventory.

Auth: optional.

### POST `/self-drive/cars`

Creates a self-drive car.

Auth: Super Admin or Agent.

Request:

```json
{
  "name": "Swift Dzire Self Drive",
  "imageUrl": "data:image/jpeg;base64,...",
  "fuelType": "Petrol",
  "transmission": "Manual",
  "seatingCapacity": "5 seats",
  "pricePerDay": 2200,
  "securityDeposit": 5000,
  "requiredDocuments": ["Valid Driving License", "Aadhaar Card"],
  "availabilityStatus": "Available",
  "isActive": true
}
```

### PUT `/self-drive/cars/:id`

Updates a self-drive car.

Auth: Super Admin or owning Agent.

### DELETE `/self-drive/cars/:id`

Deletes a self-drive car.

Auth: Super Admin or owning Agent.

### POST `/self-drive/bookings`

Creates a self-drive booking request.

Request:

```json
{
  "customerName": "Ravi Kumar",
  "phoneNumber": "9876543210",
  "drivingLicenseNumber": "TS123456789",
  "pickupDate": "2026-08-20",
  "returnDate": "2026-08-22",
  "pickupLocation": "Hyderabad",
  "selectedCar": "self_drive_car_id",
  "notes": "Need morning pickup.",
  "documentNote": "Documents will be verified before handover."
}
```

### GET `/self-drive/bookings`

Lists self-drive booking requests.

Auth: Super Admin or Agent.

### PATCH `/self-drive/bookings/:id/status`

Updates self-drive booking status.

Auth: Super Admin or Agent.

Request:

```json
{
  "status": "Approved"
}
```

Allowed statuses: `Pending`, `Approved`, `Rejected`, `Completed`.

## Contact Routes

### POST `/contact`

Creates a contact message.

Request:

```json
{
  "name": "Customer Name",
  "phone": "9876543210",
  "email": "customer@example.com",
  "message": "I need a temple trip package."
}
```

### GET `/contact`

Lists contact messages.

Auth: Super Admin only.

### PATCH `/contact/:id/read`

Marks a contact message read/unread.

Auth: Super Admin only.

Request:

```json
{
  "isRead": true
}
```

### DELETE `/contact/:id`

Deletes a contact message.

Auth: Super Admin only.
