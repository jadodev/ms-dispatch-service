# ms-dispatch-service

## Documentación de la API con Swagger

La aplicación incluye documentación interactiva de la API generada con Swagger. Una vez que la aplicación esté en ejecución, puedes acceder a la documentación abriendo tu navegador y navegando a:

**http://localhost:4050/api-doc**

Asegúrate de que la aplicación se esté ejecutando en el puerto configurado para Swagger.

```plaintext
\---src
    |   index.ts
    |
    +---application
    |   +---dto
    |   |       AssignmentDto.ts
    |   |       CreateAssignmentDto.ts
    |   |
    |   +---mapper
    |   |       AssignmentMapper.ts
    |   |
    |   +---ports
    |   |   +---in
    |   |   |       IDispatchShipmentUseCase.ts
    |   |   |
    |   |   \---out
    |   |           IAssignmentRepository.ts
    |   |
    |   \---service
    |           DispatchShipmentService.ts
    |
    +---domain
    |   +---entity
    |   |       Assignament.ts
    |   |
    |   +---exceptions
    |   |       DomainError.ts
    |   |
    |   \---service
    |           DispatchDomainService.ts
    |
    +---infrastructure
    |   +---config
    |   |       database.ts
    |   |       messageBroker.ts
    |   |
    |   +---controller
    |   |       DispatchController.ts
    |   |
    |   +---mappers
    |   |       DriverStatusDataMapper.ts
    |   |
    |   +---messaging
    |   |       EventPublisher.ts
    |   |       KafkaConsumer.ts
    |   |       KafkaProducer.ts
    |   |       ShipmentCreatedConsumer.ts
    |   |
    |   +---repository
    |   |       MySQLAssignmentRepository.ts
    |   |
    |   \---swagger
    |           swaggerConfig.ts
    |
    \---tests
        +---integration
        |   +---controller
        |   |       DispatchController.test.ts
        |   |
        |   +---repository
        |   |       DispatchRepository.test.ts
        |   |
        |   \---service
        |           DispatchService.test.ts
        |
        \---unit
            +---application
            |   +---mappers
            |   |       AssignmentMapper.test.ts
            |   |
            |   \---services
            |           DispatchShipmentService.test.ts
            |
            +---domain
            |   \---services
            |           DispatchDomainService.test.ts
            |
            \---infrastructure
                +---config
                |       database.test.ts
                |       messageBroker.test.ts
                |
                +---messaging
                |       EventPublisher.test.ts
                |       KafkaConsumer.test.ts
                |       KafkaProducer.test.ts
                |       ShipmentCreatedConsumer.test.ts
                |
                \---repository
                        MySQLAssignmentRepository.test.ts
