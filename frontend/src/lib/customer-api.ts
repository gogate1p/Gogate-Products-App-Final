import {
  portalRequest,
} from "@/lib/portal-auth";

export const CustomerApi = {
  me() {
    return portalRequest(
      "/customer-portal/me",
    );
  },

  dashboard() {
    return portalRequest(
      "/customer-portal/dashboard",
    );
  },

  addresses() {
    return portalRequest(
      "/customer-portal/addresses",
    );
  },

  addAddress(data: any) {
    return portalRequest(
      "/customer-portal/addresses",
      {
        method: "POST",
        body:
          JSON.stringify(data),
      },
    );
  },

  removeAddress(id: string) {
    return portalRequest(
      `/customer-portal/addresses/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  setDefaultAddress(id: string) {
    return portalRequest(
      `/customer-portal/addresses/${id}/default`,
      {
        method: "PATCH",
      },
    );
  },

  shipments() {
    return portalRequest(
      "/customer-portal/shipments",
    );
  },

  createShipment(data: any) {
    return portalRequest(
      "/customer-portal/shipments",
      {
        method: "POST",
        body:
          JSON.stringify(data),
      },
    );
  },

  paymentMethods() {
    return portalRequest(
      "/customer-portal/payment-methods",
    );
  },

  addPaymentMethod(data: any) {
    return portalRequest(
      "/customer-portal/payment-methods",
      {
        method: "POST",
        body:
          JSON.stringify(data),
      },
    );
  },

  deletePaymentMethod(id: string) {
    return portalRequest(
      `/customer-portal/payment-methods/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  tickets() {
    return portalRequest(
      "/customer-portal/support/tickets",
    );
  },

  createTicket(data: any) {
    return portalRequest(
      "/customer-portal/support/tickets",
      {
        method: "POST",
        body:
          JSON.stringify(data),
      },
    );
  },

  ticketMessages(id: string) {
    return portalRequest(
      `/customer-portal/support/tickets/${id}/messages`,
    );
  },

  sendTicketMessage(
    id: string,
    message: string,
  ) {
    return portalRequest(
      `/customer-portal/support/tickets/${id}/messages`,
      {
        method: "POST",
        body:
          JSON.stringify({
            message,
          }),
      },
    );
  },
};