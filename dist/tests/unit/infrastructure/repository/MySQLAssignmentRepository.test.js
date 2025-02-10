"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MySQLAssignmentRepository_1 = require("../../../../infrastructure/repository/MySQLAssignmentRepository");
const database_1 = __importDefault(require("../../../../infrastructure/config/database"));
jest.mock("../../../../infrastructure/config/database", () => ({
    getConnection: jest.fn(),
}));
describe("MySQLAssignmentRepository", () => {
    let repository;
    let mockConnection;
    beforeEach(() => {
        mockConnection = {
            execute: jest.fn().mockResolvedValue([]),
            release: jest.fn(),
        };
        database_1.default.getConnection.mockResolvedValue(mockConnection);
        repository = new MySQLAssignmentRepository_1.MySQLAssignmentRepository();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("debe liberar la conexión aun cuando la ejecución falle", async () => {
        const error = new Error("Error de base de datos");
        mockConnection.execute.mockRejectedValue(error);
        const assignment = {
            assignmentId: "2",
            shipmentId: "102",
            driverId: "502",
            assignedAt: new Date("2025-02-10T11:00:00Z"),
            score: 80,
        };
        await expect(repository.save(assignment)).rejects.toThrow("Error de base de datos");
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
