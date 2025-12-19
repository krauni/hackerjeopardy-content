#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Content Validation Script for Hacker Jeopardy
 * Validates round structure and question format compliance
 */

class ContentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateRound(roundPath) {
    console.log(`\n🔍 Validating round: ${roundPath}`);

    const roundId = path.basename(roundPath);
    const roundJsonPath = path.join(roundPath, "round.json");

    // Check if round.json exists
    if (!fs.existsSync(roundJsonPath)) {
      this.errors.push(`${roundId}: Missing round.json file`);
      return;
    }

    // Validate round.json
    let roundData;
    try {
      roundData = JSON.parse(fs.readFileSync(roundJsonPath, "utf8"));
    } catch (error) {
      this.errors.push(
        `${roundId}: Invalid JSON in round.json - ${error.message}`,
      );
      return;
    }

    this.validateRoundMetadata(roundData, roundId);

    // Check categories
    if (roundData.categories && Array.isArray(roundData.categories)) {
      roundData.categories.forEach((categoryName) => {
        this.validateCategory(roundPath, categoryName, roundId);
      });

      // Check for orphaned images in round root
      this.validateRoundRootImages(roundPath, roundId, roundData.categories);
    }
  }

  validateRoundMetadata(roundData, roundId) {
    const required = ["name", "categories"];
    const optional = ["comment", "author", "version", "created"];

    // Check required fields
    required.forEach((field) => {
      if (!roundData[field]) {
        this.errors.push(
          `${roundId}: Missing required field '${field}' in round.json`,
        );
      }
    });

    // Validate categories array
    if (!Array.isArray(roundData.categories)) {
      this.errors.push(`${roundId}: 'categories' must be an array`);
    } else if (roundData.categories.length === 0) {
      this.warnings.push(`${roundId}: Round has no categories`);
    }

    // Check for unknown fields
    const allFields = [...required, ...optional];
    Object.keys(roundData).forEach((field) => {
      if (!allFields.includes(field)) {
        this.warnings.push(
          `${roundId}: Unknown field '${field}' in round.json`,
        );
      }
    });
  }

  validateCategory(roundPath, categoryName, roundId) {
    const categoryPath = path.join(roundPath, categoryName);
    const catJsonPath = path.join(categoryPath, "cat.json");

    if (!fs.existsSync(categoryPath)) {
      this.errors.push(
        `${roundId}/${categoryName}: Category directory does not exist`,
      );
      return;
    }

    if (!fs.existsSync(catJsonPath)) {
      this.errors.push(`${roundId}/${categoryName}: Missing cat.json file`);
      return;
    }

    let categoryData;
    try {
      categoryData = JSON.parse(fs.readFileSync(catJsonPath, "utf8"));
    } catch (error) {
      this.errors.push(
        `${roundId}/${categoryName}: Invalid JSON in cat.json - ${error.message}`,
      );
      return;
    }

    this.validateCategoryData(categoryData, roundId, categoryName);
  }

  validateCategoryData(categoryData, roundId, categoryName) {
    const prefix = `${roundId}/${categoryName}`;

    // Check required fields
    if (!categoryData.name) {
      this.errors.push(`${prefix}: Missing required field 'name'`);
    }

    if (!Array.isArray(categoryData.questions)) {
      this.errors.push(`${prefix}: 'questions' must be an array`);
      return;
    }

    if (categoryData.questions.length === 0) {
      this.warnings.push(`${prefix}: Category has no questions`);
      return;
    }

    // Validate each question
    categoryData.questions.forEach((question, index) => {
      this.validateQuestion(question, index, prefix);
    });
  }

  validateRoundRootImages(roundPath, roundId, categoryNames) {
    try {
      const roundFiles = fs.readdirSync(roundPath, { withFileTypes: true });

      // Find image files in round root (excluding round.json and directories)
      const rootImages = roundFiles
        .filter(
          (dirent) => !dirent.isDirectory() && dirent.name !== "round.json",
        )
        .filter((dirent) => {
          const ext = path.extname(dirent.name).toLowerCase();
          return [".jpg", ".jpeg", ".png", ".gif", ".svg"].includes(ext);
        })
        .map((dirent) => dirent.name);

      if (rootImages.length > 0) {
        rootImages.forEach((imageFile) => {
          this.errors.push(
            `${roundId}: Image file "${imageFile}" found in round root directory. Images must be placed in category subdirectories.`,
          );
        });
      }
    } catch (error) {
      this.warnings.push(
        `${roundId}: Could not check round root directory for orphaned images: ${error.message}`,
      );
    }
  }

  validateQuestion(question, index, prefix) {
    const qPrefix = `${prefix}/questions[${index}]`;

    // Check required fields
    if (!question.question || typeof question.question !== "string") {
      this.errors.push(`${qPrefix}: Missing or invalid 'question' field`);
    }

    // Check answer field (optional but recommended)
    if (question.answer && typeof question.answer !== "string") {
      this.errors.push(`${qPrefix}: 'answer' field must be a string`);
    }

    // Check image field (optional)
    if (question.image && typeof question.image !== "string") {
      this.errors.push(`${qPrefix}: 'image' field must be a string`);
    }

    // Validate image path format and existence
    if (question.image) {
      this.validateImagePath(question.image, qPrefix, prefix);
    }

    // Either answer or image should be present
    if (!question.answer && !question.image) {
      this.errors.push(
        `${qPrefix}: Question must have either 'answer' or 'image' field`,
      );
    }

    // Check available field
    if (typeof question.available !== "boolean") {
      this.errors.push(`${qPrefix}: 'available' field must be a boolean`);
    }

    // Check value field
    if (typeof question.value !== "number" || question.value <= 0) {
      this.errors.push(`${qPrefix}: 'value' must be a positive number`);
    }

    // Check cat field
    if (!question.cat || typeof question.cat !== "string") {
      this.errors.push(`${qPrefix}: Missing or invalid 'cat' field`);
    }
  }

  validateImagePath(imagePath, qPrefix, categoryPrefix) {
    // Extract round and category from prefix (format: "round_id/Category Name")
    const [roundId, categoryName] = categoryPrefix.split("/");
    const roundPath = path.join("rounds", roundId);
    const categoryPath = path.join(roundPath, categoryName);

    // Check that image path contains no directory separators
    if (imagePath.includes("/") || imagePath.includes("\\")) {
      this.errors.push(
        `${qPrefix}: Image path must be filename only, no directory separators: "${imagePath}"`,
      );
    }

    // Check that image exists in category directory
    const imageFullPath = path.join(categoryPath, imagePath);
    if (!fs.existsSync(imageFullPath)) {
      this.errors.push(
        `${qPrefix}: Referenced image file does not exist: "${imagePath}" (expected at ${imageFullPath})`,
      );
    }

    // Check that image is not in round root directory (common mistake)
    const imageInRoot = path.join(roundPath, imagePath);
    if (fs.existsSync(imageInRoot) && !fs.existsSync(imageFullPath)) {
      this.warnings.push(
        `${qPrefix}: Image "${imagePath}" exists in round root directory but should be in category directory (${categoryName}/)`,
      );
    }
  }

  validateAllRounds(roundsDir) {
    if (!fs.existsSync(roundsDir)) {
      console.error(`❌ Rounds directory not found: ${roundsDir}`);
      process.exit(1);
    }

    const roundDirs = fs
      .readdirSync(roundsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(roundsDir, dirent.name));

    console.log(`📂 Found ${roundDirs.length} rounds to validate`);

    roundDirs.forEach((roundPath) => {
      this.validateRound(roundPath);
    });

    this.printResults();
  }

  validateSingleRound(roundPath) {
    if (!fs.existsSync(roundPath)) {
      console.error(`❌ Round directory not found: ${roundPath}`);
      process.exit(1);
    }

    this.validateRound(roundPath);
    this.printResults();
  }

  printResults() {
    console.log(`\n📊 Validation Results:`);
    console.log(`   ❌ Errors: ${this.errors.length}`);
    console.log(`   ⚠️  Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      this.errors.forEach((error) => console.log(`   • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      this.warnings.forEach((warning) => console.log(`   • ${warning}`));
    }

    if (this.errors.length === 0) {
      console.log(`\n✅ Validation successful!`);
      if (this.warnings.length === 0) {
        console.log(`   No errors or warnings found.`);
      }
    } else {
      console.log(
        `\n❌ Validation failed with ${this.errors.length} error(s).`,
      );
      process.exit(1);
    }
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log(
      "  npm run validate rounds/round_id    # Validate specific round",
    );
    console.log("  npm run validate-all                 # Validate all rounds");
    process.exit(1);
  }

  const validator = new ContentValidator();

  if (args[0] === "--all") {
    validator.validateAllRounds("./rounds");
  } else {
    validator.validateSingleRound(args[0]);
  }
}

if (require.main === module) {
  main();
}

module.exports = ContentValidator;
