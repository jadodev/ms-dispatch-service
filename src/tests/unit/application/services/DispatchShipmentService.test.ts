import { CreateAssignmentDto } from "../../../../application/dto/CreateAssignmentDto";
import { AssignmentMapper } from "../../../../application/mapper/AssignmentMapper";
import { IAssignmentRepository } from "../../../../application/ports/out/IAssignmentRepository";
import { DispatchShipmentService } from "../../../../application/service/DispatchShipmentService";
import { DispatchDomainService } from "../../../../domain/service/DispatchDomainService";
import { EventPublisher } from "../../../../infrastructure/messaging/EventPublisher";

jest.mock("../../../../application/mapper/AssignmentMapper");

describe("DispatchShipmentService", () => {
  let dispatchShipmentService: DispatchShipmentService;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;
  let mockDispatchDomainService: jest.Mocked<DispatchDomainService>;
  let mockEventPublisher: jest.Mocked<EventPublisher>;

  const expectedAssignment = {
    assignmentId: "ASSIGN001",
    shipmentId: "SHIP001",
    driverId: "DRV001",
    assignedAt: new Date().toISOString(),
    score: 85,
  };

  const dto = new CreateAssignmentDto({
    shipmentId: "SHIP001",
    origin: "OriginA",
    destination: "DestinationB",
    depositDate: new Date().toISOString(),
    timeWeight: 0.5,
    costWeight: 0.5,
    fuelPrice: 1.2,
  });

  beforeEach(() => {
    mockAssignmentRepository = {
      save: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockDispatchDomainService = {
      assignShipment: jest.fn().mockResolvedValue(expectedAssignment),
    } as any;

    mockEventPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as any;

    dispatchShipmentService = new DispatchShipmentService(
      mockAssignmentRepository,
      mockDispatchDomainService,
      mockEventPublisher
    );

    (AssignmentMapper.toDto as jest.Mock).mockReset();
    (AssignmentMapper.toDto as jest.Mock).mockReturnValue(expectedAssignment);
  });

  it("should execute shipment dispatch and return an AssignmentDto (happy path)", async () => {
    jest.spyOn(dispatchShipmentService as any, "getDriverCandidates").mockResolvedValue([
      {
        driverId: "DRV001",
        currentLocation: "OriginA",
        speed: 60,
        consumptionPerKm: 0.1,
        additionalTime: 0.5,
        fixedCost: 10,
      },
    ]);

    const result = await dispatchShipmentService.execute(dto);

    expect(mockDispatchDomainService.assignShipment).toHaveBeenCalled();
    expect(AssignmentMapper.toDto).toHaveBeenCalled();


    const saveCallArg = mockAssignmentRepository.save.mock.calls[0][0];
    await expect(saveCallArg).resolves.toEqual(expectedAssignment);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith("dispatch.events", {
      event: "AssignmentCreated",
      payload: expectedAssignment,
    });
    expect(result).toEqual(expectedAssignment);
  });

  it("should throw error if assignmentRepository.save fails", async () => {
    const errorMessage = "Save failed";
    mockAssignmentRepository.save.mockRejectedValueOnce(new Error(errorMessage));

    jest.spyOn(dispatchShipmentService as any, "getDriverCandidates").mockResolvedValue([
      {
        driverId: "DRV001",
        currentLocation: "OriginA",
        speed: 60,
        consumptionPerKm: 0.1,
        additionalTime: 0.5,
        fixedCost: 10,
      },
    ]);

    await expect(dispatchShipmentService.execute(dto)).rejects.toThrow(errorMessage);
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw error if eventPublisher.publish fails", async () => {
    const errorMessage = "Publish failed";
    mockEventPublisher.publish.mockRejectedValueOnce(new Error(errorMessage));

    jest.spyOn(dispatchShipmentService as any, "getDriverCandidates").mockResolvedValue([
      {
        driverId: "DRV001",
        currentLocation: "OriginA",
        speed: 60,
        consumptionPerKm: 0.1,
        additionalTime: 0.5,
        fixedCost: 10,
      },
    ]);

    await expect(dispatchShipmentService.execute(dto)).rejects.toThrow(errorMessage);
  });

  it("should propagate error from assignShipment", async () => {
    const errorMessage = "assignShipment failed";
    (mockDispatchDomainService.assignShipment as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    mockAssignmentRepository.save.mockImplementationOnce(async (assignment) => {
      await assignment;
    });

    jest.spyOn(dispatchShipmentService as any, "getDriverCandidates").mockResolvedValue([
      {
        driverId: "DRV001",
        currentLocation: "OriginA",
        speed: 60,
        consumptionPerKm: 0.1,
        additionalTime: 0.5,
        fixedCost: 10,
      },
    ]);

    await expect(dispatchShipmentService.execute(dto)).rejects.toThrow(errorMessage);
  });

  it("should propagate error if getDriverCandidates fails", async () => {
    const errorMessage = "getDriverCandidates error";
    jest.spyOn(dispatchShipmentService as any, "getDriverCandidates").mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await expect(dispatchShipmentService.execute(dto)).rejects.toThrow(errorMessage);

    expect(mockDispatchDomainService.assignShipment).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });
});
