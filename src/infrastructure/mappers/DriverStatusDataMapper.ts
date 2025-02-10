import { AssignmentDto } from "../../application/dto/AssignmentDto";
import { Assignment } from "../../domain/entity/Assignament";

export class AssignmentMapper {
  public static toDto(assignment: Assignment): AssignmentDto {
    return new AssignmentDto({
      assignmentId: assignment.assignmentId,
      shipmentId: assignment.shipmentId,
      driverId: assignment.driverId,
      assignedAt: assignment.assignedAt.toISOString(),
      score: assignment.score,
    });
  }
}