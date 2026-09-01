import {
  portalRequest,
} from "@/lib/portal-auth";

export const HubRoutingApi = {
  shipment(
    awb: string,
  ) {
    return portalRequest(
      `/hub-routing/shipment/${encodeURIComponent(
        awb,
      )}`,
    );
  },

  refresh(
    awb: string,
  ) {
    return portalRequest(
      `/hub-routing/shipment/${encodeURIComponent(
        awb,
      )}/refresh`,
      {
        method:
          "POST",
      },
    );
  },

  queue(
    hubId: string,
  ) {
    return portalRequest(
      `/hub-routing/hub/${encodeURIComponent(
        hubId,
      )}/queue`,
    );
  },
};