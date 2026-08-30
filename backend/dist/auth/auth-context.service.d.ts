import { AuthenticatedUser } from './auth.types.js';
export declare class AuthContextService {
    private readonly logger;
    private currentUser;
    setCurrentUser(user: AuthenticatedUser | null): void;
    getCurrentUser(): AuthenticatedUser | null;
    requireUser(): AuthenticatedUser;
    assertTenantAccess(tenantId: string, user?: AuthenticatedUser): void;
    assertHubAccess(hubId: string, user?: AuthenticatedUser): void;
    assertRiderOwnership(riderProfileId: string, user?: AuthenticatedUser): void;
    assertRole(allowedRoles: string[], user?: AuthenticatedUser): void;
}
