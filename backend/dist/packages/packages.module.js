var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EventsModule } from '../events/events.module.js';
import { PackageScanningService } from './package-scanning.service.js';
import { ScanResolverService } from './scan-resolver.service.js';
import { PackagesController } from './packages.controller.js';
let PackagesModule = class PackagesModule {
};
PackagesModule = __decorate([
    Module({
        imports: [PrismaModule, EventsModule],
        controllers: [PackagesController],
        providers: [PackageScanningService, ScanResolverService],
        exports: [PackageScanningService, ScanResolverService],
    })
], PackagesModule);
export { PackagesModule };
//# sourceMappingURL=packages.module.js.map