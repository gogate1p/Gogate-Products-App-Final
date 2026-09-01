import {
  portalRequest,
} from "@/lib/portal-auth";

export type AdminUser = {
  id: string;
  userCode?: string | null;
  userId?: string | null;
  role: string;
  phone: string;
  email?: string | null;
  status: string;
  mustChangePassword?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export const AdminUsersApi = {
  list() {
    return portalRequest<AdminUser[]>(
      "/portal-auth/admin/users",
    );
  },

  create(data: {
    phone: string;
    email?: string;
    role: string;
  }) {
    return portalRequest(
      "/portal-auth/admin/users",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      },
    );
  },

  resetPassword(
    id: string,
  ) {
    return portalRequest(
      `/portal-auth/admin/users/${id}/reset-password`,
      {
        method: "POST",
      },
    );
  },

  deactivate(
    id: string,
  ) {
    return portalRequest(
      `/portal-auth/admin/users/${id}/deactivate`,
      {
        method: "PATCH",
      },
    );
  },
};