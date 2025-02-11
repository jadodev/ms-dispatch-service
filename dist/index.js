"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = __importDefault(require("./infrastructure/config/database"));
const messageBroker_1 = require("./infrastructure/config/messageBroker");
const KafkaProducer_1 = require("./infrastructure/messaging/KafkaProducer");
const EventPublisher_1 = require("./infrastructure/messaging/EventPublisher");
const KafkaConsumer_1 = require("./infrastructure/messaging/KafkaConsumer");
const ShipmentCreatedConsumer_1 = require("./infrastructure/messaging/ShipmentCreatedConsumer");
const MySQLAssignmentRepository_1 = require("./infrastructure/repository/MySQLAssignmentRepository");
const DispatchController_1 = require("./infrastructure/controller/DispatchController");
const DispatchDomainService_1 = require("./domain/service/DispatchDomainService");
const DispatchShipmentService_1 = require("./application/service/DispatchShipmentService");
const swaggerConfig_1 = require("./infrastructure/swagger/swaggerConfig");
async function main() {
    try {
        await (0, messageBroker_1.connectKafka)();
        console.log("Kafka connected.");
        const connection = await database_1.default.getConnection();
        console.log("MySQL connected.");
        connection.release();
        // ---------------------
        // Instanciación de Adaptadores de Mensajería
        // ---------------------
        const kafkaProducer = new KafkaProducer_1.KafkaProducer();
        const eventPublisher = new EventPublisher_1.EventPublisher(kafkaProducer);
        const kafkaConsumer = new KafkaConsumer_1.KafkaConsumer();
        // ---------------------
        // Instanciación del Repositorio y Servicio de Dominio
        // ---------------------
        const assignmentRepository = new MySQLAssignmentRepository_1.MySQLAssignmentRepository();
        const dispatchDomainService = new DispatchDomainService_1.DispatchDomainService();
        // ---------------------
        // Instanciación del Servicio de Aplicación
        // ---------------------
        const dispatchShipmentService = new DispatchShipmentService_1.DispatchShipmentService(assignmentRepository, dispatchDomainService, eventPublisher);
        // ---------------------
        // Iniciar Consumer para "ShipmentCreated" Events
        // ---------------------
        const shipmentCreatedConsumer = new ShipmentCreatedConsumer_1.ShipmentCreatedConsumer(kafkaConsumer, dispatchShipmentService);
        shipmentCreatedConsumer.start().catch(err => {
            console.error("Error starting ShipmentCreatedConsumer:", err);
        });
        // ---------------------
        // Configuración del Servidor Express
        // ---------------------
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        const dispatchRouter = (0, DispatchController_1.createDispatchController)(dispatchShipmentService);
        app.use("/api", dispatchRouter);
        (0, swaggerConfig_1.setupSwagger)(app);
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Dispatch Service is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error starting Dispatch Service:", error);
        process.exit(1);
    }
}
main();
