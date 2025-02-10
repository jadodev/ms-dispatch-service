
import { KafkaConsumer } from "./KafkaConsumer";
import { DispatchShipmentService } from "../../application/services/DispatchShipmentService";

/**
 * ShipmentCreatedConsumer escucha eventos "ShipmentCreated" y activa el proceso de asignación en Dispatch Service.
 */
export class ShipmentCreatedConsumer {
  constructor(
    private readonly consumer: KafkaConsumer,
    private readonly dispatchService: DispatchShipmentService
  ) {}

  public async start(): Promise<void> {
    await this.consumer.subscribe("shipment.events", async (event: any) => {
      try {
        if (event.event !== "ShipmentCreated") {
          console.warn(`Ignored event type: ${event.event}`);
          return;
        }
        console.log("ShipmentCreated event received:", event);
        // Se asume que el payload del evento tiene la estructura necesaria para el proceso de asignación.
        // El DispatchShipmentService espera un CreateAssignmentDto que contenga shipmentId, origin, destination, depositDate, y criterios.
        await this.dispatchService.execute(event.payload);
      } catch (error) {
        console.error("Error processing ShipmentCreated event:", error);
      }
    });
  }
}
