import { Assignment } from "../../domain/entity/Assignament";
import { AssignmentDto } from "../dto/AssignmentDto";

/**
 * Mapper para transformar una entidad Assignment en un AssignmentDto.
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
