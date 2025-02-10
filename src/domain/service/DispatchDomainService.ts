import { Assignment } from "../entity/Assignament";
import { DomainError } from "../exceptions/DomainError";

/**
 * Define los datos relevantes del shipment para la asignación.
 */
export interface ShipmentAssignmentInput {
  shipmentId: string;
  origin: string;
  destination: string;
  depositDate: Date;
  // Otros campos relevantes pueden agregarse aquí.
}

/**
 * Representa la información de un candidato (conductor y vehículo) obtenida de Driver Operations.
 */
export interface DriverCandidate {
  driverStatusId: string;
  driverId: string;
  vehicleType: string;
  totalCapacity: number;
  averageSpeed: number;
  averageConsump: number; 
  availableCapacity: number;
  currentLocation: string;
  transportState: string;
  longCoordinate: number;
  latCoordinate: number;
  currentGridZone: string;
  lastUpdated: string;
}

/**
 * Criterios y pesos para la función objetivo de asignación.
 */
export interface AssignmentCriteria {
  timeWeight: number;
  costWeight: number;
  fuelPrice: number;
}

/**
 * DispatchDomainService encapsula la lógica de negocio para asignar un shipment a un conductor.
 */
export class DispatchDomainService {
  public assignShipment(
    shipment: ShipmentAssignmentInput,
    candidates: DriverCandidate[],
    criteria: AssignmentCriteria
  ): Assignment {
    if (candidates.length === 0) {
      throw new DomainError("No driver candidates available for assignment.");
    }

    let bestScore = Number.POSITIVE_INFINITY;
    let selectedCandidate: DriverCandidate | null = null;

    const timeWeight = criteria.timeWeight || 1;
    const costWeight = criteria.costWeight || 1;
    const fuelPrice = criteria.fuelPrice || 1;

    const calculateDistance = (locA: string, locB: string): number => {
      return Math.floor(Math.random() * 200) + 1;
    };

    const distanceOriginToDestination = calculateDistance(shipment.origin, shipment.destination);

    for (const candidate of candidates) {
      const distanceToOrigin = calculateDistance(candidate.currentLocation, shipment.origin);

      const timeToOrigin = distanceToOrigin / candidate.averageSpeed;
      const timeOriginToDestination = distanceOriginToDestination / candidate.averageSpeed;
      const additionalTime = 0.5; 
      const totalTime = timeToOrigin + timeOriginToDestination + additionalTime;

      const totalDistance = distanceToOrigin + distanceOriginToDestination;
      const fuelCost = totalDistance * candidate.averageConsump * fuelPrice;
      const fixedCost = 10; 
      const totalCost = fuelCost + fixedCost;

      const score = timeWeight * totalTime + costWeight * totalCost;

      if (score < bestScore) {
        bestScore = score;
        selectedCandidate = candidate;
      }
    }

    if (!selectedCandidate) {
      throw new DomainError("Unable to determine an optimal driver candidate.");
    }

    return Assignment.create(shipment.shipmentId, selectedCandidate.driverId, bestScore);
  }
}
