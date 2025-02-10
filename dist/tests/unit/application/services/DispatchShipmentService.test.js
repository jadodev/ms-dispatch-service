"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateAssignmentDto_1 = require("../../../../application/dto/CreateAssignmentDto");
const AssignmentMapper_1 = require("../../../../application/mapper/AssignmentMapper");
const DispatchShipmentService_1 = require("../../../../application/service/DispatchShipmentService");
jest.mock("../../../../application/mapper/AssignmentMapper");
describe("DispatchShipmentService", () => {
    let dispatchShipmentService;
    let mockAssignmentRepository;
    let mockDispatchDomainService;
    let mockEventPublisher;
    const expectedAssignment = {
        assignmentId: "ASSIGN001",
        shipmentId: "SHIP001",
        driverId: "DRV001",
        assignedAt: new Date().toISOString(),
        score: 85,
    };
    const dto = new CreateAssignmentDto_1.CreateAssignmentDto({
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
        };
        mockDispatchDomainService = {
            assignShipment: jest.fn().mockResolvedValue(expectedAssignment),
        };
        mockEventPublisher = {
            publish: jest.fn().mockResolvedValue(undefined),
        };
        dispatchShipmentService = new DispatchShipmentService_1.DispatchShipmentService(mockAssignmentRepository, mockDispatchDomainService, mockEventPublisher);
        AssignmentMapper_1.AssignmentMapper.toDto.mockReset();
        AssignmentMapper_1.AssignmentMapper.toDto.mockReturnValue(expectedAssignment);
    });
    it("should execute shipment dispatch and return an AssignmentDto (happy path)", async () => {
        jest.spyOn(dispatchShipmentService, "getDriverCandidates").mockResolvedValue([
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
        expect(AssignmentMapper_1.AssignmentMapper.toDto).toHaveBeenCalled();
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
        jest.spyOn(dispatchShipmentService, "getDriverCandidates").mockResolvedValue([
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
        jest.spyOn(dispatchShipmentService, "getDriverCandidates").mockResolvedValue([
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
        mockDispatchDomainService.assignShipment.mockRejectedValueOnce(new Error(errorMessage));
        mockAssignmentRepository.save.mockImplementationOnce(async (assignment) => {
            await assignment;
        });
        jest.spyOn(dispatchShipmentService, "getDriverCandidates").mockResolvedValue([
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
        jest.spyOn(dispatchShipmentService, "getDriverCandidates").mockRejectedValueOnce(new Error(errorMessage));
        await expect(dispatchShipmentService.execute(dto)).rejects.toThrow(errorMessage);
        expect(mockDispatchDomainService.assignShipment).not.toHaveBeenCalled();
        expect(mockEventPublisher.publish).not.toHaveBeenCalled();
    });
});
