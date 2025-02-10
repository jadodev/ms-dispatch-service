"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../../../../src/infrastructure/config/database', () => {
    let assignments = [];
    return {
        getConnection: async () => ({
            execute: async (sql, params) => {
                if (sql.includes('CREATE TABLE IF NOT EXISTS Assignment')) {
                    assignments = [];
                }
                else if (sql.includes('DELETE FROM Assignment')) {
                    assignments = [];
                }
                else if (sql.includes('DROP TABLE IF EXISTS Assignment')) {
                    assignments = [];
                }
                else if (sql.includes('INSERT INTO Assignment')) {
                    const newAssignment = {
                        assignmentId: params ? params[0] : null,
                        shipmentId: params ? params[1] : null,
                        driverId: params ? params[2] : null,
                        assignedAt: params ? params[3] : null,
                        score: params ? params[4] : null,
                    };
                    assignments.push(newAssignment);
                }
                else if (sql.includes('SELECT * FROM Assignment')) {
                    const assignmentId = params ? params[0] : null;
                    const result = assignments.filter(a => a.assignmentId === assignmentId);
                    return [result];
                }
            },
            release: () => { }
        }),
        end: async () => { }
    };
});
const dns_1 = __importDefault(require("dns"));
const originalLookup = dns_1.default.lookup;
const patchedLookup = ((hostname, optionsOrCallback, callback) => {
    if (hostname === 'mysql') {
        if (typeof optionsOrCallback === 'function') {
            return originalLookup('127.0.0.1', optionsOrCallback);
        }
        return originalLookup('127.0.0.1', optionsOrCallback, callback);
    }
    return originalLookup(hostname, optionsOrCallback, callback);
});
patchedLookup.__promisify__ = originalLookup.__promisify__;
dns_1.default.lookup = patchedLookup;
jest.setTimeout(30000);
const MySQLAssignmentRepository_1 = require("../../../../src/infrastructure/repository/MySQLAssignmentRepository");
const database_1 = __importDefault(require("../../../../src/infrastructure/config/database"));
const Assignament_1 = require("../../../domain/entity/Assignament");
describe('Integration: MySQLAssignmentRepository', () => {
    let repository;
    beforeAll(async () => {
        repository = new MySQLAssignmentRepository_1.MySQLAssignmentRepository();
        const connection = await database_1.default.getConnection();
        try {
            await connection.execute(`
          CREATE TABLE IF NOT EXISTS Assignment (
            assignmentId VARCHAR(255) PRIMARY KEY,
            shipmentId VARCHAR(255),
            driverId VARCHAR(255),
            assignedAt DATETIME,
            score INT
          )
        `);
        }
        finally {
            connection.release();
        }
    });
    beforeEach(async () => {
        const connection = await database_1.default.getConnection();
        try {
            await connection.execute(`DELETE FROM Assignment`);
        }
        finally {
            connection.release();
        }
    });
    afterAll(async () => {
        const connection = await database_1.default.getConnection();
        try {
            await connection.execute(`DROP TABLE IF EXISTS Assignment`);
        }
        finally {
            connection.release();
        }
        await database_1.default.end();
    });
    it('should save an Assignment correctly', async () => {
        const assignment = Assignament_1.Assignment.create('a1', 's1', 1);
        assignment.assignedAt = new Date('2025-02-10T00:00:00.000Z');
        assignment.score = 85;
        await repository.save(assignment);
        const connection = await database_1.default.getConnection();
        try {
            const [rows] = await connection.execute('SELECT * FROM Assignment WHERE assignmentId = ?', [assignment.assignmentId]);
            const results = rows;
            expect(results.length).toBe(1);
            const savedRecord = results[0];
            expect(savedRecord.assignmentId).toBe(assignment.assignmentId);
            expect(savedRecord.shipmentId).toBe(assignment.shipmentId);
            expect(savedRecord.driverId).toBe(assignment.driverId);
            expect(new Date(savedRecord.assignedAt).toISOString()).toBe(assignment.assignedAt.toISOString());
            expect(savedRecord.score).toBe(assignment.score);
        }
        finally {
            connection.release();
        }
    });
});
