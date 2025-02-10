"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assignament_1 = require("../../../../domain/entity/Assignament");
const DomainError_1 = require("../../../../domain/exceptions/DomainError");
const DispatchDomainService_1 = require("../../../../domain/service/DispatchDomainService");
describe("DispatchDomainService", () => {
    let service;
    beforeEach(() => {
        service = new DispatchDomainService_1.DispatchDomainService();
    });
    it("should assign a shipment to the best driver", () => {
        const shipment = {
            shipmentId: "SHIP123",
            origin: "A",
            destination: "B",
            depositDate: new Date(),
        };
        const candidates = [
            {
                driverStatusId: "S1",
                driverId: "D1",
                vehicleType: "Truck",
                totalCapacity: 1000,
                averageSpeed: 60,
                averageConsump: 0.1,
                availableCapacity: 500,
                currentLocation: "A",
                transportState: "available",
                longCoordinate: 0,
                latCoordinate: 0,
                currentGridZone: "Zone1",
                lastUpdated: new Date().toISOString(),
            },
            {
                driverStatusId: "S2",
                driverId: "D2",
                vehicleType: "Truck",
                totalCapacity: 1000,
                averageSpeed: 80,
                averageConsump: 0.2,
                availableCapacity: 500,
                currentLocation: "A",
                transportState: "available",
                longCoordinate: 0,
                latCoordinate: 0,
                currentGridZone: "Zone1",
                lastUpdated: new Date().toISOString(),
            },
        ];
        const criteria = {
            timeWeight: 0.7,
            costWeight: 0.3,
            fuelPrice: 1.2,
        };
        const assignment = service.assignShipment(shipment, candidates, criteria);
        expect(assignment).toBeInstanceOf(Assignament_1.Assignment);
        expect(assignment.shipmentId).toBe("SHIP123");
    });
    it("should throw an error if no candidates are available", () => {
        const shipment = {
            shipmentId: "SHIP123",
            origin: "A",
            destination: "B",
            depositDate: new Date(),
        };
        const candidates = [];
        const criteria = {
            timeWeight: 0.7,
            costWeight: 0.3,
            fuelPrice: 1.2,
        };
        expect(() => service.assignShipment(shipment, candidates, criteria)).toThrow(DomainError_1.DomainError);
    });
    it("should throw an error if no optimal driver is found", () => {
        const shipment = {
            shipmentId: "SHIP123",
            origin: "A",
            destination: "B",
            depositDate: new Date(),
        };
        const candidates = [
            {
                driverStatusId: "S3",
                driverId: "D1",
                vehicleType: "Truck",
                totalCapacity: 1000,
                averageSpeed: 0,
                averageConsump: 100,
                availableCapacity: 500,
                currentLocation: "A",
                transportState: "available",
                longCoordinate: 0,
                latCoordinate: 0,
                currentGridZone: "Zone1",
                lastUpdated: new Date().toISOString(),
            },
        ];
        const criteria = {
            timeWeight: 0.7,
            costWeight: 0.3,
            fuelPrice: 1.2,
        };
        expect(() => service.assignShipment(shipment, candidates, criteria)).toThrow(DomainError_1.DomainError);
    });
});
