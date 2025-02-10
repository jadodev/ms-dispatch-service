"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumer = exports.producer = void 0;
exports.connectKafka = connectKafka;
const kafkajs_1 = require("kafkajs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const kafka = new kafkajs_1.Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "delivery-shipment-service",
    brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["kafka:9093"],
    logLevel: kafkajs_1.logLevel.INFO
});
exports.producer = kafka.producer();
exports.consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP || "delivery-service-group" });
async function connectKafka() {
    await exports.producer.connect();
    await exports.consumer.connect();
    console.log("Connected to Kafka as DeliveryStatus service.");
}
