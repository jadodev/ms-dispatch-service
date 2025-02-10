import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import pool from './infrastructure/config/database';
import { connectKafka } from './infrastructure/config/messageBroker';
import { KafkaProducer } from './infrastructure/messaging/KafkaProducer';
import { EventPublisher } from './infrastructure/messaging/EventPublisher';
import { KafkaConsumer } from './infrastructure/messaging/KafkaConsumer';
import { ShipmentCreatedConsumer } from './infrastructure/messaging/ShipmentCreatedConsumer';
import { MySQLAssignmentRepository } from './infrastructure/repository/MySQLAssignmentRepository';
import { createDispatchController } from './infrastructure/controller/DispatchController';
import { DispatchDomainService } from './domain/service/DispatchDomainService';
import { DispatchShipmentService } from './application/service/DispatchShipmentService';
import { setupSwagger } from './infrastructure/swagger/swaggerConfig';

async function main() {
  try {
    await connectKafka();
    console.log("Kafka connected.");

    const connection = await pool.getConnection();
    console.log("MySQL connected.");
    connection.release();

    // ---------------------
    // Instanciación de Adaptadores de Mensajería
    // ---------------------
    const kafkaProducer = new KafkaProducer();
    const eventPublisher = new EventPublisher(kafkaProducer);
    const kafkaConsumer = new KafkaConsumer();

    // ---------------------
    // Instanciación del Repositorio y Servicio de Dominio
    // ---------------------
    const assignmentRepository = new MySQLAssignmentRepository();
    const dispatchDomainService = new DispatchDomainService();

    // ---------------------
    // Instanciación del Servicio de Aplicación
    // ---------------------
    const dispatchShipmentService = new DispatchShipmentService(
      assignmentRepository,
      dispatchDomainService,
      eventPublisher
    );

    // ---------------------
    // Iniciar Consumer para "ShipmentCreated" Events
    // ---------------------
    const shipmentCreatedConsumer = new ShipmentCreatedConsumer(
      kafkaConsumer,
      dispatchShipmentService
    );
    shipmentCreatedConsumer.start().catch(err => {
      console.error("Error starting ShipmentCreatedConsumer:", err);
    });

    // ---------------------
    // Configuración del Servidor Express
    // ---------------------
    const app: Application = express();
    app.use(express.json());

    const dispatchRouter = createDispatchController(dispatchShipmentService);
    app.use("/api", dispatchRouter);

    setupSwagger(app);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Dispatch Service is running on port ${port}`);
    });

  } catch (error) {
    console.error("Error starting Dispatch Service:", error);
    process.exit(1);
  }
}

main();