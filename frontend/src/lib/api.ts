const API =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "gogate_access_token",
  );
}

export function setAccessToken(
  token: string,
) {
  localStorage.setItem(
    "gogate_access_token",
    token,
  );
}

export function clearAccessToken() {
  localStorage.removeItem(
    "gogate_access_token",
  );
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    getAccessToken();

  const headers =
    new Headers(
      options.headers,
    );

  if (
    !headers.has(
      "Content-Type",
    ) &&
    options.body
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
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

  let body: any = null;

  const type =
    response.headers.get(
      "content-type",
    );

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

  if (!response.ok) {
    throw new Error(
      body?.message ||
      body?.error ||
      `API request failed (${response.status})`,
    );
  }

  return body as T;
}

export const api = {
  get<T = any>(
    path: string,
  ) {
    return apiFetch<T>(
      path,
    );
  },

  post<T = any>(
    path: string,
    data?: unknown,
  ) {
    return apiFetch<T>(
      path,
      {
        method: "POST",
        body:
          data === undefined
            ? undefined
            : JSON.stringify(
                data,
              ),
      },
    );
  },

  patch<T = any>(
    path: string,
    data?: unknown,
  ) {
    return apiFetch<T>(
      path,
      {
        method: "PATCH",
        body:
          data === undefined
            ? undefined
            : JSON.stringify(
                data,
              ),
      },
    );
  },

  delete<T = any>(
    path: string,
  ) {
    return apiFetch<T>(
      path,
      {
        method:
          "DELETE",
      },
    );
  },
};