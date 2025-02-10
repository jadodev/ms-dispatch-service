import { connectKafka, producer, consumer } from "../../../../infrastructure/config/messageBroker"; 

describe("connectKafka tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should connect the producer and consumer and display the correct message", async () => {
    const producerConnectSpy = jest
      .spyOn(producer, "connect")
      .mockResolvedValue();
    const consumerConnectSpy = jest
      .spyOn(consumer, "connect")
      .mockResolvedValue();

    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await connectKafka();

    expect(producerConnectSpy).toHaveBeenCalledTimes(1);
    expect(consumerConnectSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Connected to Kafka as DeliveryStatus service."
    );
  });

  it("should throw an error if producer.connect fails", async () => {
    const errorMessage = "Producer connection error";
    jest
      .spyOn(producer, "connect")
      .mockRejectedValue(new Error(errorMessage));

    await expect(connectKafka()).rejects.toThrow(errorMessage);
  });

  it("should throw an error if consumer.connect fails", async () => {
    jest.spyOn(producer, "connect").mockResolvedValue();
    const errorMessage = "Consumer connection error";
    jest
      .spyOn(consumer, "connect")
      .mockRejectedValue(new Error(errorMessage));

    await expect(connectKafka()).rejects.toThrow(errorMessage);
  });
});
