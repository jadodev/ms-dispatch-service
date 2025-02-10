import axios from 'axios';
import { IDispatchShipmentUseCase } from "../ports/in/IDispatchShipmentUseCase";
import { CreateAssignmentDto } from "../dto/CreateAssignmentDto";
import { AssignmentDto } from "../dto/AssignmentDto";
import { IAssignmentRepository } from "../ports/out/IAssignmentRepository";
import { AssignmentCriteria, DispatchDomainService, DriverCandidate, ShipmentAssignmentInput } from '../../domain/service/DispatchDomainService';
import { EventPublisher } from '../../infrastructure/messaging/EventPublisher';
import { AssignmentMapper } from '../mapper/AssignmentMapper';


/**
 * DispatchShipmentService implements the use case of assigning a shipment to an optimal driver.
 * Ahora, en lugar de simular candidatos, se hace una llamada HTTP real al API Gateway para obtener
 * los conductores disponibles en una zona específica. Se espera que el DTO reciba en el campo `origin`
 * el identificador de la zona (por ejemplo, "ZoneA", "ZoneB", etc.).
 */
export class DispatchShipmentService implements IDispatchShipmentUseCase {
  /**
   * Realiza una llamada HTTP al API Gateway para obtener los candidatos (conductores)
   * que se encuentren en la zona especificada.
   */
  private async getDriverCandidates(zone: string): Promise<DriverCandidate[]> {
    try {
      const response = await axios.get(`http://api-gateway:5000/driver/api/zone/${zone}`);
      return response.data;
    } catch (error: any) {
      console.error("Error retrieving driver candidates:", error.message);
      throw new Error("Error retrieving driver candidates: " + error.message);
    }
  }

  constructor(
    private readonly assignmentRepository: IAssignmentRepository,
    private readonly dispatchDomainService: DispatchDomainService,
    private readonly eventPublisher: EventPublisher
  ) {}

  public async execute(dto: CreateAssignmentDto): Promise<AssignmentDto> {
    console.log("DispatchShipmentService.execute() - Processing assignment for shipment:", dto.shipmentId);
    

    const shipmentInput: ShipmentAssignmentInput = {
      shipmentId: dto.shipmentId,
      origin: dto.origin,
      destination: dto.destination,
      depositDate: new Date(dto.depositDate)
    };

    const candidates: DriverCandidate[] = await this.getDriverCandidates(dto.origin);

    const criteria: AssignmentCriteria = {
      timeWeight: dto.timeWeight,
      costWeight: dto.costWeight,
      fuelPrice: dto.fuelPrice
    };

    const assignment = this.dispatchDomainService.assignShipment(shipmentInput, candidates, criteria);

    await this.assignmentRepository.save(assignment);

    const eventPayload = {
      event: "AssignmentCreated",
      payload: AssignmentMapper.toDto(assignment)
    };
    await this.eventPublisher.publish("dispatch.events", eventPayload);

    return AssignmentMapper.toDto(assignment);
  }
}
