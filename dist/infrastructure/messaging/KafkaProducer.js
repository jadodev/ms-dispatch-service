"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = void 0;
const messageBroker_1 = require("../config/messageBroker");
/**
 * KafkaProducer encapsula el envío de mensajes a Kafka.
 */
class KafkaProducer {
    /**
     * Envía un mensaje a un topic específico.
     */
    async send(topic, message) {
        try {
            const payload = typeof message === "string" ? message : JSON.stringify(message);
            await messageBroker_1.producer.send({
                topic,
                messages: [{ value: payload }],
            });
            console.log(`Message sent to topic "${topic}": ${payload}`);
        }
        catch (error) {
            console.error("Error sending message to Kafka:", error);
            throw error;
        }
    }
}
exports.KafkaProducer = KafkaProducer;
