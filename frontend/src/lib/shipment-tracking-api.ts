import {
  portalRequest,
} from "@/lib/portal-auth";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

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

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ??
      "Shipment not found.",
    );
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