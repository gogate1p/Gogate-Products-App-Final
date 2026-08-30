import { AuthenticatedUser } from './auth.types.js';
export declare class AuthPolicyService {
    assertTenantAccess(user: AuthenticatedUser, tenantId: string): void;
    assertHubAccess(user: AuthenticatedUser, hubId: string): void;
    assertRiderOwnership(user: AuthenticatedUser, riderProfileId: string): void;
}
