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

export type KycStatus =
  | "NOT_STARTED"
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "DOCUMENTS_PENDING"
  | "VERIFIED"
  | "REJECTED";

export const portalRouteByRole: Record<PortalRole, string> = {
  CUSTOMER: "/portal/customer",
  MERCHANT: "/portal/merchant",
  SHIPPER: "/portal/shipper",
  HUB_MANAGER: "/portal/hub",
  HUB_PERSONNEL: "/portal/staff",
  DISPATCHER: "/portal/dispatcher",
  OPERATIONS_MANAGER: "/portal/admin",
  SUPPORT: "/portal/support",
  WAREHOUSE: "/portal/wms",
  ADMIN: "/portal/admin",
  SUPER_ADMIN: "/portal/admin",
};

export function businessKycRequired(role: PortalRole) {
  return role === "MERCHANT" || role === "SHIPPER";
}

export function businessPortalEnabled(
  role: PortalRole,
  status?: KycStatus,
) {
  if (!businessKycRequired(role)) return true;

  return status === "VERIFIED";
}