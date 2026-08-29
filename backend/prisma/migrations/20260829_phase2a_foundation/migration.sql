-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'HUB_MANAGER', 'HUB_PERSONNEL', 'FLEET_MANAGER', 'FINANCE', 'SUPPORT', 'RIDER', 'DRIVER', 'MERCHANT', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "HubType" AS ENUM ('ORIGIN', 'TRANSIT', 'MAIN_CITY', 'DESTINATION', 'CUSTOMER_AREA', 'MICRO_HUB', 'RETURN_HUB', 'WAREHOUSE', 'CROSS_DOCK');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('CREATED', 'PACKED', 'READY_FOR_PICKUP', 'PICKED_UP', 'AT_HUB', 'BAGGED', 'MANIFESTED', 'IN_TRANSIT', 'RECEIVED', 'ASSIGNED_TO_RIDER', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'DAMAGED', 'LOST', 'EXCEPTION', 'FAILED');

-- CreateEnum
CREATE TYPE "BagStatus" AS ENUM ('OPEN', 'SEALED', 'DISPATCHED', 'IN_TRANSIT', 'RECEIVED', 'OPENED', 'CLOSED', 'EXCEPTION');

-- CreateEnum
CREATE TYPE "ManifestType" AS ENUM ('PICKUP', 'HUB_INBOUND', 'HUB_OUTBOUND', 'LINE_HAUL', 'DELIVERY', 'RETURN', 'REPLACEMENT');

-- CreateEnum
CREATE TYPE "ManifestStatus" AS ENUM ('DRAFT', 'OPEN', 'SEALED', 'DISPATCHED', 'IN_TRANSIT', 'ARRIVED', 'RECEIVED', 'RECONCILED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ObdStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PREPAID', 'COD', 'DOORSTEP_QR');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RiderState" AS ENUM ('APPLICANT', 'KYC_PENDING', 'KYC_SUBMITTED', 'DOCUMENT_VERIFICATION', 'HUB_VERIFICATION_PENDING', 'ACTIVATION_PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'REJECTED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ActivationStatus" AS ENUM ('PENDING', 'VERIFIED', 'USED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "WelcomeKitStatus" AS ENUM ('ORDERED', 'PROCESSING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'CANCELLED', 'LOCKED');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'EXPIRED', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SlaStatus" AS ENUM ('SAFE', 'AT_RISK', 'BREACHED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingPolicy" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL DEFAULT 'NORMAL',
    "allowDynamicEta" BOOLEAN NOT NULL DEFAULT false,
    "allowLiveTracking" BOOLEAN NOT NULL DEFAULT false,
    "allowExactArrival" BOOLEAN NOT NULL DEFAULT false,
    "deliveryWindow" TEXT,
    "obdRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hub" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "HubType" NOT NULL,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "pinCodesServed" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "customerDetails" JSONB NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "awb" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "serviceType" TEXT NOT NULL DEFAULT 'NORMAL',
    "obdRequired" BOOLEAN NOT NULL DEFAULT false,
    "originHubId" TEXT,
    "destinationHubId" TEXT,
    "currentHubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "originalShipmentId" TEXT,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "packageNumber" INTEGER NOT NULL DEFAULT 1,
    "barcode" TEXT NOT NULL,
    "qrCode" TEXT,
    "referenceCode" TEXT,
    "status" "PackageStatus" NOT NULL DEFAULT 'CREATED',
    "weight" DOUBLE PRECISION,
    "dimensions" JSONB,
    "itemCount" INTEGER DEFAULT 1,
    "declaredValue" DOUBLE PRECISION,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageScan" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "packageId" TEXT,
    "bagId" TEXT,
    "manifestId" TEXT,
    "hubId" TEXT,
    "runsheetId" TEXT,
    "riderId" TEXT,
    "userId" TEXT,
    "scanType" TEXT NOT NULL,
    "scanValue" TEXT,
    "idempotencyKey" TEXT,
    "deviceId" TEXT,
    "actorRole" TEXT,
    "gpsLat" DOUBLE PRECISION,
    "gpsLng" DOUBLE PRECISION,
    "gpsAccuracy" DOUBLE PRECISION,
    "clientTimestamp" TIMESTAMP(3),
    "serverTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'VALID',
    "reason" TEXT,
    "metadata" JSONB,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentEvent" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "userId" TEXT,
    "deviceId" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bag" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "status" "BagStatus" NOT NULL DEFAULT 'OPEN',
    "sealNumber" TEXT,
    "weight" DOUBLE PRECISION,
    "originHubId" TEXT NOT NULL,
    "destinationHubId" TEXT NOT NULL,
    "createdById" TEXT,
    "closedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BagItem" (
    "id" TEXT NOT NULL,
    "bagId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BagItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manifest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "manifestNumber" TEXT NOT NULL,
    "type" "ManifestType" NOT NULL,
    "status" "ManifestStatus" NOT NULL DEFAULT 'DRAFT',
    "originHubId" TEXT,
    "destinationHubId" TEXT,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "createdById" TEXT,
    "receivedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manifest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManifestItem" (
    "id" TEXT NOT NULL,
    "manifestId" TEXT NOT NULL,
    "packageId" TEXT,
    "bagId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ManifestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runsheet" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "riderId" TEXT,
    "vehicleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL,
    "slot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Runsheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunsheetShipment" (
    "id" TEXT NOT NULL,
    "runsheetId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RunsheetShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "runsheetId" TEXT NOT NULL,
    "distance" DOUBLE PRECISION,
    "duration" INTEGER,
    "geometry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "eta" TIMESTAMP(3),
    "timeWindow" TEXT,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryAttempt" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "runsheetId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "evidenceUrls" JSONB,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryOtp" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObdSession" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "status" "ObdStatus" NOT NULL DEFAULT 'PENDING',
    "codeHash" TEXT NOT NULL,
    "customerVerified" BOOLEAN NOT NULL DEFAULT false,
    "evidenceUrls" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObdSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "gatewayReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderProfile" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "riderCode" TEXT NOT NULL,
    "riderState" "RiderState" NOT NULL DEFAULT 'APPLICANT',
    "onboardingStatus" TEXT NOT NULL DEFAULT 'PROFILE_CREATED',
    "preferredHubId" TEXT,
    "primaryHubId" TEXT,
    "serviceArea" TEXT,
    "profilePhotoUrl" TEXT,
    "emergencyContact" JSONB,
    "joiningDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderKyc" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT NOT NULL,
    "userId" TEXT,
    "status" "KycStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "reviewerId" TEXT,
    "preferredHubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderKycId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentRef" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "reviewerId" TEXT,
    "rejectionReason" TEXT,
    "originalVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVerification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderKycId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "hubId" TEXT,
    "verifierId" TEXT,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderActivation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "riderProfileId" TEXT,
    "hubId" TEXT NOT NULL,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderActivation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationPin" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT NOT NULL,
    "activationId" TEXT,
    "hash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivationPin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelcomeKit" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT NOT NULL,
    "orderRef" TEXT,
    "status" "WelcomeKitStatus" NOT NULL DEFAULT 'ORDERED',
    "items" JSONB,
    "dispatchStatus" TEXT,
    "courierProvider" TEXT,
    "trackingCode" TEXT,
    "expectedDate" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WelcomeKit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderHubAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "assignmentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderHubAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderSlot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "SlotStatus" NOT NULL DEFAULT 'BOOKED',
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubCheckIn" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "slotId" TEXT,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "gpsAccuracy" DOUBLE PRECISION,
    "deviceId" TEXT,
    "result" TEXT NOT NULL DEFAULT 'CHECKED_IN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HubCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "riderProfileId" TEXT,
    "ownerId" TEXT,
    "assignedDriverId" TEXT,
    "type" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "vehicleType" TEXT,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "fuelType" TEXT,
    "ownerType" TEXT DEFAULT 'SELF',
    "capacity" DOUBLE PRECISION,
    "status" "VehicleStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "verificationState" TEXT NOT NULL DEFAULT 'PENDING',
    "rcReference" TEXT,
    "insuranceReference" TEXT,
    "permitReference" TEXT,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubNetworkLane" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fromHubId" TEXT NOT NULL,
    "toHubId" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "expectedTransitMinutes" INTEGER,
    "cutoff" TEXT,
    "capacity" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "serviceTypes" TEXT[],
    "priority" INTEGER NOT NULL DEFAULT 0,
    "vehicleRequirements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HubNetworkLane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubCapacity" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "serviceType" TEXT,
    "date" TIMESTAMP(3),
    "timeWindow" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "used" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HubCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sla" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "SlaStatus" NOT NULL DEFAULT 'SAFE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackingPolicy_tenantId_serviceType_idx" ON "TrackingPolicy"("tenantId", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_tenantId_role_idx" ON "User"("tenantId", "role");

-- CreateIndex
CREATE INDEX "User_tenantId_status_idx" ON "User"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Hub_tenantId_type_idx" ON "Hub"("tenantId", "type");

-- CreateIndex
CREATE INDEX "Hub_tenantId_locationLat_locationLng_idx" ON "Hub"("tenantId", "locationLat", "locationLng");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_awb_key" ON "Shipment"("awb");

-- CreateIndex
CREATE INDEX "Shipment_tenantId_status_idx" ON "Shipment"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Shipment_tenantId_currentHubId_status_idx" ON "Shipment"("tenantId", "currentHubId", "status");

-- CreateIndex
CREATE INDEX "Shipment_tenantId_awb_idx" ON "Shipment"("tenantId", "awb");

-- CreateIndex
CREATE INDEX "Shipment_tenantId_destinationHubId_status_idx" ON "Shipment"("tenantId", "destinationHubId", "status");

-- CreateIndex
CREATE INDEX "Package_tenantId_shipmentId_idx" ON "Package"("tenantId", "shipmentId");

-- CreateIndex
CREATE INDEX "Package_tenantId_status_idx" ON "Package"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Package_tenantId_barcode_idx" ON "Package"("tenantId", "barcode");

-- CreateIndex
CREATE INDEX "Package_shipmentId_status_idx" ON "Package"("shipmentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Package_tenantId_barcode_key" ON "Package"("tenantId", "barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Package_tenantId_referenceCode_key" ON "Package"("tenantId", "referenceCode");

-- CreateIndex
CREATE INDEX "PackageScan_tenantId_shipmentId_createdAt_idx" ON "PackageScan"("tenantId", "shipmentId", "createdAt");

-- CreateIndex
CREATE INDEX "PackageScan_tenantId_packageId_createdAt_idx" ON "PackageScan"("tenantId", "packageId", "createdAt");

-- CreateIndex
CREATE INDEX "PackageScan_tenantId_scanType_status_idx" ON "PackageScan"("tenantId", "scanType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PackageScan_tenantId_idempotencyKey_key" ON "PackageScan"("tenantId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "Bag_tenantId_status_idx" ON "Bag"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Bag_tenantId_barcode_key" ON "Bag"("tenantId", "barcode");

-- CreateIndex
CREATE UNIQUE INDEX "BagItem_bagId_packageId_key" ON "BagItem"("bagId", "packageId");

-- CreateIndex
CREATE INDEX "Manifest_tenantId_status_idx" ON "Manifest"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Manifest_tenantId_manifestNumber_key" ON "Manifest"("tenantId", "manifestNumber");

-- CreateIndex
CREATE INDEX "Runsheet_tenantId_riderId_status_idx" ON "Runsheet"("tenantId", "riderId", "status");

-- CreateIndex
CREATE INDEX "Runsheet_tenantId_hubId_status_idx" ON "Runsheet"("tenantId", "hubId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RunsheetShipment_shipmentId_key" ON "RunsheetShipment"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_runsheetId_key" ON "Route"("runsheetId");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_riderCode_key" ON "RiderProfile"("riderCode");

-- CreateIndex
CREATE INDEX "RiderProfile_tenantId_riderState_idx" ON "RiderProfile"("tenantId", "riderState");

-- CreateIndex
CREATE INDEX "RiderProfile_tenantId_preferredHubId_idx" ON "RiderProfile"("tenantId", "preferredHubId");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_tenantId_userId_key" ON "RiderProfile"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "RiderKyc_tenantId_status_idx" ON "RiderKyc"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RiderKyc_tenantId_riderProfileId_key" ON "RiderKyc"("tenantId", "riderProfileId");

-- CreateIndex
CREATE INDEX "KycDocument_tenantId_riderKycId_status_idx" ON "KycDocument"("tenantId", "riderKycId", "status");

-- CreateIndex
CREATE INDEX "DocumentVerification_tenantId_riderKycId_documentType_idx" ON "DocumentVerification"("tenantId", "riderKycId", "documentType");

-- CreateIndex
CREATE INDEX "ActivationPin_tenantId_riderProfileId_status_idx" ON "ActivationPin"("tenantId", "riderProfileId", "status");

-- CreateIndex
CREATE INDEX "WelcomeKit_tenantId_riderProfileId_status_idx" ON "WelcomeKit"("tenantId", "riderProfileId", "status");

-- CreateIndex
CREATE INDEX "RiderHubAssignment_tenantId_riderProfileId_isPrimary_idx" ON "RiderHubAssignment"("tenantId", "riderProfileId", "isPrimary");

-- CreateIndex
CREATE INDEX "RiderSlot_tenantId_hubId_date_idx" ON "RiderSlot"("tenantId", "hubId", "date");

-- CreateIndex
CREATE INDEX "RiderSlot_tenantId_hubId_status_startTime_endTime_idx" ON "RiderSlot"("tenantId", "hubId", "status", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "RiderSlot_tenantId_riderProfileId_status_idx" ON "RiderSlot"("tenantId", "riderProfileId", "status");

-- CreateIndex
CREATE INDEX "HubCheckIn_tenantId_riderProfileId_slotId_idx" ON "HubCheckIn"("tenantId", "riderProfileId", "slotId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registration_key" ON "Vehicle"("registration");

-- CreateIndex
CREATE INDEX "Vehicle_tenantId_riderProfileId_status_idx" ON "Vehicle"("tenantId", "riderProfileId", "status");

-- CreateIndex
CREATE INDEX "HubNetworkLane_tenantId_active_priority_idx" ON "HubNetworkLane"("tenantId", "active", "priority");

-- CreateIndex
CREATE INDEX "HubNetworkLane_tenantId_fromHubId_toHubId_idx" ON "HubNetworkLane"("tenantId", "fromHubId", "toHubId");

-- CreateIndex
CREATE INDEX "HubCapacity_tenantId_hubId_serviceType_date_idx" ON "HubCapacity"("tenantId", "hubId", "serviceType", "date");

-- AddForeignKey
ALTER TABLE "TrackingPolicy" ADD CONSTRAINT "TrackingPolicy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hub" ADD CONSTRAINT "Hub_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_originHubId_fkey" FOREIGN KEY ("originHubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_destinationHubId_fkey" FOREIGN KEY ("destinationHubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_currentHubId_fkey" FOREIGN KEY ("currentHubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_originalShipmentId_fkey" FOREIGN KEY ("originalShipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_runsheetId_fkey" FOREIGN KEY ("runsheetId") REFERENCES "Runsheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageScan" ADD CONSTRAINT "PackageScan_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentEvent" ADD CONSTRAINT "ShipmentEvent_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentEvent" ADD CONSTRAINT "ShipmentEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bag" ADD CONSTRAINT "Bag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bag" ADD CONSTRAINT "Bag_originHubId_fkey" FOREIGN KEY ("originHubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bag" ADD CONSTRAINT "Bag_destinationHubId_fkey" FOREIGN KEY ("destinationHubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BagItem" ADD CONSTRAINT "BagItem_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BagItem" ADD CONSTRAINT "BagItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_originHubId_fkey" FOREIGN KEY ("originHubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_destinationHubId_fkey" FOREIGN KEY ("destinationHubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManifestItem" ADD CONSTRAINT "ManifestItem_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManifestItem" ADD CONSTRAINT "ManifestItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManifestItem" ADD CONSTRAINT "ManifestItem_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runsheet" ADD CONSTRAINT "Runsheet_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runsheet" ADD CONSTRAINT "Runsheet_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runsheet" ADD CONSTRAINT "Runsheet_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runsheet" ADD CONSTRAINT "Runsheet_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunsheetShipment" ADD CONSTRAINT "RunsheetShipment_runsheetId_fkey" FOREIGN KEY ("runsheetId") REFERENCES "Runsheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunsheetShipment" ADD CONSTRAINT "RunsheetShipment_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_runsheetId_fkey" FOREIGN KEY ("runsheetId") REFERENCES "Runsheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_runsheetId_fkey" FOREIGN KEY ("runsheetId") REFERENCES "Runsheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryOtp" ADD CONSTRAINT "DeliveryOtp_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObdSession" ADD CONSTRAINT "ObdSession_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObdSession" ADD CONSTRAINT "ObdSession_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderProfile" ADD CONSTRAINT "RiderProfile_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderProfile" ADD CONSTRAINT "RiderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderKyc" ADD CONSTRAINT "RiderKyc_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderKyc" ADD CONSTRAINT "RiderKyc_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderKyc" ADD CONSTRAINT "RiderKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderKyc" ADD CONSTRAINT "RiderKyc_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_riderKycId_fkey" FOREIGN KEY ("riderKycId") REFERENCES "RiderKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVerification" ADD CONSTRAINT "DocumentVerification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVerification" ADD CONSTRAINT "DocumentVerification_riderKycId_fkey" FOREIGN KEY ("riderKycId") REFERENCES "RiderKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVerification" ADD CONSTRAINT "DocumentVerification_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVerification" ADD CONSTRAINT "DocumentVerification_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderActivation" ADD CONSTRAINT "RiderActivation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderActivation" ADD CONSTRAINT "RiderActivation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderActivation" ADD CONSTRAINT "RiderActivation_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderActivation" ADD CONSTRAINT "RiderActivation_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationPin" ADD CONSTRAINT "ActivationPin_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationPin" ADD CONSTRAINT "ActivationPin_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationPin" ADD CONSTRAINT "ActivationPin_activationId_fkey" FOREIGN KEY ("activationId") REFERENCES "RiderActivation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelcomeKit" ADD CONSTRAINT "WelcomeKit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelcomeKit" ADD CONSTRAINT "WelcomeKit_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderHubAssignment" ADD CONSTRAINT "RiderHubAssignment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderHubAssignment" ADD CONSTRAINT "RiderHubAssignment_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderHubAssignment" ADD CONSTRAINT "RiderHubAssignment_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderHubAssignment" ADD CONSTRAINT "RiderHubAssignment_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderSlot" ADD CONSTRAINT "RiderSlot_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderSlot" ADD CONSTRAINT "RiderSlot_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderSlot" ADD CONSTRAINT "RiderSlot_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubCheckIn" ADD CONSTRAINT "HubCheckIn_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubCheckIn" ADD CONSTRAINT "HubCheckIn_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubCheckIn" ADD CONSTRAINT "HubCheckIn_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubCheckIn" ADD CONSTRAINT "HubCheckIn_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "RiderSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_riderProfileId_fkey" FOREIGN KEY ("riderProfileId") REFERENCES "RiderProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_assignedDriverId_fkey" FOREIGN KEY ("assignedDriverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubNetworkLane" ADD CONSTRAINT "HubNetworkLane_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubNetworkLane" ADD CONSTRAINT "HubNetworkLane_fromHubId_fkey" FOREIGN KEY ("fromHubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubNetworkLane" ADD CONSTRAINT "HubNetworkLane_toHubId_fkey" FOREIGN KEY ("toHubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubCapacity" ADD CONSTRAINT "HubCapacity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubCapacity" ADD CONSTRAINT "HubCapacity_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sla" ADD CONSTRAINT "Sla_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
