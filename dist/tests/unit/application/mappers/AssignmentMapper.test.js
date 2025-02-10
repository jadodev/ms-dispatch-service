"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AssignmentDto_1 = require("../../../../application/dto/AssignmentDto");
const AssignmentMapper_1 = require("../../../../application/mapper/AssignmentMapper");
describe("AssignmentMapper", () => {
    it("should correctly map an Assignment entity to an AssignmentDto", () => {
        const assignment = {
            assignmentId: "123",
            shipmentId: "456",
            driverId: "789",
            assignedAt: new Date("2024-02-09T12:00:00.000Z"),
            score: 85,
        };
        const assignmentDto = AssignmentMapper_1.AssignmentMapper.toDto(assignment);
        expect(assignmentDto).toBeInstanceOf(AssignmentDto_1.AssignmentDto);
        expect(assignmentDto.assignmentId).toBe("123");
        expect(assignmentDto.shipmentId).toBe("456");
        expect(assignmentDto.driverId).toBe("789");
        expect(assignmentDto.assignedAt).toBe("2024-02-09T12:00:00.000Z");
        expect(assignmentDto.score).toBe(85);
    });
    it("should throw an error if assignment entity is missing required fields", () => {
        expect(() => {
            AssignmentMapper_1.AssignmentMapper.toDto(null);
        }).toThrow();
    });
});
