import { consumer } from "../config/messageBroker";

/**
 * KafkaConsumer encapsula la lógica para suscribirse a un topic y procesar cada mensaje.
 */
export class KafkaConsumer {
  /**
   * Se suscribe a un topic de Kafka y ejecuta un handler para cada mensaje recibido.
   * @param topic El topic al que suscribirse.
   * @param handler Función asíncrona que procesa cada mensaje.
   */
  public async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value ? message.value.toString() : "";
        try {
          // Intenta parsear el mensaje como JSON.
          const parsed = JSON.parse(value);
          await handler(parsed);
        } catch (err) {
          // Si falla el parseo, se registra el error y se puede optar por enviar el mensaje en bruto.
          console.error(`Error processing message from topic ${topic}:`, err);
          // Opcional: llamar al handler con el valor sin parsear si es necesario.
          // await handler(value);
        }
      }
    });
  }
}
