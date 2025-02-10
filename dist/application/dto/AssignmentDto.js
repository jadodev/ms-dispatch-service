"use strict";
/**
 * DTO que representa la asignación de un shipment a un conductor.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentDto = void 0;
class AssignmentDto {
    constructor(data) {
        this.assignmentId = data.assignmentId;
        this.shipmentId = data.shipmentId;
        this.driverId = data.driverId;
        this.assignedAt = data.assignedAt;
        this.score = data.score;
    }
}
exports.AssignmentDto = AssignmentDto;
