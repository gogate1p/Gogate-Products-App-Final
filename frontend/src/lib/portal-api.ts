import {
  api,
} from "./api";

/* =========================================================
   CUSTOMER
========================================================= */

export function trackShipment(
  awb: string,
) {
  return api.get(
    `/shipments/${encodeURIComponent(awb)}/track`,
  );
}

/* =========================================================
   SHIPMENTS
========================================================= */

export function createShipment(
  payload: unknown,
) {
  return api.post(
    "/shipments",
    payload,
  );
}

export function markOutForDelivery(
  id: string,
) {
  return api.patch(
    `/shipments/${id}/out-for-delivery`,
    {},
  );
}

export function markDelivered(
  id: string,
  payload: unknown,
) {
  return api.patch(
    `/shipments/${id}/deliver`,
    payload,
  );
}

/* =========================================================
   PACKAGES / WMS
========================================================= */

export function packageDetails(
  id: string,
) {
  return api.get(
    `/packages/${id}`,
  );
}

export function packageScans(
  id: string,
) {
  return api.get(
    `/packages/${id}/scans`,
  );
}

export function scanPackage(
  payload: unknown,
) {
  return api.post(
    "/packages/scan",
    payload,
  );
}

export function scanPackageBatch(
  payload: unknown,
) {
  return api.post(
    "/packages/scan/batch",
    payload,
  );
}

/* =========================================================
   TENANT / ADMIN
========================================================= */

export function tenants() {
  return api.get(
    "/tenants",
  );
}

export function tenant(
  id: string,
) {
  return api.get(
    `/tenants/${id}`,
  );
}

/* =========================================================
   RIDER / WORKFORCE
========================================================= */

export function riderMe() {
  return api.get(
    "/workforce/riders/me",
  );
}

export function riderStatus() {
  return api.get(
    "/workforce/riders/me/status",
  );
}

export function riderDashboard() {
  return api.get(
    "/workforce/riders/me/dashboard",
  );
}

export function riderHubs() {
  return api.get(
    "/workforce/riders/me/hubs",
  );
}

export function riderKyc() {
  return api.get(
    "/workforce/riders/me/kyc",
  );
}

export function riderKycStatus() {
  return api.get(
    "/workforce/riders/me/kyc/status",
  );
}

export function availableSlots() {
  return api.get(
    "/workforce/riders/me/slots/available",
  );
}

/* =========================================================
   ADMIN VERIFICATIONS
========================================================= */

export function pendingRiderKyc() {
  return api.get(
    "/workforce/hub/kyc/pending",
  );
}

export function approveRiderKyc(
  riderId: string,
) {
  return api.post(
    `/workforce/hub/riders/${riderId}/kyc/approve`,
    {},
  );
}

export function rejectRiderKyc(
  riderId: string,
  reason: string,
) {
  return api.post(
    `/workforce/hub/riders/${riderId}/kyc/reject`,
    {
      reason,
    },
  );
}

export function verifyVehicle(
  vehicleId: string,
) {
  return api.post(
    `/workforce/hub/vehicles/${vehicleId}/verify`,
    {},
  );
}

export function rejectVehicle(
  vehicleId: string,
  reason: string,
) {
  return api.post(
    `/workforce/hub/vehicles/${vehicleId}/reject`,
    {
      reason,
    },
  );
}