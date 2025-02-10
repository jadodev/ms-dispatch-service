import { KafkaProducer } from "./KafkaProducer";

/**
 * EventPublisher centraliza la publicación de eventos a Kafka.
 * Este componente es utilizado por la capa de aplicación para emitir eventos cuando
 * ocurren cambios importantes en el dominio (por ejemplo, cuando el estado del envío cambia).
 */
export class EventPublisher {
  private readonly kafkaProducer: KafkaProducer;

  constructor(kafkaProducer: KafkaProducer) {
    this.kafkaProducer = kafkaProducer;
  }

  /**
   * Publica un evento en el topic especificado.
   * @param topic El topic de Kafka.
   * @param event El evento a publicar.
   */
  public async publish(topic: string, event: any): Promise<void> {
    await this.kafkaProducer.send(topic, event);
  }
}
