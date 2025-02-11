"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentMapper = void 0;
const AssignmentDto_1 = require("../dto/AssignmentDto");
/**
 * Mapper para transformar una entidad Assignment en un AssignmentDto.
 */
class AssignmentMapper {
    static toDto(assignment) {
        return new AssignmentDto_1.AssignmentDto({
            assignmentId: assignment.assignmentId,
            shipmentId: assignment.shipmentId,
            driverId: assignment.driverId,
            assignedAt: assignment.assignedAt.toISOString(),
            score: assignment.score,
        });
    }
}
exports.AssignmentMapper = AssignmentMapper;
