"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentCreatedConsumer = void 0;
/**
 * ShipmentCreatedConsumer escucha eventos "ShipmentCreated" y activa el proceso de asignación en Dispatch Service.
 */
class ShipmentCreatedConsumer {
    constructor(consumer, dispatchService) {
        this.consumer = consumer;
        this.dispatchService = dispatchService;
    }
    async start() {
        await this.consumer.subscribe("shipment.events", async (event) => {
            try {
                if (event.event !== "ShipmentCreated") {
                    console.warn(`Ignored event type: ${event.event}`);
                    return;
                }
                console.log("ShipmentCreated event received:", event);
                await this.dispatchService.execute(event.payload);
            }
            catch (error) {
                console.error("Error processing ShipmentCreated event:", error);
            }
        });
    }
}
exports.ShipmentCreatedConsumer = ShipmentCreatedConsumer;
