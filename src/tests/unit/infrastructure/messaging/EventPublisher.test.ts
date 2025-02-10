import { EventPublisher } from "../../../../infrastructure/messaging/EventPublisher";
import { KafkaProducer } from "../../../../infrastructure/messaging/KafkaProducer";

describe("EventPublisher", () => {
  let kafkaProducerMock: jest.Mocked<KafkaProducer>;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    kafkaProducerMock = {
      send: jest.fn()
    } as unknown as jest.Mocked<KafkaProducer>;

    eventPublisher = new EventPublisher(kafkaProducerMock);
  });

  it("should call kafkaProducer.send with the correct topic and event", async () => {
    const topic = "test-topic";
    const event = { data: "test event" };
    kafkaProducerMock.send.mockResolvedValue();

    const result = await eventPublisher.publish(topic, event);

    expect(kafkaProducerMock.send).toHaveBeenCalledTimes(1);
    expect(kafkaProducerMock.send).toHaveBeenCalledWith(topic, event);
    expect(result).toBeUndefined();
  });

  it("should propagate errors if kafkaProducer.send fails", async () => {
    const topic = "test-topic";
    const event = { data: "test event" };
    const error = new Error("Send failed");
    kafkaProducerMock.send.mockRejectedValue(error);

    await expect(eventPublisher.publish(topic, event)).rejects.toThrow("Send failed");
  });

  it("should allow multiple calls to publish", async () => {
    const topic = "multi-topic";
    const events = [{ id: 1 }, { id: 2 }, { id: 3 }];
    kafkaProducerMock.send.mockResolvedValue();

    for (const event of events) {
      await eventPublisher.publish(topic, event);
    }

    expect(kafkaProducerMock.send).toHaveBeenCalledTimes(events.length);
    events.forEach((event, index) => {
      expect(kafkaProducerMock.send).toHaveBeenNthCalledWith(index + 1, topic, event);
    });
  });
});
