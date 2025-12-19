const { exec } = require("child_process");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const FileManager = require("./file-manager");

class Validator {
  constructor() {
    this.fileManager = new FileManager();
  }

  /**
   * Validate a round using the existing validation script
   */
  async validateRound(roundId) {
    // Check if round exists
    if (!(await this.fileManager.roundExists(roundId))) {
      throw new Error(`Round "${roundId}" does not exist.`);
    }

    console.log(chalk.blue(`🔍 Validating round: ${roundId}`));

    // Find the validation script
    const validationScript = this.findValidationScript();

    if (!validationScript) {
      throw new Error(
        "Could not find validation script. Please run this from within a Hacker Jeopardy content repository.",
      );
    }

    // Run validation
    return new Promise((resolve, reject) => {
      const command = `node "${validationScript}" "${path.join(this.fileManager.roundsPath, roundId)}"`;

      exec(
        command,
        { cwd: this.fileManager.basePath },
        (error, stdout, stderr) => {
          if (stdout) {
            console.log(stdout);
          }

          if (stderr) {
            console.error(stderr);
          }

          if (error) {
            reject(new Error(`Validation failed: ${error.message}`));
          } else {
            resolve();
          }
        },
      );
    });
  }

  /**
   * Find the validation script in the repository
   */
  findValidationScript() {
    const possiblePaths = [
      path.join(this.fileManager.basePath, "scripts", "validate.js"),
      path.join(this.fileManager.basePath, "validate.js"),
    ];

    for (const scriptPath of possiblePaths) {
      if (fs.existsSync(scriptPath)) {
        return scriptPath;
      }
    }

    return null;
  }

  /**
   * Validate JSON structure of a round
   */
  async validateRoundStructure(roundId) {
    const metadata = await this.fileManager.loadRoundMetadata(roundId);

    // Validate round.json
    this.validateRoundMetadata(metadata);

    // Validate each category
    for (const category of metadata.categories) {
      await this.validateCategoryStructure(roundId, category);
    }

    console.log(chalk.green("✅ Round structure is valid!"));
  }

  /**
   * Validate round metadata
   */
  validateRoundMetadata(metadata) {
    const required = ["name", "categories"];

    for (const field of required) {
      if (!metadata[field]) {
        throw new Error(`Missing required field: ${field} in round.json`);
      }
    }

    if (!Array.isArray(metadata.categories)) {
      throw new Error("categories must be an array");
    }

    if (metadata.categories.length === 0) {
      throw new Error("Round must have at least one category");
    }
  }

  /**
   * Validate category structure
   */
  async validateCategoryStructure(roundId, categoryName) {
    if (!(await this.fileManager.categoryExists(roundId, categoryName))) {
      throw new Error(`Category directory "${categoryName}" does not exist`);
    }

    const questions = await this.fileManager.loadCategoryQuestions(
      roundId,
      categoryName,
    );

    if (!Array.isArray(questions)) {
      throw new Error(
        `Questions for category "${categoryName}" must be an array`,
      );
    }

    // Validate each question
    for (const [index, question] of questions.entries()) {
      this.validateQuestion(question, index, categoryName);
    }
  }

  /**
   * Validate individual question
   */
  validateQuestion(question, index, categoryName) {
    const prefix = `${categoryName}[${index}]`;

    // Required fields
    if (!question.answer || typeof question.answer !== "string") {
      throw new Error(
        `${prefix}: Missing or invalid 'answer' field (the clue)`,
      );
    }

    if (!question.question || typeof question.question !== "string") {
      throw new Error(
        `${prefix}: Missing or invalid 'question' field (the response)`,
      );
    }

    if (typeof question.available !== "boolean") {
      throw new Error(`${prefix}: 'available' field must be a boolean`);
    }

    if (typeof question.value !== "number" || question.value <= 0) {
      throw new Error(`${prefix}: 'value' must be a positive number`);
    }

    if (!question.cat || typeof question.cat !== "string") {
      throw new Error(`${prefix}: Missing or invalid 'cat' field`);
    }

    // Validate point value is in Jeopardy range
    if (![100, 200, 300, 400, 500].includes(question.value)) {
      throw new Error(
        `${prefix}: Point value must be 100, 200, 300, 400, or 500`,
      );
    }

    // Optional image field
    if (question.image && typeof question.image !== "string") {
      throw new Error(`${prefix}: 'image' field must be a string`);
    }
  }
}

module.exports = Validator;
