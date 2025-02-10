import { producer } from "../config/messageBroker";

/**
 * KafkaProducer encapsula el envío de mensajes a Kafka.
 */
export class KafkaProducer {
  /**
   * Envía un mensaje a un topic específico.
   * @param topic El topic de Kafka al que se enviará el mensaje.
   * @param message El mensaje a enviar (en formato string o JSON).
   */
  public async send(topic: string, message: any): Promise<void> {
    try {
      // Convertir el mensaje a string si es un objeto.
      const payload = typeof message === "string" ? message : JSON.stringify(message);
      await producer.send({
        topic,
        messages: [{ value: payload }],
      });
      console.log(`Message sent to topic "${topic}": ${payload}`);
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
      throw error;
    }
  }
}
