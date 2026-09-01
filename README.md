# Gogate Products Logistics Platform

Integrated logistics technology platform for Gogate Products.

## Applications

### Frontend

Next.js portal and public website.

Includes:

- Public logistics website
- Public shipment tracking
- Customer portal
- Merchant portal
- Shipper portal
- Hub operations portal
- Branch operations portal
- Dispatcher portal
- Staff portal
- WMS
- Customer support
- Admin portal
- KYC workflows
- Shipment labels and invoices
- QR/barcode shipment handling
- Responsive tracking UI

### Backend

NestJS logistics API with PostgreSQL and Prisma.

Core modules include:

- Authentication and RBAC
- Customer accounts
- Merchant / shipper workflows
- Shipment creation
- 12-digit numeric AWB generation
- Public tracking
- Customer shipment tracking
- Shipment events
- Pickup / delivery OTP
- Hub operations
- Hub routing
- Branch operations
- Bagging
- Manifests
- Linehaul
- Dispatcher operations
- WMS
- Payments metadata
- Customer support
- KYC
- Scan-based shipment workflow

## Mobile Applications

### Gogate Products Delivery Executive

Expo / React Native application for pickup and last-mile operations.

Intended workflow:

- Login
- Assignment handling
- Barcode / QR scanning
- Pickup
- Pickup OTP verification
- Delivery
- Delivery OTP verification
- COD collection information
- POD
- GPS for active operations
- Shipment event synchronization

### Gogate Products Truck Driver

Expo / React Native linehaul application.

Intended workflow:

- Driver login
- Trip and vehicle assignment
- Manifest handling
- QR / barcode scanning
- Hub departure
- Linehaul movement
- Hub arrival
- Shipment / bag verification

## Shipment Lifecycle

Customer-facing shipment stages:

1. Shipment Created
2. Picked Up
3. Shipped
4. Out for Delivery
5. Delivered

Operational events may include:

- OUT_FOR_PICKUP
- PICKUP_CONFIRMED
- HUB_INBOUND
- BAGGED
- MANIFESTED
- LINEHAUL_DISPATCH
- TRUCK_DEPARTED
- TRUCK_IN_TRANSIT
- TRUCK_ARRIVED
- DESTINATION_HUB_RECEIVED
- OUT_FOR_DELIVERY
- DELIVERY_CONFIRMED

## Tracking

Public tracking is designed for customer-safe information.

Sensitive information such as OTPs, full addresses, authentication data,
internal manifests and private operational data must not be exposed publicly.

Normal courier shipments use expected delivery dates.

Hyperlocal shipments may expose live ETA only when valid operational ETA data
is available.

## Shipment Labels

Labels support:

- 12-digit AWB
- Code 128 barcode
- Shipment QR code
- Sender / seller
- Receiver
- Receiving hub short code
- Expected delivery date
- Service type
- PREPAID / COD
- COD amount to collect

## Hub Routing

Hub workflow can provide:

- Current hub
- Next hub
- Staging zone
- Lane
- Rack
- Planned truck
- Trip code
- Planned dispatch
- Next hub movement

Hub codes are compact operational codes such as:

- PNQ
- PBR
- BLR
- BOM

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- NestJS
- PostgreSQL
- Prisma
- Redis
- Expo
- React Native
- Vercel
- GitHub

## Environment Variables

Secrets are never committed to this repository.

Copy the relevant `.env.example` file and configure the environment locally
or through your deployment platform.

## Security

Do not commit:

- DATABASE_URL
- JWT secrets
- Redis credentials
- API credentials
- Pidge credentials
- Payment gateway secrets
- Vercel credentials
- production passwords
- OTP encryption keys
- private certificates