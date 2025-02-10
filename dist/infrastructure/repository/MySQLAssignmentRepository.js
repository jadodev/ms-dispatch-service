"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLAssignmentRepository = void 0;
const date_fns_1 = require("date-fns");
const database_1 = __importDefault(require("../config/database"));
/**
 * MySQLAssignmentRepository es la implementación concreta del puerto outbound para la persistencia
 * de la entidad Assignment utilizando MySQL.
 */
class MySQLAssignmentRepository {
    async save(assignment) {
        const connection = await database_1.default.getConnection();
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
                (0, date_fns_1.format)(assignment.assignedAt, 'yyyy-MM-dd HH:mm:ss'),
                assignment.score,
            ]);
        }
        finally {
            connection.release();
        }
    }
}
exports.MySQLAssignmentRepository = MySQLAssignmentRepository;
