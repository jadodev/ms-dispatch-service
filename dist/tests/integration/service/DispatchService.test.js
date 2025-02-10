"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventPublisher_1 = require("../../../infrastructure/messaging/EventPublisher");
const DispatchShipmentService_1 = require("../../../application/service/DispatchShipmentService");
// Fake repository que simplemente guarda la asignación
class FakeAssignmentRepository {
    constructor() {
        this.savedAssignment = null;
    }
    async save(assignment) {
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
class FakeEventPublisher extends EventPublisher_1.EventPublisher {
    constructor() {
        super(new FakeKafkaProducer());
        this.publishedEvents = [];
    }
    async publish(topic, message) {
        this.publishedEvents.push({ topic, message });
    }
}
// Fake domain service modificado: ahora no depende del arreglo de candidatos
const fakeDispatchDomainService = {
    assignShipment: (shipmentInput, 
    // Ignoramos el arreglo de candidatos en este fake
    candidates, criteria) => {
        return {
            assignmentId: "ASSIGNMENT_001",
            shipmentId: shipmentInput.shipmentId,
            driverId: "DRV001", // Retornamos directamente "DRV001"
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
    let service;
    let fakeRepository;
    let fakePublisher;
    // Si deseas aumentar el timeout para este test, puedes hacerlo así:
    // jest.setTimeout(10000);
    beforeEach(() => {
        fakeRepository = new FakeAssignmentRepository();
        fakePublisher = new FakeEventPublisher();
        service = new DispatchShipmentService_1.DispatchShipmentService(fakeRepository, fakeDispatchDomainService, fakePublisher);
    });
});
