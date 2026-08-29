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

@Module({
  imports: [PrismaModule, AuthModule, TenantsModule, UsersModule, HubsModule, OrdersModule, ShipmentsModule, RunsheetsModule, EventsModule, PackagesModule, WorkforceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
