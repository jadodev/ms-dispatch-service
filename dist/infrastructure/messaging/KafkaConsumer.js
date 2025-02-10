"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = void 0;
const messageBroker_1 = require("../config/messageBroker");
/**
 * KafkaConsumer encapsula la lógica para suscribirse a un topic y procesar cada mensaje.
 */
class KafkaConsumer {
    /**
     * Se suscribe a un topic de Kafka y ejecuta un handler para cada mensaje recibido.
     */
    async subscribe(topic, handler) {
        await messageBroker_1.consumer.subscribe({ topic, fromBeginning: true });
        await messageBroker_1.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value ? message.value.toString() : "";
                try {
                    const parsed = JSON.parse(value);
                    await handler(parsed);
                }
                catch (err) {
                    console.error(`Error processing message from topic ${topic}:`, err);
                }
            }
        });
    }
}
exports.KafkaConsumer = KafkaConsumer;
