import { TenantsService } from './tenants.service.js';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    createTenant(body: {
        name: string;
        domain?: string;
        config?: any;
    }): Promise<{
        id: string;
        name: string;
        domain: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllTenants(): Promise<{
        id: string;
        name: string;
        domain: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTenantById(id: string): Promise<{
        id: string;
        name: string;
        domain: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
