const API =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export function branchToken() {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "gogate_branch_token",
  );
}

export function branchId() {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "gogate_branch_id",
  );
}

export function selectBranch(
  id: string,
) {
  localStorage.setItem(
    "gogate_branch_id",
    id,
  );
}

export function branchLogout() {
  localStorage.removeItem(
    "gogate_branch_token",
  );

  localStorage.removeItem(
    "gogate_branch_id",
  );

  window.location.href =
    "/portal/branch/login";
}

async function request<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers =
    new Headers(
      options.headers,
    );

  if (options.body) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const token =
    branchToken();

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const selected =
    branchId();

  if (selected) {
    headers.set(
      "X-Branch-Id",
      selected,
    );
  }

  const response =
    await fetch(
      `${API}${path}`,
      {
        ...options,
        headers,
        cache: "no-store",
      },
    );

  const contentType =
    response.headers.get(
      "content-type",
    );

  const body =
    contentType?.includes(
      "application/json",
    )
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    throw new Error(
      body?.message ??
      body?.error ??
      String(body),
    );
  }

  return body as T;
}

export const BranchApi = {
  async login(
    loginId: string,
    password: string,
  ) {
    const result:
      any =
      await request(
        "/branch-ops/login",
        {
          method: "POST",

          body:
            JSON.stringify({
              loginId,
              password,
            }),
        },
      );

    localStorage.setItem(
      "gogate_branch_token",
      result.accessToken,
    );

    return result;
  },

  me() {
    return request(
      "/branch-ops/me",
    );
  },

  branches() {
    return request(
      "/branch-ops/branches",
    );
  },

  createBranch(
    data: any,
  ) {
    return request(
      "/branch-ops/branches",
      {
        method: "POST",
        body:
          JSON.stringify(data),
      },
    );
  },

  dashboard() {
    return request(
      "/branch-ops/dashboard",
    );
  },

  pickups() {
    return request(
      "/branch-ops/pickups",
    );
  },

  createPickup(
    data: any,
  ) {
    return request(
      "/branch-ops/pickups",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      },
    );
  },

  shipments() {
    return request(
      "/branch-ops/shipments",
    );
  },

  createShipment(
    data: any,
  ) {
    return request(
      "/branch-ops/shipments",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      },
    );
  },

  users() {
    return request(
      "/branch-ops/users",
    );
  },

  createUser(
    data: any,
  ) {
    return request(
      "/branch-ops/users",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      },
    );
  },
};