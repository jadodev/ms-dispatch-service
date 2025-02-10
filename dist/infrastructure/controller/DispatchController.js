"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDispatchController = createDispatchController;
const express_1 = require("express");
/**
 * Crea y configura un router Express para el microservicio Dispatch Service.
 *
 * Endpoints:
 *  - GET /dispatch/health: Devuelve el estado del servicio.
 *  - POST /dispatch/assign: Permite disparar manualmente la asignación de un shipment.
 */
function createDispatchController(dispatchService) {
    const router = (0, express_1.Router)();
    router.get('/health', (req, res) => {
        res.json({ status: 'Dispatch Service is running' });
    });
    router.post('/assign', async (req, res) => {
        try {
            const dto = req.body;
            const assignment = await dispatchService.execute(dto);
            res.status(201).json(assignment);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
