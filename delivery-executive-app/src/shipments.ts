import { api } from "./api";

export async function trackShipment(awb: string) {
  const response = await api.get(
    `/shipments/${encodeURIComponent(awb)}/track`
  );

  return response.data;
}

export async function markOutForDelivery(
  shipmentId: string
) {
  const response = await api.patch(
    `/shipments/${encodeURIComponent(shipmentId)}/out-for-delivery`,
    {}
  );

  return response.data;
}

export async function deliverShipment(
  shipmentId: string,
  payload: unknown
) {
  const response = await api.patch(
    `/shipments/${encodeURIComponent(shipmentId)}/deliver`,
    payload
  );

  return response.data;
}

export async function scanPackage(payload: {
  scanValue: string;
  scanType: string;
  lat?: number;
  lng?: number;
  gpsAccuracy?: number;
}) {
  const response = await api.post(
    "/packages/scan",
    payload
  );

  return response.data;
}