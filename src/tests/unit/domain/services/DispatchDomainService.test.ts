
import { Assignment } from "../../../../domain/entity/Assignament";
import { DomainError } from "../../../../domain/exceptions/DomainError";
import { AssignmentCriteria, DispatchDomainService, DriverCandidate, ShipmentAssignmentInput } from "../../../../domain/service/DispatchDomainService";


describe("DispatchDomainService", () => {
  let service: DispatchDomainService;

  beforeEach(() => {
    service = new DispatchDomainService();
  });

  it("should assign a shipment to the best driver", () => {
    const shipment: ShipmentAssignmentInput = {
      shipmentId: "SHIP123",
      origin: "A",
      destination: "B",
      depositDate: new Date(),
    };

    const candidates: DriverCandidate[] = [
      {
        driverStatusId: "S1",
        driverId: "D1",
        vehicleType: "Truck",
        totalCapacity: 1000,
        averageSpeed: 60,       
        averageConsump: 0.1,      
        availableCapacity: 500,
        currentLocation: "A",
        transportState: "available",
        longCoordinate: 0,
        latCoordinate: 0,
        currentGridZone: "Zone1",
        lastUpdated: new Date().toISOString(),
      },
      {
        driverStatusId: "S2",
        driverId: "D2",
        vehicleType: "Truck",
        totalCapacity: 1000,
        averageSpeed: 80,   
        averageConsump: 0.2, 
        availableCapacity: 500,
        currentLocation: "A",
        transportState: "available",
        longCoordinate: 0,
        latCoordinate: 0,
        currentGridZone: "Zone1",
        lastUpdated: new Date().toISOString(),
      },
    ];

    const criteria: AssignmentCriteria = {
      timeWeight: 0.7,
      costWeight: 0.3,
      fuelPrice: 1.2,
    };

    const assignment = service.assignShipment(shipment, candidates, criteria);

    expect(assignment).toBeInstanceOf(Assignment);
    expect(assignment.shipmentId).toBe("SHIP123");
  });

  it("should throw an error if no candidates are available", () => {
    const shipment: ShipmentAssignmentInput = {
      shipmentId: "SHIP123",
      origin: "A",
      destination: "B",
      depositDate: new Date(),
    };

    const candidates: DriverCandidate[] = [];

    const criteria: AssignmentCriteria = {
      timeWeight: 0.7,
      costWeight: 0.3,
      fuelPrice: 1.2,
    };

    expect(() => service.assignShipment(shipment, candidates, criteria)).toThrow(DomainError);
  });

  it("should throw an error if no optimal driver is found", () => {
    const shipment: ShipmentAssignmentInput = {
      shipmentId: "SHIP123",
      origin: "A",
      destination: "B",
      depositDate: new Date(),
    };

    const candidates: DriverCandidate[] = [
      {
        driverStatusId: "S3",
        driverId: "D1",
        vehicleType: "Truck",
        totalCapacity: 1000,
        averageSpeed: 0,        
        averageConsump: 100,  
        availableCapacity: 500,
        currentLocation: "A",
        transportState: "available",
        longCoordinate: 0,
        latCoordinate: 0,
        currentGridZone: "Zone1",
        lastUpdated: new Date().toISOString(),
      },
    ];

    const criteria: AssignmentCriteria = {
      timeWeight: 0.7,
      costWeight: 0.3,
      fuelPrice: 1.2,
    };

    expect(() => service.assignShipment(shipment, candidates, criteria)).toThrow(DomainError);
  });
});
