import { AssignmentDto } from "../../../../application/dto/AssignmentDto";
import { AssignmentMapper } from "../../../../application/mapper/AssignmentMapper";
import { Assignment } from "../../../../domain/entity/Assignament";


describe("AssignmentMapper", () => {
  it("should correctly map an Assignment entity to an AssignmentDto", () => {
    const assignment = {
      assignmentId: "123",
      shipmentId: "456",
      driverId: "789",
      assignedAt: new Date("2024-02-09T12:00:00.000Z"), 
      score: 85,
    } as Assignment;

    const assignmentDto = AssignmentMapper.toDto(assignment);

    expect(assignmentDto).toBeInstanceOf(AssignmentDto);
    expect(assignmentDto.assignmentId).toBe("123");
    expect(assignmentDto.shipmentId).toBe("456");
    expect(assignmentDto.driverId).toBe("789");
    expect(assignmentDto.assignedAt).toBe("2024-02-09T12:00:00.000Z");
    expect(assignmentDto.score).toBe(85);
  });

  it("should throw an error if assignment entity is missing required fields", () => {
    expect(() => {
      AssignmentMapper.toDto(null as unknown as Assignment);
    }).toThrow();
  });
});
