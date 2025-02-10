"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchDomainService = void 0;
const Assignament_1 = require("../entity/Assignament");
const DomainError_1 = require("../exceptions/DomainError");
/**
 * DispatchDomainService encapsula la lógica de negocio para asignar un shipment a un conductor.
 */
class DispatchDomainService {
    assignShipment(shipment, candidates, criteria) {
        if (candidates.length === 0) {
            throw new DomainError_1.DomainError("No driver candidates available for assignment.");
        }
        let bestScore = Number.POSITIVE_INFINITY;
        let selectedCandidate = null;
        const timeWeight = criteria.timeWeight || 1;
        const costWeight = criteria.costWeight || 1;
        const fuelPrice = criteria.fuelPrice || 1;
        const calculateDistance = (locA, locB) => {
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
            throw new DomainError_1.DomainError("Unable to determine an optimal driver candidate.");
        }
        return Assignament_1.Assignment.create(shipment.shipmentId, selectedCandidate.driverId, bestScore);
    }
}
exports.DispatchDomainService = DispatchDomainService;
