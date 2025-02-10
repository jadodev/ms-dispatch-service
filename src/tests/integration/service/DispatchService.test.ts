import { CreateAssignmentDto } from '../../../application/dto/CreateAssignmentDto';
import { IAssignmentRepository } from '../../../application/ports/out/IAssignmentRepository';
import { EventPublisher } from '../../../infrastructure/messaging/EventPublisher';
import { AssignmentDto } from '../../../application/dto/AssignmentDto';
import { DispatchDomainService, DriverCandidate, ShipmentAssignmentInput } from '../../../domain/service/DispatchDomainService';
import { DispatchShipmentService } from '../../../application/service/DispatchShipmentService';


class FakeAssignmentRepository implements IAssignmentRepository {
  public savedAssignment: any = null;

  async save(assignment: any): Promise<void> {
    this.savedAssignment = assignment;
  }
}

class FakeKafkaProducer {
  async send() {
    // No hace nada
  }
}


class FakeEventPublisher extends EventPublisher {
  public publishedEvents: Array<{ topic: string; message: any }> = [];

  constructor() {
    super(new FakeKafkaProducer() as any);
  }

  async publish(topic: string, message: any): Promise<void> {
    this.publishedEvents.push({ topic, message });
  }
}


const fakeDispatchDomainService: DispatchDomainService = {
  assignShipment: (
    shipmentInput: ShipmentAssignmentInput,
    candidates: DriverCandidate[],
    criteria: { timeWeight: number; costWeight: number; fuelPrice: number }
  ) => {
    return {
      assignmentId: "ASSIGNMENT_001",
      shipmentId: shipmentInput.shipmentId,
      driverId: candidates[0].driverId,
      origin: shipmentInput.origin,
      destination: shipmentInput.destination,
      depositDate: shipmentInput.depositDate,
      assignedAt: new Date(),              
      score: 100,                         
      criteria,                           
    };
  },
};

describe('Integration Tests - DispatchShipmentService', () => {
  let service: DispatchShipmentService;
  let fakeRepository: FakeAssignmentRepository;
  let fakePublisher: FakeEventPublisher;

  beforeEach(() => {
    fakeRepository = new FakeAssignmentRepository();
    fakePublisher = new FakeEventPublisher();

    service = new DispatchShipmentService(
      fakeRepository,
      fakeDispatchDomainService,
      fakePublisher
    );
  });

  it('should process the assignment correctly', async () => {
    const dto: CreateAssignmentDto = {
      shipmentId: "SHIP123",
      origin: "CiudadA",
      destination: "CiudadB",
      depositDate: "2025-03-15T10:00:00Z", 
      timeWeight: 1,
      costWeight: 1,
      fuelPrice: 2.5,
    };

    const result: AssignmentDto = await service.execute(dto);

    expect(result).toBeDefined();
    expect(result.shipmentId).toEqual(dto.shipmentId);
    expect(result.driverId).toEqual("DRV001");

    expect(fakeRepository.savedAssignment).toBeDefined();
    expect(fakeRepository.savedAssignment.shipmentId).toEqual(dto.shipmentId);

    expect(fakePublisher.publishedEvents.length).toBe(1);
    const publishedEvent = fakePublisher.publishedEvents[0];
    expect(publishedEvent.topic).toEqual("dispatch.events");
    expect(publishedEvent.message.event).toEqual("AssignmentCreated");
    expect(publishedEvent.message.payload.shipmentId).toEqual(dto.shipmentId);
  });
});