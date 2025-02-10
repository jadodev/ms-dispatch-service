
import { DispatchShipmentService } from "../../application/service/DispatchShipmentService";
import { KafkaConsumer } from "./KafkaConsumer";


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

        await this.dispatchService.execute(event.payload);
      } catch (error) {
        console.error("Error processing ShipmentCreated event:", error);
      }
    });
  }
}
