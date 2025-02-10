import { Assignment } from "../../domain/entity/Assignament";
import { AssignmentDto } from "../dto/AssignmentDto";

/**
 * Mapper to transform an Assignment domain entity into an AssignmentDto.
 */
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
