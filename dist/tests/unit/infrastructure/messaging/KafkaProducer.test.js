"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageBroker_1 = require("../../../../infrastructure/config/messageBroker");
const KafkaProducer_1 = require("../../../../infrastructure/messaging/KafkaProducer");
jest.mock("../../../../infrastructure/config/messageBroker", () => ({
    producer: {
        send: jest.fn(),
    },
}));
describe("KafkaProducer", () => {
    let kafkaProducer;
    let consoleLogSpy;
    let consoleErrorSpy;
    beforeAll(() => {
        kafkaProducer = new KafkaProducer_1.KafkaProducer();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterAll(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should send a string message without converting it", async () => {
        const topic = "test-topic";
        const message = "test message";
        messageBroker_1.producer.send.mockResolvedValueOnce(undefined);
        await kafkaProducer.send(topic, message);
        expect(messageBroker_1.producer.send).toHaveBeenCalledWith({
            topic,
            messages: [{ value: message }],
        });
        expect(consoleLogSpy).toHaveBeenCalledWith(`Message sent to topic "${topic}": ${message}`);
    });
    test("should convert an object to a string and send it", async () => {
        const topic = "test-topic";
        const message = { key: "value" };
        const expectedPayload = JSON.stringify(message);
        messageBroker_1.producer.send.mockResolvedValueOnce(undefined);
        await kafkaProducer.send(topic, message);
        expect(messageBroker_1.producer.send).toHaveBeenCalledWith({
            topic,
            messages: [{ value: expectedPayload }],
        });
        expect(consoleLogSpy).toHaveBeenCalledWith(`Message sent to topic "${topic}": ${expectedPayload}`);
    });
    test("should throw an error and log it to the console if sending fails", async () => {
        const topic = "test-topic";
        const message = "test error message";
        const error = new Error("Sending failed");
        messageBroker_1.producer.send.mockRejectedValueOnce(error);
        await expect(kafkaProducer.send(topic, message)).rejects.toThrow("Sending failed");
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error sending message to Kafka:", error);
    });
});
