import { AssignmentDto } from "../../dto/AssignmentDto";
import { CreateAssignmentDto } from "../../dto/CreateAssignmentDto";

/**
*Puerto para despachar un paquete
**/
export interface IDispatchShipmentUseCase {
    execute(dto: CreateAssignmentDto): Promise<AssignmentDto>;
}