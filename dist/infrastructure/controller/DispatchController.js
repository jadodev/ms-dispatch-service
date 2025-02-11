"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDispatchController = createDispatchController;
const express_1 = require("express");
/**
 * @swagger
 * tags:
 *   name: Dispatch
 *   description: Endpoints para gestionar la asignación de envíos
 */
/**
 * Crea y configura un router Express para el microservicio Dispatch Service.
 *
 * @param dispatchService Servicio para asignar un shipment a un conductor óptimo.
 * @returns Un router configurado.
 */
function createDispatchController(dispatchService) {
    const router = (0, express_1.Router)();
    /**
     * @swagger
     * /dispatch/health:
     *   get:
     *     summary: Verifica el estado del servicio
     *     tags: [Dispatch]
     *     responses:
     *       200:
     *         description: El servicio está en ejecución
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "Dispatch Service is running"
     */
    router.get('/dispatch/health', (req, res) => {
        res.json({ status: 'Dispatch Service is running' });
    });
    /**
     * @swagger
     * /dispatch/assign:
     *   post:
     *     summary: Asigna un envío a un conductor
     *     tags: [Dispatch]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               shipmentId:
     *                 type: string
     *                 example: "12345"
     *               priority:
     *                 type: string
     *                 example: "high"
     *     responses:
     *       201:
     *         description: Envío asignado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 assignmentId:
     *                   type: string
     *                   example: "abc123"
     *       400:
     *         description: Error en la solicitud
     */
    router.post('/dispatch/assign', async (req, res) => {
        try {
            const dto = req.body;
            const assignment = await dispatchService.execute(dto);
            res.status(201).json(assignment);
        }
        catch (error) {
            console.error("Error assigning shipment:", error);
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
