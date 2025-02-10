import { Router, Request, Response } from 'express';
import { DispatchShipmentService } from '../../application/service/DispatchShipmentService';

/**
 * Crea y configura un router Express para el microservicio Dispatch Service.
 *
 * Endpoints:
 *  - GET /dispatch/health: Devuelve el estado del servicio.
 *  - POST /dispatch/assign: Permite disparar manualmente la asignación de un shipment.
 */
export function createDispatchController(dispatchService: DispatchShipmentService): Router {
  const router = Router();

  router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'Dispatch Service is running' });
  });

  router.post('/assign', async (req: Request, res: Response) => {
    try {
      const dto = req.body;
      const assignment = await dispatchService.execute(dto);
      res.status(201).json(assignment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
