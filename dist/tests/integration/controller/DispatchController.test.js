"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const DispatchController_1 = require("../../../../src/infrastructure/controller/DispatchController");
describe('DispatchController Integration Tests', () => {
    let app;
    let mockDispatchService;
    beforeAll(() => {
        // Moquea console.error si prefieres no ver logs durante los tests (opcional)
        // jest.spyOn(console, 'error').mockImplementation(() => {});
        mockDispatchService = {
            execute: jest.fn()
        };
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Monta el controlador bajo el prefijo "/dispatch"
        app.use('/dispatch', (0, DispatchController_1.createDispatchController)(mockDispatchService));
    });
    describe('GET /dispatch/health', () => {
        it('should return 200 and a health status message', async () => {
            const res = await (0, supertest_1.default)(app).get('/dispatch/health');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: 'Dispatch Service is running' });
        });
    });
    describe('POST /dispatch/assign', () => {
        it('should return 201 and assignment object on successful execution', async () => {
            const mockAssignment = { assignmentId: '12345', driver: 'Juan', shipmentId: 'A1' };
            mockDispatchService.execute.mockResolvedValueOnce(mockAssignment);
            const dto = { shipmentId: 'A1' };
            const res = await (0, supertest_1.default)(app).post('/dispatch/assign').send(dto);
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAssignment);
            expect(mockDispatchService.execute).toHaveBeenCalledWith(dto);
        });
        it('should return 400 and error message when service execution fails', async () => {
            const errorMessage = 'Error assigning shipment';
            mockDispatchService.execute.mockRejectedValueOnce(new Error(errorMessage));
            const dto = { shipmentId: 'A2' };
            const res = await (0, supertest_1.default)(app).post('/dispatch/assign').send(dto);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', errorMessage);
            expect(mockDispatchService.execute).toHaveBeenCalledWith(dto);
        });
    });
});
