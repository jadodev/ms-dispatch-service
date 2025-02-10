"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const DomainError_1 = require("../exceptions/DomainError");
class Assignment {
    constructor(assignmentId, shipmentId, driverId, assignedAt, score) {
        if (!assignmentId) {
            throw new DomainError_1.DomainError("AssignmentId cannot be null or empty.");
        }
        if (!shipmentId) {
            throw new DomainError_1.DomainError("ShipmentId is required for an assignment.");
        }
        if (!driverId) {
            throw new DomainError_1.DomainError("DriverId is required for an assignment.");
        }
        if (score < 0) {
            throw new DomainError_1.DomainError("Score cannot be negative.");
        }
        this.assignmentId = assignmentId;
        this.shipmentId = shipmentId;
        this.driverId = driverId;
        this.assignedAt = assignedAt;
        this.score = score;
    }
    static create(shipmentId, driverId, score) {
        const assignmentId = `AS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        return new Assignment(assignmentId, shipmentId, driverId, new Date(), score);
    }
    toString() {
        return `Assignment { assignmentId: ${this.assignmentId}, shipmentId: ${this.shipmentId}, driverId: ${this.driverId}, assignedAt: ${this.assignedAt.toISOString()}, score: ${this.score} }`;
    }
}
exports.Assignment = Assignment;
