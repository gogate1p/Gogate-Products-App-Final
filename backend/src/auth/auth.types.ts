export type AuthenticatedUser = {
  id: string;
  tenantId: string;
  role: string;
  hubId?: string;
  riderProfileId?: string;
  email?: string;
  name?: string;
};
