export type PortalRole =
  | "CUSTOMER"
  | "MERCHANT"
  | "SHIPPER"
  | "HUB_MANAGER"
  | "HUB_PERSONNEL"
  | "DISPATCHER"
  | "OPERATIONS_MANAGER"
  | "SUPPORT"
  | "WAREHOUSE"
  | "ADMIN"
  | "SUPER_ADMIN";

export function saveSession(
  token:
    string,
  tenantId?:
    string,
  role?:
    PortalRole,
) {
  localStorage.setItem(
    "gogate_token",
    token,
  );

  if (tenantId) {
    localStorage.setItem(
      "gogate_tenant_id",
      tenantId,
    );
  }

  if (role) {
    localStorage.setItem(
      "gogate_role",
      role,
    );
  }
}

export function clearSession() {
  localStorage.removeItem(
    "gogate_token",
  );

  localStorage.removeItem(
    "gogate_tenant_id",
  );

  localStorage.removeItem(
    "gogate_role",
  );
}

export function roleHome(
  role:
    PortalRole,
) {
  const map:
    Record<
      PortalRole,
      string
    > = {
      CUSTOMER:
        "/portal/customer",

      MERCHANT:
        "/portal/merchant",

      SHIPPER:
        "/portal/shipper",

      HUB_MANAGER:
        "/portal/hub",

      HUB_PERSONNEL:
        "/portal/staff",

      DISPATCHER:
        "/portal/dispatcher",

      OPERATIONS_MANAGER:
        "/portal/admin",

      SUPPORT:
        "/portal/support",

      WAREHOUSE:
        "/portal/wms",

      ADMIN:
        "/portal/admin",

      SUPER_ADMIN:
        "/portal/admin",
    };

  return map[role];
}