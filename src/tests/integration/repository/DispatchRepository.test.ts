jest.mock('../../../../src/infrastructure/config/database', () => {
    let assignments: any[] = [];
  
    return {
      getConnection: async () => ({
        execute: async (sql: string, params?: any[]) => {
          if (sql.includes('CREATE TABLE IF NOT EXISTS Assignment')) {
            assignments = [];
          } else if (sql.includes('DELETE FROM Assignment')) {
            assignments = [];
          } else if (sql.includes('DROP TABLE IF EXISTS Assignment')) {
            assignments = [];
          } else if (sql.includes('INSERT INTO Assignment')) {
            const newAssignment = {
              assignmentId: params ? params[0] : null,
              shipmentId: params ? params[1] : null,
              driverId: params ? params[2] : null,
              assignedAt: params ? params[3] : null,
              score: params ? params[4] : null,
            };
            assignments.push(newAssignment);
          } else if (sql.includes('SELECT * FROM Assignment')) {
            const assignmentId = params ? params[0] : null;
            const result = assignments.filter(a => a.assignmentId === assignmentId);
            return [result];
          }
        },
        release: () => {}
      }),
      end: async () => {}
    };
  });
  
  import dns, { LookupOptions } from 'dns';
  
  const originalLookup = dns.lookup;
  const patchedLookup = ((hostname: string, optionsOrCallback?: any, callback?: any) => {
    if (hostname === 'mysql') {
      if (typeof optionsOrCallback === 'function') {
        return originalLookup('127.0.0.1', optionsOrCallback);
      }
      return originalLookup('127.0.0.1', optionsOrCallback as LookupOptions, callback);
    }
    return originalLookup(hostname, optionsOrCallback, callback);
  }) as typeof dns.lookup;
  patchedLookup.__promisify__ = originalLookup.__promisify__;
  dns.lookup = patchedLookup;
  
  jest.setTimeout(30000);
  
  import { MySQLAssignmentRepository } from '../../../../src/infrastructure/repository/MySQLAssignmentRepository';
  import pool from '../../../../src/infrastructure/config/database';
import { Assignment } from '../../../domain/entity/Assignament';
  
  describe('Integration: MySQLAssignmentRepository', () => {
    let repository: MySQLAssignmentRepository;
  
    beforeAll(async () => {
      repository = new MySQLAssignmentRepository();
  
      const connection = await pool.getConnection();
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
      } finally {
        connection.release();
      }
    });
  
    beforeEach(async () => {
      const connection = await pool.getConnection();
      try {
        await connection.execute(`DELETE FROM Assignment`);
      } finally {
        connection.release();
      }
    });
  
    afterAll(async () => {
      const connection = await pool.getConnection();
      try {
        await connection.execute(`DROP TABLE IF EXISTS Assignment`);
      } finally {
        connection.release();
      }
      await pool.end();
    });
  
    it('should save an Assignment correctly', async () => {
      const assignment = Assignment.create('a1', 's1', 1);
      (assignment as any).assignedAt = new Date('2025-02-10T00:00:00.000Z');
      (assignment as any).score = 85;
  
      await repository.save(assignment);
  
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.execute(
          'SELECT * FROM Assignment WHERE assignmentId = ?',
          [assignment.assignmentId]
        );
        const results = rows as any[];
  
        expect(results.length).toBe(1);
  
        const savedRecord = results[0];
        expect(savedRecord.assignmentId).toBe(assignment.assignmentId);
        expect(savedRecord.shipmentId).toBe(assignment.shipmentId);
        expect(savedRecord.driverId).toBe(assignment.driverId);
        expect(new Date(savedRecord.assignedAt).toISOString()).toBe(assignment.assignedAt.toISOString());
        expect(savedRecord.score).toBe(assignment.score);
      } finally {
        connection.release();
      }
    });
  });