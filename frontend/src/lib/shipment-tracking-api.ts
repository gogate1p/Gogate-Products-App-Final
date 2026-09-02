import {
  portalRequest,
} from "@/lib/portal-auth";

const API =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export async function publicTrack(
  awb: string,
) {
  const response =
    await fetch(
      `${API}/public-tracking/${encodeURIComponent(
        awb,
      )}`,
      {
        cache:
          "no-store",
      },
    );

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message = typeof data === "string"
      ? data
      : data?.message ?? data?.error;
    throw new Error(message || (response.status >= 500
      ? "Tracking service is temporarily unavailable. Please try again shortly."
      : "Shipment not found."));
  }

  return data;
}

export const CustomerTrackingApi = {
  details(
    awb: string,
  ) {
    return portalRequest(
      `/customer-tracking/${encodeURIComponent(
        awb,
      )}`,
    );
  },
};

export const ShipmentScanApi = {
  resolve(
    code: string,
  ) {
    return portalRequest(
      `/shipment-workflow/resolve/${encodeURIComponent(
        code,
      )}`,
    );
  },

  scan(
    data: {
      code: string;
      scanType: string;
      otp?: string;
      hubId?: string;
      manifestId?: string;
      runsheetId?: string;
      vehicleId?: string;
      deviceId?: string;
      gpsLat?: number;
      gpsLng?: number;
      gpsAccuracy?: number;
      receivedBy?: string;
    },
  ) {
    return portalRequest(
      "/shipment-workflow/scan",
      {
        method:
          "POST",

        body:
          JSON.stringify(
            data,
          ),
      },
    );
  },
};