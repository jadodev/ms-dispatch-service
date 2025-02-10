import request from 'supertest';
import express from 'express';
import { createDispatchController } from '../../../../src/infrastructure/controller/DispatchController';
import { DispatchShipmentService } from '../../../../src/application/service/DispatchShipmentService';

describe('DispatchController Integration Tests', () => {
  let app: express.Application;
  let mockDispatchService: DispatchShipmentService;

  beforeAll(() => {
    // Moquea console.error si prefieres no ver logs durante los tests (opcional)
    // jest.spyOn(console, 'error').mockImplementation(() => {});

    mockDispatchService = {
      execute: jest.fn()
    } as unknown as DispatchShipmentService;

    app = express();
    app.use(express.json());
    // Monta el controlador bajo el prefijo "/dispatch"
    app.use('/dispatch', createDispatchController(mockDispatchService));
  });

  describe('GET /dispatch/health', () => {
    it('should return 200 and a health status message', async () => {
      const res = await request(app).get('/dispatch/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'Dispatch Service is running' });
    });
  });

  describe('POST /dispatch/assign', () => {
    it('should return 201 and assignment object on successful execution', async () => {
      const mockAssignment = { assignmentId: '12345', driver: 'Juan', shipmentId: 'A1' };
      (mockDispatchService.execute as jest.Mock).mockResolvedValueOnce(mockAssignment);

      const dto = { shipmentId: 'A1' };
      const res = await request(app).post('/dispatch/assign').send(dto);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockAssignment);
      expect(mockDispatchService.execute).toHaveBeenCalledWith(dto);
    });

    it('should return 400 and error message when service execution fails', async () => {
      const errorMessage = 'Error assigning shipment';
      (mockDispatchService.execute as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const dto = { shipmentId: 'A2' };
      const res = await request(app).post('/dispatch/assign').send(dto);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', errorMessage);
      expect(mockDispatchService.execute).toHaveBeenCalledWith(dto);
    });
  });
});
