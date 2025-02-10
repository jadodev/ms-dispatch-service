/**
 * DTO que representa la asignación de un shipment a un conductor.
 */

export class AssignmentDto {
    assignmentId: string;
    shipmentId: string;
    driverId: string;
    assignedAt: string;
    score: number;
  
    constructor(data: {
      assignmentId: string;
      shipmentId: string;
      driverId: string;
      assignedAt: string;
      score: number;
    }) {
      this.assignmentId = data.assignmentId;
      this.shipmentId = data.shipmentId;
      this.driverId = data.driverId;
      this.assignedAt = data.assignedAt;
      this.score = data.score;
    }
  }
  