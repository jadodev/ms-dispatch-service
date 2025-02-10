import { AssignmentDto } from '../../../../application/dto/AssignmentDto';
import { DispatchShipmentService } from '../../../../application/services/DispatchShipmentService';
import { createDispatchController } from '../../../../infrastructure/controller/DispatchController';
import request from 'supertest';
import express from 'express';

const mockDispatchService: Partial<DispatchShipmentService> = {
  execute: jest.fn()
};

const app = express();
app.use(express.json());
app.use(createDispatchController(mockDispatchService as DispatchShipmentService));

describe('DispatchController', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => {
    consoleError.mockRestore();
  });

  describe('GET /dispatch/health', () => {
    it('should return service status', async () => {
      const response = await request(app).get('/dispatch/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'Dispatch Service is running' });
    });
  });

  describe('POST /dispatch/assign', () => {
    const validRequestBody = {
      shipmentId: 'ship123',
      origin: 'Origin',
      destination: 'Dest',
      depositDate: '2023-10-01T00:00:00Z',
      timeWeight: 0.5,
      costWeight: 0.5,
      fuelPrice: 2.5
    };

    const mockAssignmentDto = new AssignmentDto({
      assignmentId: 'AS-123',
      shipmentId: 'ship123',
      driverId: 'DRV001',
      assignedAt: new Date().toISOString(),
      score: 95
    });

    it('should create assignment and return 201 on success', async () => {
      (mockDispatchService.execute as jest.Mock).mockResolvedValue(mockAssignmentDto);

      const response = await request(app).post('/dispatch/assign').send(validRequestBody);

      expect(mockDispatchService.execute).toHaveBeenCalledWith(validRequestBody);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockAssignmentDto);
      expect(consoleError).not.toHaveBeenCalled();
    });

    it('should return 400 with error message on failure', async () => {
      const testError = new Error('Validation failed');
      (mockDispatchService.execute as jest.Mock).mockRejectedValue(testError);

      const response = await request(app).post('/dispatch/assign').send(validRequestBody);

      expect(mockDispatchService.execute).toHaveBeenCalledWith(validRequestBody);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Validation failed' });
      expect(consoleError).toHaveBeenCalledWith('Error assigning shipment:', testError);
    });

    it('should handle invalid request body', async () => {
      const invalidRequestBody = { ...validRequestBody, shipmentId: undefined };
      const testError = new Error('shipmentId is required.');
      (mockDispatchService.execute as jest.Mock).mockRejectedValue(testError);

      const response = await request(app).post('/dispatch/assign').send(invalidRequestBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'shipmentId is required.' });
    });

    it('should handle domain errors properly', async () => {
      const domainError = new Error('Invalid driver criteria');
      (mockDispatchService.execute as jest.Mock).mockRejectedValue(domainError);

      const response = await request(app).post('/dispatch/assign').send(validRequestBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid driver criteria' });
    });
  });
});
