import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dispatch Service API",
      version: "1.0.0",
      description: "API para asignación de envíos a conductores",
    },
  },
  apis: ["../controller/DispatchController"],
};

/**
 * Documentación generada por Swagger a partir de las opciones definidas.
 */
const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * Configura Swagger en la aplicación Express.
 */
export function setupSwagger(app: Application): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}