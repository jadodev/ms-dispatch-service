import { CreateAssignmentDto } from '../../../application/dto/CreateAssignmentDto';
import { IAssignmentRepository } from '../../../application/ports/out/IAssignmentRepository';
import { EventPublisher } from '../../../infrastructure/messaging/EventPublisher';
import { AssignmentDto } from '../../../application/dto/AssignmentDto';
import { DispatchDomainService, DriverCandidate, ShipmentAssignmentInput } from '../../../domain/service/DispatchDomainService';
import { DispatchShipmentService } from '../../../application/service/DispatchShipmentService';

// Fake repository que simplemente guarda la asignación
class FakeAssignmentRepository implements IAssignmentRepository {
  public savedAssignment: any = null;

  async save(assignment: any): Promise<void> {
    this.savedAssignment = assignment;
  }
}

// Fake Kafka Producer (no hace nada)
class FakeKafkaProducer {
  async send() {
    // No hace nada
  }
}

// Fake event publisher que acumula los eventos publicados
class FakeEventPublisher extends EventPublisher {
  public publishedEvents: Array<{ topic: string; message: any }> = [];

  constructor() {
    super(new FakeKafkaProducer() as any);
  }

  async publish(topic: string, message: any): Promise<void> {
    this.publishedEvents.push({ topic, message });
  }
}

// Fake domain service modificado: ahora no depende del arreglo de candidatos
const fakeDispatchDomainService: DispatchDomainService = {
  assignShipment: (
    shipmentInput: ShipmentAssignmentInput,
    // Ignoramos el arreglo de candidatos en este fake
    candidates: DriverCandidate[],
    criteria: { timeWeight: number; costWeight: number; fuelPrice: number }
  ) => {
    return {
      assignmentId: "ASSIGNMENT_001",
      shipmentId: shipmentInput.shipmentId,
      driverId: "DRV001",  // Retornamos directamente "DRV001"
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

  // Si deseas aumentar el timeout para este test, puedes hacerlo así:
  // jest.setTimeout(10000);

  beforeEach(() => {
    fakeRepository = new FakeAssignmentRepository();
    fakePublisher = new FakeEventPublisher();

    service = new DispatchShipmentService(
      fakeRepository,
      fakeDispatchDomainService,
      fakePublisher
    );
  });
});
