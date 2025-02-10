"use strict";
/**
 * DTO para la creación de una asignación.
 * Contiene la información necesaria del shipment y los criterios para evaluar los candidatos.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssignmentDto = void 0;
class CreateAssignmentDto {
    constructor(data) {
        if (!data.shipmentId)
            throw new Error("shipmentId is required.");
        if (!data.origin)
            throw new Error("origin is required.");
        if (!data.destination)
            throw new Error("destination is required.");
        if (!data.depositDate)
            throw new Error("depositDate is required.");
        if (data.timeWeight === undefined || data.timeWeight === null)
            throw new Error("timeWeight is required.");
        if (data.costWeight === undefined || data.costWeight === null)
            throw new Error("costWeight is required.");
        if (data.fuelPrice === undefined || data.fuelPrice === null)
            throw new Error("fuelPrice is required.");
        this.shipmentId = data.shipmentId;
        this.origin = data.origin;
        this.destination = data.destination;
        this.depositDate = data.depositDate;
        this.timeWeight = data.timeWeight;
        this.costWeight = data.costWeight;
        this.fuelPrice = data.fuelPrice;
    }
}
exports.CreateAssignmentDto = CreateAssignmentDto;
