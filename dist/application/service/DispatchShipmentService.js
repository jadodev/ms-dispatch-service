"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchShipmentService = void 0;
const axios_1 = __importDefault(require("axios"));
const AssignmentMapper_1 = require("../mapper/AssignmentMapper");
/**
 * DispatchShipmentService implements the use case of assigning a shipment to an optimal driver.
 * Ahora, en lugar de simular candidatos, se hace una llamada HTTP real al API Gateway para obtener
 * los conductores disponibles en una zona específica. Se espera que el DTO reciba en el campo `origin`
 * el identificador de la zona (por ejemplo, "ZoneA", "ZoneB", etc.).
 */
class DispatchShipmentService {
    /**
     * Realiza una llamada HTTP al API Gateway para obtener los candidatos (conductores)
     * que se encuentren en la zona especificada.
     */
    async getDriverCandidates(zone) {
        try {
            const response = await axios_1.default.get(`http://api-gateway:5000/driver/api/zone/${zone}`);
            return response.data;
        }
        catch (error) {
            console.error("Error retrieving driver candidates:", error.message);
            throw new Error("Error retrieving driver candidates: " + error.message);
        }
    }
    constructor(assignmentRepository, dispatchDomainService, eventPublisher) {
        this.assignmentRepository = assignmentRepository;
        this.dispatchDomainService = dispatchDomainService;
        this.eventPublisher = eventPublisher;
    }
    async execute(dto) {
        console.log("DispatchShipmentService.execute() - Processing assignment for shipment:", dto.shipmentId);
        const shipmentInput = {
            shipmentId: dto.shipmentId,
            origin: dto.origin,
            destination: dto.destination,
            depositDate: new Date(dto.depositDate)
        };
        const candidates = await this.getDriverCandidates(dto.origin);
        const criteria = {
            timeWeight: dto.timeWeight,
            costWeight: dto.costWeight,
            fuelPrice: dto.fuelPrice
        };
        const assignment = this.dispatchDomainService.assignShipment(shipmentInput, candidates, criteria);
        await this.assignmentRepository.save(assignment);
        const eventPayload = {
            event: "AssignmentCreated",
            payload: AssignmentMapper_1.AssignmentMapper.toDto(assignment)
        };
        await this.eventPublisher.publish("dispatch.events", eventPayload);
        return AssignmentMapper_1.AssignmentMapper.toDto(assignment);
    }
}
exports.DispatchShipmentService = DispatchShipmentService;
