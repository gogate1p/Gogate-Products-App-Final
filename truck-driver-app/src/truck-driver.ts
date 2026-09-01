import { api } from "./api";

export async function truckDriverMe() {
  return (
    await api.get(
      "/truck-driver/me"
    )
  ).data;
}

export async function truckDashboard() {
  return (
    await api.get(
      "/truck-driver/dashboard"
    )
  ).data;
}

export async function assignedManifests() {
  return (
    await api.get(
      "/truck-driver/manifests"
    )
  ).data;
}

export async function manifestDetails(
  id: string
) {
  return (
    await api.get(
      `/truck-driver/manifests/${id}`
    )
  ).data;
}

export async function startManifest(
  id: string,
  payload: unknown
) {
  return (
    await api.post(
      `/truck-driver/manifests/${id}/start`,
      payload
    )
  ).data;
}

export async function arriveManifest(
  id: string,
  payload: unknown
) {
  return (
    await api.post(
      `/truck-driver/manifests/${id}/arrive`,
      payload
    )
  ).data;
}

export async function completeManifest(
  id: string,
  payload: unknown
) {
  return (
    await api.post(
      `/truck-driver/manifests/${id}/complete`,
      payload
    )
  ).data;
}

export async function truckVehicle() {
  return (
    await api.get(
      "/truck-driver/vehicle"
    )
  ).data;
}

export async function scanTruckItem(
  payload: unknown
) {
  return (
    await api.post(
      "/truck-driver/scan",
      payload
    )
  ).data;
}

export async function sendLocation(
  payload: {
    lat: number;
    lng: number;
    accuracy?: number;
    manifestId?: string;
  }
) {
  return (
    await api.post(
      "/truck-driver/location",
      payload
    )
  ).data;
}