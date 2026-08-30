var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { UsersModule } from './users/users.module.js';
import { HubsModule } from './hubs/hubs.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';
import { RunsheetsModule } from './runsheets/runsheets.module.js';
import { EventsModule } from './events/events.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { WorkforceModule } from './workforce/workforce.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [PrismaModule, AuthModule, TenantsModule, UsersModule, HubsModule, OrdersModule, ShipmentsModule, RunsheetsModule, EventsModule, PackagesModule, WorkforceModule],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map