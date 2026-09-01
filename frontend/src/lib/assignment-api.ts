import {
  portalRequest,
} from "@/lib/portal-auth";

export type Assignment = {
  id: string;
  userId: string;
  scopeType: string;
  scopeId?: string | null;
  scopeCode?: string | null;
  scopeName?: string | null;
  region?: string | null;
  permissions?: string[];
  isPrimary: boolean;
  status: string;
  createdAt: string;
};

export const AssignmentApi = {
  list() {
    return portalRequest<Assignment[]>(
      "/assignments",
    );
  },

  scopes() {
    return portalRequest(
      "/assignments/admin/scopes",
    );
  },

  create(
    data: any,
  ) {
    return portalRequest(
      "/assignments",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      },
    );
  },

  deactivate(
    id: string,
  ) {
    return portalRequest(
      `/assignments/${id}/deactivate`,
      {
        method:
          "PATCH",
      },
    );
  },

  mine() {
    return portalRequest(
      "/assignments/me/current",
    );
  },
};