import { format } from 'date-fns';
import pool from "../config/database";
import { IAssignmentRepository } from "../../application/ports/out/IAssignmentRepository";
import { Assignment } from '../../domain/entity/Assignament';
/**
 * MySQLAssignmentRepository es la implementación concreta del puerto outbound para la persistencia
 * de la entidad Assignment utilizando MySQL.
 */
export class MySQLAssignmentRepository implements IAssignmentRepository {
  public async save(assignment: Assignment): Promise<void> {
    const connection = await pool.getConnection();
    try {
      const sql = `
        INSERT INTO Assignment 
          (assignmentId, shipmentId, driverId, assignedAt, score)
        VALUES 
          (?, ?, ?, ?, ?)
      `;
      await connection.execute(sql, [
        assignment.assignmentId,
        assignment.shipmentId,
        assignment.driverId,
        format(assignment.assignedAt, 'yyyy-MM-dd HH:mm:ss'),
        assignment.score,
      ]);
    } finally {
      connection.release();
    }
  }
}
