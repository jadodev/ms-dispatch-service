"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageBroker_1 = require("../../../../infrastructure/config/messageBroker");
describe("connectKafka tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should connect the producer and consumer and display the correct message", async () => {
        const producerConnectSpy = jest
            .spyOn(messageBroker_1.producer, "connect")
            .mockResolvedValue();
        const consumerConnectSpy = jest
            .spyOn(messageBroker_1.consumer, "connect")
            .mockResolvedValue();
        const consoleLogSpy = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });
        await (0, messageBroker_1.connectKafka)();
        expect(producerConnectSpy).toHaveBeenCalledTimes(1);
        expect(consumerConnectSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith("Connected to Kafka as DeliveryStatus service.");
    });
    it("should throw an error if producer.connect fails", async () => {
        const errorMessage = "Producer connection error";
        jest
            .spyOn(messageBroker_1.producer, "connect")
            .mockRejectedValue(new Error(errorMessage));
        await expect((0, messageBroker_1.connectKafka)()).rejects.toThrow(errorMessage);
    });
    it("should throw an error if consumer.connect fails", async () => {
        jest.spyOn(messageBroker_1.producer, "connect").mockResolvedValue();
        const errorMessage = "Consumer connection error";
        jest
            .spyOn(messageBroker_1.consumer, "connect")
            .mockRejectedValue(new Error(errorMessage));
        await expect((0, messageBroker_1.connectKafka)()).rejects.toThrow(errorMessage);
    });
});
