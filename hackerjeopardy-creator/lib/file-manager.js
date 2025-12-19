const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const Table = require("cli-table3");

class FileManager {
  constructor() {
    this.basePath = this.findRepositoryRoot();
    this.roundsPath = path.join(this.basePath, "rounds");
  }

  /**
   * Find the repository root by looking for package.json or rounds directory
   */
  findRepositoryRoot() {
    let currentDir = process.cwd();

    // Check if we're already in the right directory
    if (fs.existsSync(path.join(currentDir, "rounds"))) {
      return currentDir;
    }

    // Look up the directory tree
    for (let i = 0; i < 10; i++) {
      if (fs.existsSync(path.join(currentDir, "rounds"))) {
        return currentDir;
      }
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break; // Reached root
      currentDir = parentDir;
    }

    // Fallback to current directory
    return process.cwd();
  }

  /**
   * Check if we're in a valid repository
   */
  validateRepository() {
    if (!fs.existsSync(this.roundsPath)) {
      throw new Error(
        `Rounds directory not found at ${this.roundsPath}. Please run this command from within a Hacker Jeopardy content repository.`,
      );
    }

    const manifestPath = path.join(this.basePath, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      console.warn(
        chalk.yellow(
          "Warning: manifest.json not found. This may not be a complete repository.",
        ),
      );
    }
  }

  /**
   * List all available rounds
   */
  async listRounds() {
    this.validateRepository();

    const roundDirs = await fs.readdir(this.roundsPath);
    const rounds = [];

    for (const dir of roundDirs) {
      const roundPath = path.join(this.roundsPath, dir);
      const stat = await fs.stat(roundPath);

      if (stat.isDirectory()) {
        const roundJsonPath = path.join(roundPath, "round.json");
        let roundData = { name: dir, categories: [] };

        if (await fs.pathExists(roundJsonPath)) {
          try {
            roundData = await fs.readJson(roundJsonPath);
          } catch (error) {
            // Use default data if JSON is invalid
          }
        }

        rounds.push({
          id: dir,
          name: roundData.name || dir,
          categories: roundData.categories?.length || 0,
          path: roundPath,
        });
      }
    }

    if (rounds.length === 0) {
      console.log(chalk.yellow("No rounds found."));
      return;
    }

    const table = new Table({
      head: [
        chalk.cyan("ID"),
        chalk.cyan("Name"),
        chalk.cyan("Categories"),
        chalk.cyan("Path"),
      ],
      colWidths: [20, 30, 12, 40],
    });

    rounds.forEach((round) => {
      table.push([round.id, round.name, round.categories, round.path]);
    });

    console.log(chalk.green("\n🎮 Available Rounds:"));
    console.log(table.toString());
  }

  /**
   * Create round directory structure
   */
  async createRoundStructure(roundId, categories) {
    const roundPath = path.join(this.roundsPath, roundId);
    const roundJsonPath = path.join(roundPath, "round.json");

    // Create round directory
    await fs.ensureDir(roundPath);

    // Create category directories
    for (const category of categories) {
      const categoryPath = path.join(roundPath, category);
      const catJsonPath = path.join(categoryPath, "cat.json");

      await fs.ensureDir(categoryPath);

      // Create empty cat.json
      const catData = {
        name: category,
        difficulty: "mixed",
        author: "Hacker Jeopardy Community",
        licence: "MIT",
        date: new Date().toISOString().split("T")[0],
        questions: [],
      };

      await fs.writeJson(catJsonPath, catData, { spaces: 2 });
    }

    return roundPath;
  }

  /**
   * Save round metadata
   */
  async saveRoundMetadata(roundId, metadata) {
    const roundJsonPath = path.join(this.roundsPath, roundId, "round.json");
    await fs.writeJson(roundJsonPath, metadata, { spaces: 2 });
  }

  /**
   * Load round metadata
   */
  async loadRoundMetadata(roundId) {
    const roundJsonPath = path.join(this.roundsPath, roundId, "round.json");
    return await fs.readJson(roundJsonPath);
  }

  /**
   * Save category questions
   */
  async saveCategoryQuestions(roundId, categoryName, questions) {
    const catJsonPath = path.join(
      this.roundsPath,
      roundId,
      categoryName,
      "cat.json",
    );

    let catData = { name: categoryName };
    if (await fs.pathExists(catJsonPath)) {
      catData = await fs.readJson(catJsonPath);
    }

    catData.questions = questions;
    catData.date = new Date().toISOString().split("T")[0];

    await fs.writeJson(catJsonPath, catData, { spaces: 2 });
  }

  /**
   * Load category questions
   */
  async loadCategoryQuestions(roundId, categoryName) {
    const catJsonPath = path.join(
      this.roundsPath,
      roundId,
      categoryName,
      "cat.json",
    );
    const catData = await fs.readJson(catJsonPath);
    return catData.questions || [];
  }

  /**
   * Check if round exists
   */
  async roundExists(roundId) {
    const roundPath = path.join(this.roundsPath, roundId);
    return await fs.pathExists(roundPath);
  }

  /**
   * Check if category exists in round
   */
  async categoryExists(roundId, categoryName) {
    const categoryPath = path.join(this.roundsPath, roundId, categoryName);
    return await fs.pathExists(categoryPath);
  }
}

module.exports = FileManager;
