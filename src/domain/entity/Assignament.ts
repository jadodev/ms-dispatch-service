import { DomainError } from "../exceptions/DomainError";

export class Assignment {
  public readonly assignmentId: string;
  public readonly shipmentId: string;
  public readonly driverId: string;
  public readonly assignedAt: Date;
  public readonly score: number;

  private constructor(
    assignmentId: string,
    shipmentId: string,
    driverId: string,
    assignedAt: Date,
    score: number
  ) {
    if (!assignmentId) {
      throw new DomainError("AssignmentId cannot be null or empty.");
    }
    if (!shipmentId) {
      throw new DomainError("ShipmentId is required for an assignment.");
    }
    if (!driverId) {
      throw new DomainError("DriverId is required for an assignment.");
    }
    if (score < 0) {
      throw new DomainError("Score cannot be negative.");
    }
    this.assignmentId = assignmentId;
    this.shipmentId = shipmentId;
    this.driverId = driverId;
    this.assignedAt = assignedAt;
    this.score = score;
  }

  public static create(
    shipmentId: string,
    driverId: string,
    score: number
  ): Assignment {
    const assignmentId = `AS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return new Assignment(assignmentId, shipmentId, driverId, new Date(), score);
  }

  public toString(): string {
    return `Assignment { assignmentId: ${this.assignmentId}, shipmentId: ${this.shipmentId}, driverId: ${this.driverId}, assignedAt: ${this.assignedAt.toISOString()}, score: ${this.score} }`;
  }
}
