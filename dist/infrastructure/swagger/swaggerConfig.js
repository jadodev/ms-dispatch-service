"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
/**
 * Configura Swagger en la aplicación Express.
 */
function setupSwagger(app) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
}
