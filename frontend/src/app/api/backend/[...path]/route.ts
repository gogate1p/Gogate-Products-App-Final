import {
  NextRequest,
  NextResponse,
} from "next/server";

function backendBase() {
  const local =
    process.env.BACKEND_URL?.trim();

  const production =
    process.env.BACKEND_PRODUCTION_URL?.trim();

  if (
    local &&
    local !== "http://localhost:3000"
  ) {
    return local.replace(/\/$/, "");
  }

  if (
    process.env.NODE_ENV === "production" &&
    production
  ) {
    return production.replace(/\/$/, "");
  }

  return (
    local ||
    production ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

async function proxy(
  req: NextRequest,
  context: {
    params:
      Promise<{
        path: string[];
      }>;
  },
) {
  const {
    path,
  } =
    await context.params;

  const upstream =
    new URL(
      `${backendBase()}/${path.join("/")}`,
    );

  req.nextUrl.searchParams.forEach(
    (value, key) => {
      upstream.searchParams.append(
        key,
        value,
      );
    },
  );

  const headers =
    new Headers();

  const contentType =
    req.headers.get(
      "content-type",
    );

  if (contentType) {
    headers.set(
      "content-type",
      contentType,
    );
  }

  const authorization =
    req.headers.get(
      "authorization",
    );

  if (authorization) {
    headers.set(
      "authorization",
      authorization,
    );
  }

  const tenantId =
    req.headers.get(
      "x-tenant-id",
    );

  if (tenantId) {
    headers.set(
      "x-tenant-id",
      tenantId,
    );
  }

  const init:
    RequestInit = {
      method:
        req.method,

      headers,

      cache:
        "no-store",
    };

  if (
    ![
      "GET",
      "HEAD",
    ].includes(req.method)
  ) {
    init.body =
      await req.arrayBuffer();
  }

  try {
    const response =
      await fetch(
        upstream,
        init,
      );

    const body =
      await response.arrayBuffer();

    const outgoing =
      new Headers();

    const upstreamType =
      response.headers.get(
        "content-type",
      );

    if (upstreamType) {
      outgoing.set(
        "content-type",
        upstreamType,
      );
    }

    return new NextResponse(
      body,
      {
        status:
          response.status,

        headers:
          outgoing,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        error:
          "BACKEND_UNAVAILABLE",

        message:
          error instanceof Error
            ? error.message
            : String(error),

        upstream:
          backendBase(),
      },
      {
        status: 502,
      },
    );
  }
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as HEAD,
};