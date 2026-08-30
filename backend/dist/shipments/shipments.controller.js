var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';
let ShipmentsController = class ShipmentsController {
    shipmentsService;
    constructor(shipmentsService) {
        this.shipmentsService = shipmentsService;
    }
    async createShipment(body) {
        return this.shipmentsService.createShipment(body);
    }
    async trackShipment(awb) {
        return this.shipmentsService.trackShipment(awb);
    }
    async markOutForDelivery(id, riderId) {
        return this.shipmentsService.markOutForDelivery(id, riderId);
    }
    async markDelivered(id, riderId, lat, lng) {
        return this.shipmentsService.markDelivered(id, riderId, lat, lng);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "createShipment", null);
__decorate([
    Get(':awb/track'),
    __param(0, Param('awb')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "trackShipment", null);
__decorate([
    Patch(':id/out-for-delivery'),
    __param(0, Param('id')),
    __param(1, Body('riderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "markOutForDelivery", null);
__decorate([
    Patch(':id/deliver'),
    __param(0, Param('id')),
    __param(1, Body('riderId')),
    __param(2, Body('lat')),
    __param(3, Body('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "markDelivered", null);
ShipmentsController = __decorate([
    Controller('shipments'),
    __metadata("design:paramtypes", [ShipmentsService])
], ShipmentsController);
export { ShipmentsController };
//# sourceMappingURL=shipments.controller.js.map