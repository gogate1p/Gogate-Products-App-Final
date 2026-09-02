import { HubRoutingModule } from './hub-routing/hub-routing.module.js';
import { PublicTrackingModule } from './public-tracking/public-tracking.module.js';
import { CustomerTrackingModule } from './customer-tracking/customer-tracking.module.js';
import { ShipmentWorkflowModule } from './shipment-workflow/shipment-workflow.module.js';
import { CustomerShipmentDetailModule } from './customer-shipment-detail/customer-shipment-detail.module.js';
import { TrackingModule } from './tracking/tracking.module.js';
import { CustomerPortalModule } from './customer-portal/customer-portal.module.js';
import { PublicSignupModule } from './public-signup/public-signup.module.js';
import { AssignmentModule } from './assignments/assignment.module.js';
import { PortalAuthModule } from './portal-auth/portal-auth.module.js';
import { BranchOpsModule } from './branch-ops/branch-ops.module.js';
import { PidgeModule } from './integrations/pidge/pidge.module.js';
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
import { HubOpsModule } from './hub-ops/hub-ops.module.js';
import { TruckDriverModule } from './truck-driver/truck-driver.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';

@Module({
  imports: [PidgeModule, PrismaModule, AuthModule, TenantsModule, UsersModule, HubsModule, OrdersModule, ShipmentsModule, RunsheetsModule, EventsModule, PackagesModule, WorkforceModule, TruckDriverModule, HubOpsModule, BranchOpsModule, PortalAuthModule, AssignmentModule, PublicSignupModule, CustomerPortalModule, TrackingModule, CustomerShipmentDetailModule, ShipmentWorkflowModule, CustomerTrackingModule, PublicTrackingModule, HubRoutingModule, PaymentsModule, RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
