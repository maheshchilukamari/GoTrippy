# GoTrippy Database Schema

This document describes the actual Mongoose models used by the GoTrippy backend.

## User

Purpose: Stores Super Admin and Agent/vehicle owner accounts.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Account holder name |
| email | String | Yes | Unique, lowercase login email |
| phone | String | No | Mobile number |
| whatsappNumber | String | No | WhatsApp contact |
| city | String | No | Partner city |
| profilePhoto | String | No | URL or base64 image |
| passwordHash | String | No | Hashed password, hidden by default |
| password | String | No | Legacy hashed password field, hidden by default |
| role | String | No | `SUPER_ADMIN`, `AGENT`, or legacy `admin` |
| status | String | No | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| createdBy | ObjectId | No | References `User` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

Relationships:
- `User` owns `Car`, `SelfDriveCar`, `Booking`, `SelfDriveBooking`, and `PricingPackage` through agent/owner references.

## DriverProfile

Purpose: Stores public-facing partner/driver profile details for registered drivers.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| userId | ObjectId | Yes | References `User`, unique |
| fullName | String | Yes | Driver full name |
| phone | String | Yes | Mobile number |
| whatsappNumber | String | Yes | WhatsApp number |
| email | String | Yes | Lowercase email |
| city | String | Yes | Driver city |
| profilePhoto | String | No | URL or base64 image |
| rating | Number | No | Default `4.8`, max `5` |
| totalTrips | Number | No | Default `0` |
| status | String | No | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

## Agent

Purpose: Stores assigned driver/agent records that can be attached to vehicles.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| fullName | String | Yes | Assigned driver/agent name |
| mobileNumber | String | Yes | Mobile number |
| whatsappNumber | String | Yes | WhatsApp number |
| alternateNumber | String | No | Optional alternate number |
| licenseNumber | String | No | Optional driver license |
| status | String | No | `Active` or `Inactive` |
| profilePhoto | String | No | URL/base64 image |
| assignedVehicles | ObjectId[] | No | References `Car` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

## Car

Purpose: Stores vehicles with driver/partner listing details.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Vehicle name |
| slug | String | Yes | Unique public slug |
| imageUrl | String | Yes | Remote URL or base64 image |
| vehicleType | String | No | Default `Car` |
| registrationNumber | String | No | Vehicle registration number |
| fuelType | String | No | Default `Petrol` |
| transmission | String | No | Default `Manual` |
| acType | String | No | `AC` or `Non-AC` |
| vehicleCategory | String | No | `Hatchback`, `Sedan`, `SUV`, `MPV`, `Tempo Traveller`, `Luxury`, `Other` |
| serviceType | String | No | `With Driver`, `Self Drive`, `Both` |
| category | String | No | `WITH_DRIVER` or `SELF_DRIVE` |
| ownerAgentId | ObjectId | No | References owner `User` |
| assignedAgent | ObjectId | No | References `Agent` |
| assignedDriverName | String | No | Driver text fallback |
| assignedDriverPhone | String | No | Driver phone fallback |
| agentName | String | No | Legacy text fallback |
| agentPhone | String | No | Legacy text fallback |
| seatingCapacity | String | Yes | Seats/passengers |
| luggageCapacity | String | Yes | Luggage capacity |
| idealUseCases | String[] | No | Family, temple, airport, etc. |
| priceEstimate | String | Yes | Public price guidance |
| pricePerKm | Number | No | Optional pricing |
| minimumFare | Number | No | Optional pricing |
| dailyRentalPrice | Number | No | Optional pricing |
| securityDeposit | Number | No | Optional pricing |
| airportFixedPrice | Number | No | Optional pricing |
| templePackagePrice | Number | No | Optional pricing |
| pickupCity | String | No | Primary pickup city |
| serviceAreas | String[] | No | Covered cities/areas |
| popularRoutes | String[] | No | Popular routes |
| availableDates | String[] | No | Optional availability list |
| instantBooking | Boolean | No | Default `true` |
| description | String | Yes | Vehicle description |
| isActive | Boolean | No | Default `true` |
| status | String | No | `PENDING_APPROVAL`, `ACTIVE`, `INACTIVE`, `REJECTED` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

Relationships:
- `ownerAgentId` links a vehicle to a partner `User`.
- `assignedAgent` links a vehicle to an assigned `Agent`.
- `Booking.selectedVehicleId` and `Booking.preferredCar` reference `Car`.

## Booking

Purpose: Stores customer cab booking requests.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| customerName | String | Yes | Customer name |
| phoneNumber | String | Yes | Customer mobile |
| pickupLocation | String | Yes | Pickup location |
| dropLocation | String | Yes | Drop location |
| tripType | String | Yes | `One Way`, `Round Trip`, `Local`, `Airport`, `Temple Trip`, `Picnic`, `Outstation` |
| travelDate | Date | Yes | Journey date |
| travelTime | String | Yes | Journey start time |
| passengers | Number | Yes | Minimum `1` |
| preferredCar | ObjectId | No | References `Car` |
| selectedVehicleId | ObjectId | No | References `Car` |
| agentId | ObjectId | No | References owner `User` |
| assignedAgentId | ObjectId | No | References `Agent` |
| preferredCarName | String | No | Default `Any Available Car` |
| assignedAgentName | String | No | Snapshot/fallback name |
| assignedAgentPhone | String | No | Snapshot/fallback phone |
| additionalNotes | String | No | Customer notes |
| status | String | No | `Pending`, `Confirmed`, `Completed`, `Cancelled` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

Indexes:
- `{ travelDate: 1, status: 1, tripType: 1 }`

## PricingPackage

Purpose: Stores editable pricing packages and partner-specific pricing.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| title | String | Yes | Package title |
| agentId | ObjectId | No | References `User` |
| vehicleId | ObjectId | No | Dynamic reference |
| vehicleModel | String | No | `Car` or `SelfDriveCar` |
| pricingType | String | No | Optional pricing label |
| pricePerKm | Number | No | Optional |
| pricePerDay | Number | No | Optional |
| airportFixedPrice | Number | No | Optional |
| templePackagePrice | Number | No | Optional |
| outstationPackagePrice | Number | No | Optional |
| securityDeposit | Number | No | Optional |
| notes | String | No | Internal notes |
| category | String | Yes | `Per Kilometer`, `Per Day`, `Airport`, `Temple`, `Outstation`, `Local`, `Custom` |
| price | Number | Yes | Public/display price |
| unit | String | Yes | Per km, day, fixed, etc. |
| carType | String | No | `Ertiga`, `Swift`, `Swift Dzire`, `Both` |
| description | String | Yes | Description |
| inclusions | String[] | No | Included items |
| isActive | Boolean | No | Default `true` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

## SelfDriveCar

Purpose: Stores self-drive car inventory.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Car name |
| vehicleType | String | No | Default `Car` |
| registrationNumber | String | No | Registration number |
| imageUrl | String | Yes | Remote URL or base64 image |
| category | String | No | `SELF_DRIVE` |
| ownerAgentId | ObjectId | No | References `User` |
| fuelType | String | Yes | Petrol/diesel/etc. |
| transmission | String | Yes | Manual/automatic |
| seatingCapacity | String | Yes | Seat count |
| pricePerDay | Number | Yes | Rental price |
| securityDeposit | Number | Yes | Deposit amount |
| requiredDocuments | String[] | No | Defaults to license, Aadhaar, PAN/passport, deposit |
| availabilityStatus | String | No | `Available`, `Unavailable`, `Maintenance` |
| isActive | Boolean | No | Default `true` |
| status | String | No | `PENDING_APPROVAL`, `ACTIVE`, `INACTIVE`, `REJECTED` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

## SelfDriveBooking

Purpose: Stores self-drive rental requests.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| customerName | String | Yes | Customer name |
| phoneNumber | String | Yes | Mobile number |
| drivingLicenseNumber | String | Yes | License number |
| pickupDate | Date | Yes | Pickup date |
| returnDate | Date | Yes | Return date |
| pickupLocation | String | Yes | Pickup location |
| selectedCar | ObjectId | Yes | References `SelfDriveCar` |
| agentId | ObjectId | No | References owner `User` |
| notes | String | No | Customer notes |
| documentNote | String | No | Document upload placeholder/note |
| status | String | No | `Pending`, `Approved`, `Rejected`, `Completed` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

Indexes:
- `{ pickupDate: 1, status: 1, selectedCar: 1 }`

## ContactMessage

Purpose: Stores contact page messages.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Sender name |
| phone | String | Yes | Sender phone |
| email | String | No | Sender email |
| message | String | Yes | Message body |
| isRead | Boolean | No | Default `false` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

## Chat

Purpose: Stores booking chat thread metadata.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| bookingId | ObjectId | Yes | References `Booking`, indexed |
| customerName | String | No | Customer name snapshot |
| customerPhone | String | No | Customer phone snapshot |
| driverId | ObjectId | No | References `User` |
| vehicleId | ObjectId | No | References `Car` |
| lastMessage | String | No | Last message preview |
| unreadForDriver | Number | No | Default `0` |
| unreadForCustomer | Number | No | Default `0` |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |

## Message

Purpose: Stores individual booking chat messages.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| chatId | ObjectId | Yes | References `Chat`, indexed |
| bookingId | ObjectId | Yes | References `Booking`, indexed |
| senderRole | String | No | `CUSTOMER`, `DRIVER`, `ADMIN` |
| senderId | ObjectId | No | References `User` |
| senderName | String | Yes | Sender display name |
| text | String | Yes | Message body |
| readAt | Date | No | Read timestamp |
| timestamps | Date | Auto | `createdAt`, `updatedAt` |
