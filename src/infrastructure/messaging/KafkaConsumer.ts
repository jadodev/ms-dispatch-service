import { consumer } from "../config/messageBroker";

/**
 * KafkaConsumer encapsula la lógica para suscribirse a un topic y procesar cada mensaje.
 */
export class KafkaConsumer {
  /**
   * Se suscribe a un topic de Kafka y ejecuta un handler para cada mensaje recibido.
   */
  public async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value ? message.value.toString() : "";
        try {
          const parsed = JSON.parse(value);
          await handler(parsed);
        } catch (err) {
          console.error(`Error processing message from topic ${topic}:`, err);
        }
      }
    });
  }
}
