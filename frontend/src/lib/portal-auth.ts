const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

export type PortalUser = {
  id: string;
  userId?: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  mustChangePassword?: boolean;
  redirectTo?: string;
};

export function accessToken() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return (
    localStorage.getItem(
      "gogate_access_token",
    ) ||
    localStorage.getItem(
      "gogate_branch_token",
    )
  );
}

export function refreshToken() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "gogate_refresh_token",
  );
}

export function clearPortalSession() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    "gogate_access_token",
  );

  localStorage.removeItem(
    "gogate_refresh_token",
  );

  localStorage.removeItem(
    "gogate_branch_token",
  );
}

async function parse(
  response:
    Response,
) {
  const contentType =
    response.headers.get(
      "content-type",
    );

  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    return response.json();
  }

  return response.text();
}

export async function portalRequest<T = any>(
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
    accessToken();

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  let response =
    await fetch(
      `${API}${path}`,
      {
        ...options,
        headers,
        cache:
          "no-store",
      },
    );

  if (
    response.status === 401 &&
    path !==
      "/portal-auth/refresh"
  ) {
    const refresh =
      refreshToken();

    if (refresh) {
      const refreshResponse =
        await fetch(
          `${API}/portal-auth/refresh`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                refreshToken:
                  refresh,
              }),
          },
        );

      if (
        refreshResponse.ok
      ) {
        const tokens =
          await refreshResponse.json();

        localStorage.setItem(
          "gogate_access_token",
          tokens.accessToken,
        );

        headers.set(
          "Authorization",
          `Bearer ${tokens.accessToken}`,
        );

        response =
          await fetch(
            `${API}${path}`,
            {
              ...options,
              headers,
              cache:
                "no-store",
            },
          );
      }
    }
  }

  const body =
    await parse(
      response,
    );

  if (!response.ok) {
    if (
      response.status ===
      401
    ) {
      clearPortalSession();
    }

    throw new Error(
      body?.message ??
      body?.error ??
      String(body),
    );
  }

  return body as T;
}

export const PortalAuth = {
  async login(
    loginId: string,
    password: string,
  ) {
    const response =
      await fetch(
        `${API}/portal-auth/login`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              loginId,
              password,
            }),
        },
      );

    const body =
      await parse(
        response,
      );

    if (!response.ok) {
      throw new Error(
        body?.message ??
        "Login failed",
      );
    }

    localStorage.setItem(
      "gogate_access_token",
      body.accessToken,
    );

    localStorage.setItem(
      "gogate_refresh_token",
      body.refreshToken,
    );

    return body;
  },

  me() {
    return portalRequest<PortalUser>(
      "/portal-auth/me",
    );
  },

  changePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    return portalRequest(
      "/portal-auth/change-password",
      {
        method:
          "POST",

        body:
          JSON.stringify({
            currentPassword,
            newPassword,
          }),
      },
    );
  },

  async logout() {
    const refresh =
      refreshToken();

    try {
      await fetch(
        `${API}/portal-auth/logout`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              refreshToken:
                refresh,
            }),
        },
      );
    } finally {
      clearPortalSession();
    }
  },
};