"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPublisher = void 0;
/**
 * EventPublisher centraliza la publicación de eventos a Kafka.
 * Este componente es utilizado por la capa de aplicación para emitir eventos cuando
 * ocurren cambios importantes en el dominio (por ejemplo, cuando el estado del envío cambia).
 */
class EventPublisher {
    constructor(kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }
    /**
     * Publica un evento en el topic especificado.
     */
    async publish(topic, event) {
        await this.kafkaProducer.send(topic, event);
    }
}
exports.EventPublisher = EventPublisher;
