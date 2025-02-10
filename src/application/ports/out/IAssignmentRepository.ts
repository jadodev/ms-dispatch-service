import { Assignment } from "../../../domain/entity/Assignament";

/** 
*Puerto para persistir el despacho
**/
export interface IAssignmentRepository{
    save(assignment: Assignment): Promise<void>;
}