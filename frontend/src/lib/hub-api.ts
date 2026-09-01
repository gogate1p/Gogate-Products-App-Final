const API =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

function getToken() {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "gogate_access_token",
  );
}

export function selectedHubId() {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "gogate_hub_id",
  );
}

export function selectHub(
  id: string,
) {
  localStorage.setItem(
    "gogate_hub_id",
    id,
  );
}

export function logoutHub() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    "gogate_access_token",
  );

  localStorage.removeItem(
    "gogate_hub_id",
  );

  window.location.href =
    "/portal/hub/login";
}

async function request<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers =
    new Headers(
      options.headers,
    );

  if (
    options.body &&
    !headers.has(
      "Content-Type",
    )
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const token =
    getToken();

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const hubId =
    selectedHubId();

  if (hubId) {
    headers.set(
      "X-Hub-Id",
      hubId,
    );
  }

  const response =
    await fetch(
      `${API}${path}`,
      {
        ...options,
        headers,
        cache:
          "no-store",
      },
    );

  const type =
    response.headers.get(
      "content-type",
    );

  let body: any;

  if (
    type?.includes(
      "application/json",
    )
  ) {
    body =
      await response.json();
  } else {
    body =
      await response.text();
  }

  if (
    response.status === 401
  ) {
    if (
      typeof window !==
      "undefined"
    ) {
      localStorage.removeItem(
        "gogate_access_token",
      );
    }

    throw new Error(
      "Session expired. Please login again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      body?.message ??
      body?.error ??
      String(body) ??
      `Request failed (${response.status})`,
    );
  }

  return body as T;
}

export const HubApi = {
  hubs() {
    return request<any[]>(
      "/hub-ops/hubs",
    );
  },

  me() {
    return request(
      "/hub-ops/me",
    );
  },

  dashboard() {
    return request(
      "/hub-ops/dashboard",
    );
  },

  inbound() {
    return request(
      "/hub-ops/inbound",
    );
  },

  outbound() {
    return request(
      "/hub-ops/outbound",
    );
  },

  manifests() {
    return request(
      "/hub-ops/manifests",
    );
  },

  bags() {
    return request(
      "/hub-ops/bags",
    );
  },

  capacity() {
    return request(
      "/hub-ops/capacity",
    );
  },

  exceptions() {
    return request(
      "/hub-ops/exceptions",
    );
  },

  riders() {
    return request(
      "/hub-ops/riders",
    );
  },

  createRider(
    data: any,
  ) {
    return request(
      "/hub-ops/riders",
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

  updateLocation(
    lat: number,
    lng: number,
  ) {
    return request(
      "/hub-ops/location",
      {
        method:
          "PATCH",

        body:
          JSON.stringify({
            lat,
            lng,
          }),
      },
    );
  },

  pendingKyc() {
    return request(
      "/workforce/hub/kyc/pending",
    );
  },

  riderKyc(
    riderId: string,
  ) {
    return request(
      `/workforce/hub/riders/${riderId}/kyc`,
    );
  },

  approveKyc(
    riderId: string,
  ) {
    return request(
      `/workforce/hub/riders/${riderId}/kyc/approve`,
      {
        method:
          "POST",
      },
    );
  },

  rejectKyc(
    riderId: string,
    reason: string,
  ) {
    return request(
      `/workforce/hub/riders/${riderId}/kyc/reject`,
      {
        method:
          "POST",

        body:
          JSON.stringify({
            reason,
          }),
      },
    );
  },

  verifyVehicle(
    id: string,
  ) {
    return request(
      `/workforce/hub/vehicles/${id}/verify`,
      {
        method:
          "POST",
      },
    );
  },

  rejectVehicle(
    id: string,
    reason: string,
  ) {
    return request(
      `/workforce/hub/vehicles/${id}/reject`,
      {
        method:
          "POST",

        body:
          JSON.stringify({
            reason,
          }),
      },
    );
  },

  scan(
    data: any,
  ) {
    return request(
      "/packages/scan",
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