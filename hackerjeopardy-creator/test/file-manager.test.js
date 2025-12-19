const FileManager = require("../lib/file-manager");

describe("FileManager", () => {
  let fileManager;

  beforeEach(() => {
    fileManager = new FileManager();
  });

  test("should find repository root", () => {
    const root = fileManager.findRepositoryRoot();
    expect(root).toContain("hackerjeopardy-content");
  });

  test("should validate repository structure", () => {
    // This test will pass if the repository structure is valid
    expect(() => {
      fileManager.validateRepository();
    }).not.toThrow();
  });

  test("should detect round existence", async () => {
    const exists = await fileManager.roundExists("demo_round");
    expect(exists).toBe(true);

    const notExists = await fileManager.roundExists("nonexistent_round");
    expect(notExists).toBe(false);
  });

  test("should detect category existence", async () => {
    const exists = await fileManager.categoryExists(
      "demo_round",
      "Programming",
    );
    expect(exists).toBe(true);

    const notExists = await fileManager.categoryExists(
      "demo_round",
      "NonexistentCategory",
    );
    expect(notExists).toBe(false);
  });
});
