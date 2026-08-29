# Phase 2A — database and policy foundation

## 1. Exact gap analysis

The repository is still aligned to the earlier Phase 1 baseline:

- The Prisma schema already includes `Tenant`, `User`, `Hub`, `Order`, `Shipment`, `Package`, `Bag`, `Manifest`, `Runsheet`, `DeliveryAttempt`, `Payment`, `RiderKyc`, and `AuditLog`, which is good for the core logistics domain.
- The codebase already contains a minimal `EventsService` for shipment lifecycle transitions and a `ShipmentsService.trackShipment()` implementation that hides strict ETA for non-hyperlocal shipments.
- The existing implementation is not yet centralized around the mandatory Phase 2 policy rules.
- There is no provider abstraction for maps/payments/notifications; the system still assumes direct service logic and mock values in business code.
- There is no configurable routing network or hub lane model.
- There is no dedicated tracking policy model to capture how ETA and live tracking should be shown by service type.
- There is no package scan audit model or package-level scan trail.
- There is no Phase 2-ready migration foundation for the required architecture.

## 2. Existing Prisma model inventory

Current domain inventory in the Prisma schema:

- `Tenant`
- `User`
- `Role`
- `Hub`
- `Order`
- `Shipment`
- `Package`
- `ShipmentEvent`
- `Bag`
- `BagItem`
- `Manifest`
- `ManifestItem`
- `Runsheet`
- `RunsheetShipment`
- `Route`
- `RouteStop`
- `DeliveryAttempt`
- `DeliveryOtp`
- `ObdSession`
- `Payment`
- `RiderKyc`
- `KycDocument`
- `RiderActivation`
- `Vehicle`
- `Notification`
- `Sla`
- `AuditLog`
- `OutboxEvent`

## 3. Proposed schema changes

Phase 2A adds the missing operational foundation without duplicating existing `Shipment` and `Hub` concepts:

1. `TrackingPolicy`
   - Tenant-scoped service policy for `NORMAL`, `HYPERLOCAL`, `PRIORITY`, and time-slot deliveries.
   - Controls whether exact ETA, live tracking, delivery window messaging, and OBD are exposed.
   - Centralizes the mandatory "normal vs hyperlocal ETA" rule.

2. `HubNetworkLane`
   - `tenantId`, `fromHubId`, `toHubId`, `distanceKm`, `expectedTransitMinutes`, `cutoff`, `capacity`, `active`, `serviceTypes`, priority, and vehicle requirements.
   - Allows configuration of valid hub-to-hub network topology instead of nearest-hub-only logic.

3. `HubCapacity`
   - Daily or time-windowed capacity snapshot for a hub by service type.
   - Supports multi-hub routing and capacity-aware assignment.

4. `PackageScan`
   - Centralized package scan history for AWB, barcode, QR, bag, manifest, hub QR, and rider QR scenarios.
   - Records scan validity, tenant, shipment, package, hub, manifest, runsheet, and audit metadata.

5. Supporting relations
   - `Tenant -> TrackingPolicy[]`
   - `Hub -> outboundLanes / inboundLanes`
   - `Hub -> capacities`
   - `Shipment -> scans`
   - `Package -> scans`
   - `Bag -> scans`
   - `Manifest -> scans`
   - `Runsheet -> scans`
   - `User -> packageScans`

## 4. Migration plan

1. Add the new models and relation fields to `backend/prisma/schema.prisma`.
2. Add a Phase 2A migration SQL file under `backend/prisma/migrations/.../migration.sql`.
3. Validate Prisma schema syntax with `npx prisma validate`.
4. Run the backend build and targeted regression tests.
5. Apply migration in a configured database environment only after the environment is prepared.

## 5. Module/file plan

Planned files for the Phase 2A scope:

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20260829_phase2a_foundation/migration.sql`
- `backend/src/tracking/tracking-policy.service.ts`
- `backend/src/providers/maps-provider.interface.ts`
- `backend/src/providers/mock-maps.provider.ts`
- `backend/src/providers/google-maps.provider.ts`
- `backend/src/providers/maps-provider.factory.ts`
- `backend/src/tracking/tracking-policy.service.spec.ts`

## 6. GitHub-ready backlog

This has been organized for follow-up issue tracking in the order requested by the Phase 2 execution plan:

- Phase 2A — database/schema foundation
- Phase 2B — package + scanning
- Phase 2C — bag + manifest
- Phase 2D — hub inbound/outbound + network routing
- Phase 2E — rider/KYC/vehicle/workforce
- Phase 2F — runsheet + dispatcher
- Phase 2G — maps + route planning
- Phase 2H — GPS
- Phase 2I — delivery + OTP
- Phase 2J — OBD
- Phase 2K — NDR + RTO
- Phase 2L — return + replacement
- Phase 2M — payment + COD
- Phase 2N — ecommerce integration
- Phase 2O — notifications
- Phase 2P — SLA + audit + observability
- Phase 2Q — end-to-end testing

> The repo cannot push directly to GitHub from this workspace, so the list above is staged as a GitHub-ready backlog and implementation plan in-repo.
