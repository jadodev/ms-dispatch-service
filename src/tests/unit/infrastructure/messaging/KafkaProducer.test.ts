import { producer } from "../../../../infrastructure/config/messageBroker";
import { KafkaProducer } from "../../../../infrastructure/messaging/KafkaProducer";

jest.mock("../../../../infrastructure/config/messageBroker", () => ({
  producer: {
    send: jest.fn(),
  },
}));

describe("KafkaProducer", () => {
  let kafkaProducer: KafkaProducer;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    kafkaProducer = new KafkaProducer();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
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
    (producer.send as jest.Mock).mockResolvedValueOnce(undefined);

    await kafkaProducer.send(topic, message);

    expect(producer.send).toHaveBeenCalledWith({
      topic,
      messages: [{ value: message }],
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Message sent to topic "${topic}": ${message}`
    );
  });

  test("should convert an object to a string and send it", async () => {
    const topic = "test-topic";
    const message = { key: "value" };
    const expectedPayload = JSON.stringify(message);
    (producer.send as jest.Mock).mockResolvedValueOnce(undefined);

    await kafkaProducer.send(topic, message);

    expect(producer.send).toHaveBeenCalledWith({
      topic,
      messages: [{ value: expectedPayload }],
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Message sent to topic "${topic}": ${expectedPayload}`
    );
  });

  test("should throw an error and log it to the console if sending fails", async () => {
    const topic = "test-topic";
    const message = "test error message";
    const error = new Error("Sending failed");
    (producer.send as jest.Mock).mockRejectedValueOnce(error);

    await expect(kafkaProducer.send(topic, message)).rejects.toThrow("Sending failed");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error sending message to Kafka:", error);
  });
});
