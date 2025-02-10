import { AssignmentDto } from "../../dto/AssignmentDto";

/**
*Puerto para despachar un paquete
**/
export interface IDispatchShipmentUseCase {
    execute(dto: AssignmentDto): Promise<AssignmentDto>;
}