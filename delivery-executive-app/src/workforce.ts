import { api } from "./api";

export async function riderMe() {
  const response = await api.get("/workforce/riders/me");
  return response.data;
}

export async function riderStatus() {
  const response = await api.get("/workforce/riders/me/status");
  return response.data;
}

export async function riderHubs() {
  const response = await api.get("/workforce/riders/me/hubs");
  return response.data;
}

export async function selectHub(hubId: string) {
  const response = await api.post(
    "/workforce/riders/me/hub-selection",
    { hubId }
  );

  return response.data;
}

export async function riderDashboard() {
  const response = await api.get("/workforce/riders/me/dashboard");
  return response.data;
}

export async function submitKyc(payload: unknown) {
  const response = await api.post(
    "/workforce/riders/me/kyc",
    payload
  );

  return response.data;
}

export async function riderKyc() {
  const response = await api.get("/workforce/riders/me/kyc");
  return response.data;
}

export async function riderKycStatus() {
  const response = await api.get("/workforce/riders/me/kyc/status");
  return response.data;
}

export async function activateRider(pin: string) {
  const response = await api.post(
    "/workforce/riders/me/activate",
    { pin }
  );

  return response.data;
}

export async function activationStatus() {
  const response = await api.get(
    "/workforce/riders/me/activation-status"
  );

  return response.data;
}

export async function welcomeKit() {
  const response = await api.get(
    "/workforce/riders/me/welcome-kit"
  );

  return response.data;
}

export async function riderVehicles() {
  const response = await api.get(
    "/workforce/riders/me/vehicles"
  );

  return response.data;
}

export async function createVehicle(payload: unknown) {
  const response = await api.post(
    "/workforce/riders/me/vehicles",
    payload
  );

  return response.data;
}

export async function availableSlots() {
  const response = await api.get(
    "/workforce/riders/me/slots/available"
  );

  return response.data;
}

export async function bookedSlots() {
  const response = await api.get(
    "/workforce/riders/me/slots"
  );

  return response.data;
}

export async function bookSlot(slotId: string) {
  const response = await api.post(
    "/workforce/riders/me/slots/book",
    { slotId }
  );

  return response.data;
}

export async function checkIn(payload: {
  lat: number;
  lng: number;
  gpsAccuracy?: number;
}) {
  const response = await api.post(
    "/workforce/riders/me/check-in",
    payload
  );

  return response.data;
}

export async function checkOut(payload: {
  lat: number;
  lng: number;
  gpsAccuracy?: number;
}) {
  const response = await api.post(
    "/workforce/riders/me/check-out",
    payload
  );

  return response.data;
}

export async function checkInStatus() {
  const response = await api.get(
    "/workforce/riders/me/check-in-status"
  );

  return response.data;
}