var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let TenantsService = class TenantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTenant(name, domain, config) {
        return this.prisma.tenant.create({
            data: {
                name,
                domain,
                config: config || {},
            },
        });
    }
    async getAllTenants() {
        return this.prisma.tenant.findMany();
    }
    async getTenantById(id) {
        return this.prisma.tenant.findUnique({ where: { id } });
    }
};
TenantsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TenantsService);
export { TenantsService };
//# sourceMappingURL=tenants.service.js.map