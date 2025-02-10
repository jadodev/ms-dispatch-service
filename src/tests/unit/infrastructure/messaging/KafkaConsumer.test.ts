import { KafkaConsumer } from "../../../../infrastructure/messaging/KafkaConsumer";
import { consumer } from "../../../../infrastructure/config/messageBroker";

jest.mock("../../../../infrastructure/config/messageBroker", () => ({
  consumer: {
    subscribe: jest.fn().mockResolvedValue(undefined),
    run: jest.fn().mockResolvedValue(undefined),
  },
}));

describe("KafkaConsumer", () => {
  let kafkaConsumer: KafkaConsumer;
  let fakeHandler: jest.Mock;

  beforeEach(() => {
    kafkaConsumer = new KafkaConsumer();
    fakeHandler = jest.fn().mockResolvedValue(undefined);
    jest.clearAllMocks();
  });

  it("should subscribe to the topic and call handler with parsed JSON message", async () => {
    const topic = "test-topic";
    await kafkaConsumer.subscribe(topic, fakeHandler);

    expect(consumer.subscribe).toHaveBeenCalledWith({ topic, fromBeginning: true });

    const runCallArgs = (consumer.run as jest.Mock).mock.calls[0][0];
    expect(runCallArgs).toBeDefined();
    expect(typeof runCallArgs.eachMessage).toBe("function");

    const validMessage = {
      topic: topic,
      partition: 0,
      message: {
        value: Buffer.from('{"key": "value"}'),
      },
    };

    await runCallArgs.eachMessage(validMessage);

    expect(fakeHandler).toHaveBeenCalledWith({ key: "value" });
  });

  it("should log an error and not call handler when JSON.parse fails", async () => {
    const topic = "test-topic";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await kafkaConsumer.subscribe(topic, fakeHandler);

    const runCallArgs = (consumer.run as jest.Mock).mock.calls[0][0];

    const invalidMessage = {
      topic: topic,
      partition: 0,
      message: {
        value: Buffer.from("invalid json"),
      },
    };

    await runCallArgs.eachMessage(invalidMessage);

    expect(fakeHandler).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should log an error and not call handler when message.value is undefined", async () => {
    const topic = "test-topic";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await kafkaConsumer.subscribe(topic, fakeHandler);

    const runCallArgs = (consumer.run as jest.Mock).mock.calls[0][0];

    const emptyMessage = {
      topic: topic,
      partition: 0,
      message: {
        value: undefined,
      },
    };

    await runCallArgs.eachMessage(emptyMessage);

    expect(fakeHandler).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
