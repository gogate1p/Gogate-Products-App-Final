export class ApiError extends Error {
  status:
    number;

  data:
    unknown;

  constructor(
    status:
      number,
    message:
      string,
    data:
      unknown,
  ) {
    super(message);

    this.status =
      status;

    this.data =
      data;
  }
}

export type ApiRequestOptions = {
  method?:
    "GET" |
    "POST" |
    "PUT" |
    "PATCH" |
    "DELETE";

  body?:
    unknown;

  token?:
    string | null;

  tenantId?:
    string | null;
};

export async function apiRequest<T = unknown>(
  path:
    string,
  options:
    ApiRequestOptions = {},
): Promise<T> {
  const headers =
    new Headers();

  headers.set(
    "content-type",
    "application/json",
  );

  const token =
    options.token ??
    (
      typeof window !== "undefined"
        ? localStorage.getItem(
            "gogate_token",
          )
        : null
    );

  if (token) {
    headers.set(
      "authorization",
      `Bearer ${token}`,
    );
  }

  const tenantId =
    options.tenantId ??
    (
      typeof window !== "undefined"
        ? localStorage.getItem(
            "gogate_tenant_id",
          )
        : null
    );

  if (tenantId) {
    headers.set(
      "x-tenant-id",
      tenantId,
    );
  }

  const response =
    await fetch(
      `/api/backend${path}`,
      {
        method:
          options.method ??
          "GET",

        headers,

        body:
          options.body === undefined
            ? undefined
            : JSON.stringify(
                options.body,
              ),

        cache:
          "no-store",
      },
    );

  const text =
    await response.text();

  let data:
    unknown = null;

  if (text) {
    try {
      data =
        JSON.parse(text);
    } catch {
      data =
        text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,

      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(
            (
              data as {
                message?: unknown;
              }
            ).message,
          )
        : `API request failed (${response.status})`,

      data,
    );
  }

  return data as T;
}

export const BackendApi = {
  health:
    () =>
      apiRequest<string>(
        "/",
      ),

  tenants:
    () =>
      apiRequest(
        "/tenants",
      ),

  tenant:
    (
      id:
        string,
    ) =>
      apiRequest(
        `/tenants/${encodeURIComponent(id)}`,
      ),

  createTenant:
    (
      payload:
        unknown,
    ) =>
      apiRequest(
        "/tenants",
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  createShipment:
    (
      payload:
        unknown,
    ) =>
      apiRequest(
        "/shipments",
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  trackShipment:
    (
      awb:
        string,
    ) =>
      apiRequest(
        `/shipments/${encodeURIComponent(awb)}/track`,
      ),

  outForDelivery:
    (
      shipmentId:
        string,
      payload:
        unknown = {},
    ) =>
      apiRequest(
        `/shipments/${encodeURIComponent(shipmentId)}/out-for-delivery`,
        {
          method:
            "PATCH",

          body:
            payload,
        },
      ),

  deliverShipment:
    (
      shipmentId:
        string,
      payload:
        unknown,
    ) =>
      apiRequest(
        `/shipments/${encodeURIComponent(shipmentId)}/deliver`,
        {
          method:
            "PATCH",

          body:
            payload,
        },
      ),

  package:
    (
      packageId:
        string,
    ) =>
      apiRequest(
        `/packages/${encodeURIComponent(packageId)}`,
      ),

  packageScans:
    (
      packageId:
        string,
    ) =>
      apiRequest(
        `/packages/${encodeURIComponent(packageId)}/scans`,
      ),

  scanPackage:
    (
      payload:
        unknown,
    ) =>
      apiRequest(
        "/packages/scan",
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  scanPackagesBatch:
    (
      payload:
        unknown,
    ) =>
      apiRequest(
        "/packages/scan/batch",
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  riderPendingKyc:
    () =>
      apiRequest(
        "/workforce/hub/kyc/pending",
      ),

  riderKyc:
    (
      riderId:
        string,
    ) =>
      apiRequest(
        `/workforce/hub/riders/${encodeURIComponent(riderId)}/kyc`,
      ),

  approveRiderKyc:
    (
      riderId:
        string,
      payload:
        unknown = {},
    ) =>
      apiRequest(
        `/workforce/hub/riders/${encodeURIComponent(riderId)}/kyc/approve`,
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  rejectRiderKyc:
    (
      riderId:
        string,
      payload:
        unknown,
    ) =>
      apiRequest(
        `/workforce/hub/riders/${encodeURIComponent(riderId)}/kyc/reject`,
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  verifyRiderDocument:
    (
      riderId:
        string,
      documentId:
        string,
      payload:
        unknown = {},
    ) =>
      apiRequest(
        `/workforce/hub/riders/${encodeURIComponent(riderId)}/documents/${encodeURIComponent(documentId)}/verify`,
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  rejectRiderDocument:
    (
      riderId:
        string,
      documentId:
        string,
      payload:
        unknown,
    ) =>
      apiRequest(
        `/workforce/hub/riders/${encodeURIComponent(riderId)}/documents/${encodeURIComponent(documentId)}/reject`,
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  verifyVehicle:
    (
      vehicleId:
        string,
      payload:
        unknown = {},
    ) =>
      apiRequest(
        `/workforce/hub/vehicles/${encodeURIComponent(vehicleId)}/verify`,
        {
          method:
            "POST",

          body:
            payload,
        },
      ),

  rejectVehicle:
    (
      vehicleId:
        string,
      payload:
        unknown,
    ) =>
      apiRequest(
        `/workforce/hub/vehicles/${encodeURIComponent(vehicleId)}/reject`,
        {
          method:
            "POST",

          body:
            payload,
        },
      ),
};