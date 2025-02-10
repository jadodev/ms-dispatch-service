import { MySQLAssignmentRepository } from "../../../../infrastructure/repository/MySQLAssignmentRepository";
import pool from "../../../../infrastructure/config/database";
import { Assignment } from "../../../../domain/entity/Assignament";

jest.mock("../../../../infrastructure/config/database", () => ({
  getConnection: jest.fn(),
}));

describe("MySQLAssignmentRepository", () => {
  let repository: MySQLAssignmentRepository;
  let mockConnection: {
    execute: jest.Mock;
    release: jest.Mock;
  };

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn().mockResolvedValue([]),
      release: jest.fn(),
    };

    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

    repository = new MySQLAssignmentRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe liberar la conexión aun cuando la ejecución falle", async () => {
    const error = new Error("Error de base de datos");
    mockConnection.execute.mockRejectedValue(error);

    const assignment: Assignment = {
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
