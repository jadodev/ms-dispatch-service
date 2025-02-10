"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShipmentCreatedConsumer_1 = require("../../../../infrastructure/messaging/ShipmentCreatedConsumer");
describe('ShipmentCreatedConsumer', () => {
    let consumerMock;
    let dispatchServiceMock;
    let shipmentCreatedConsumer;
    let subscribeCallback;
    beforeEach(() => {
        consumerMock = {
            subscribe: jest.fn((topic, callback) => {
                subscribeCallback = callback;
                return Promise.resolve();
            }),
        };
        dispatchServiceMock = {
            execute: jest.fn().mockResolvedValue(undefined),
        };
        shipmentCreatedConsumer = new ShipmentCreatedConsumer_1.ShipmentCreatedConsumer(consumerMock, dispatchServiceMock);
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should subscribe to the correct topic', async () => {
        await shipmentCreatedConsumer.start();
        expect(consumerMock.subscribe).toHaveBeenCalledWith("shipment.events", expect.any(Function));
    });
    it('should ignore events that are not "ShipmentCreated"', async () => {
        await shipmentCreatedConsumer.start();
        const event = { event: "OtherEvent", payload: {} };
        await subscribeCallback(event);
        expect(console.warn).toHaveBeenCalledWith(`Ignored event type: ${event.event}`);
        expect(dispatchServiceMock.execute).not.toHaveBeenCalled();
    });
    it('should process "ShipmentCreated" events and call dispatchService.execute with the payload', async () => {
        await shipmentCreatedConsumer.start();
        const event = {
            event: "ShipmentCreated",
            payload: {
                shipmentId: 123,
                origin: 'Origin',
                destination: 'Destination',
                depositDate: '2025-01-01',
                criteria: { priority: 'high' },
            },
        };
        await subscribeCallback(event);
        expect(console.log).toHaveBeenCalledWith("ShipmentCreated event received:", event);
        expect(dispatchServiceMock.execute).toHaveBeenCalledWith(event.payload);
    });
    it('should catch and log errors when processing the event', async () => {
        await shipmentCreatedConsumer.start();
        const event = { event: "ShipmentCreated", payload: {} };
        const error = new Error("Error in dispatch");
        dispatchServiceMock.execute.mockRejectedValueOnce(error);
        await subscribeCallback(event);
        expect(console.error).toHaveBeenCalledWith("Error processing ShipmentCreated event:", error);
    });
});
