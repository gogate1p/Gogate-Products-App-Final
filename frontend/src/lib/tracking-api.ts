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
      `${API}/tracking/${encodeURIComponent(
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

export const CustomerShipmentApi = {
  detail(
    awb: string,
  ) {
    return portalRequest(
      `/customer-shipments/${encodeURIComponent(
        awb,
      )}`,
    );
  },

  issueOtp(
    awb: string,
    type:
      "PICKUP" |
      "DELIVERY",
  ) {
    return portalRequest(
      `/customer-shipments/${encodeURIComponent(
        awb,
      )}/otp/${type}`,
      {
        method:
          "POST",
      },
    );
  },
};