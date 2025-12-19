const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const FileManager = require("./file-manager");

class RoundCreator {
  constructor() {
    this.fileManager = new FileManager();
  }

  /**
   * Create a new round
   */
  async createRound(options = {}) {
    console.log(chalk.green("🎮 Hacker Jeopardy Round Creator"));
    console.log("================================\n");

    // Validate repository
    this.fileManager.validateRepository();

    // Get round information
    const roundInfo = await this.getRoundInfo(options.template);

    // Create directory structure
    const spinner = ora("Creating round structure...").start();
    try {
      const roundPath = await this.fileManager.createRoundStructure(
        roundInfo.id,
        roundInfo.categories,
      );
      spinner.succeed(`Round structure created at ${roundPath}`);

      // Save round metadata
      await this.fileManager.saveRoundMetadata(roundInfo.id, {
        name: roundInfo.name,
        categories: roundInfo.categories,
        comment: roundInfo.description,
        author: roundInfo.author,
        version: "1.0.0",
        created: new Date().toISOString().split("T")[0],
      });

      console.log(chalk.green("\n✅ Round created successfully!"));
      console.log(`ID: ${roundInfo.id}`);
      console.log(`Name: ${roundInfo.name}`);
      console.log(`Categories: ${roundInfo.categories.length}`);

      // Ask if user wants to add questions now
      const { addQuestions } = await inquirer.prompt([
        {
          type: "confirm",
          name: "addQuestions",
          message: "Would you like to add questions to the categories now?",
          default: true,
        },
      ]);

      if (addQuestions) {
        // Import here to avoid circular dependency
        const QuestionEditor = require("./question-editor");
        const editor = new QuestionEditor();

        for (const category of roundInfo.categories) {
          console.log(chalk.blue(`\n🎯 Adding questions to: ${category}`));

          const { addToCategory } = await inquirer.prompt([
            {
              type: "confirm",
              name: "addToCategory",
              message: `Add questions to "${category}"?`,
              default: true,
            },
          ]);

          if (addToCategory) {
            await editor.addQuestions(roundInfo.id, category, 5);
          }
        }
      }
    } catch (error) {
      spinner.fail("Failed to create round");
      throw error;
    }
  }

  /**
   * Edit an existing round
   */
  async editRound(roundId) {
    console.log(chalk.green(`🎮 Editing Round: ${roundId}`));
    console.log("========================\n");

    // Check if round exists
    if (!(await this.fileManager.roundExists(roundId))) {
      throw new Error(`Round "${roundId}" does not exist.`);
    }

    // Load existing metadata
    const metadata = await this.fileManager.loadRoundMetadata(roundId);

    console.log(chalk.blue("Current round information:"));
    console.log(`Name: ${metadata.name}`);
    console.log(`Categories: ${metadata.categories.join(", ")}`);
    console.log(`Author: ${metadata.author}`);
    console.log(`Description: ${metadata.comment || "None"}\n`);

    // Ask what to edit
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to edit?",
        choices: [
          {
            name: "Round metadata (name, author, description)",
            value: "metadata",
          },
          { name: "Categories (add, remove, rename)", value: "categories" },
          { name: "Add questions to categories", value: "questions" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "metadata":
        await this.editMetadata(roundId, metadata);
        break;
      case "categories":
        await this.editCategories(roundId, metadata);
        break;
      case "questions":
        await this.editQuestions(roundId, metadata);
        break;
      case "cancel":
        console.log("Edit cancelled.");
        return;
    }
  }

  /**
   * Get round information from user or template
   */
  async getRoundInfo(template) {
    let roundInfo = {};

    if (template) {
      roundInfo = await this.loadTemplate(template);
    }

    // Get round ID
    const { id } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "Round ID (lowercase, underscores only):",
        default: roundInfo.id || "",
        validate: (input) => {
          if (!input) return "Round ID is required";
          if (!/^[a-z0-9_]+$/.test(input))
            return "Round ID must contain only lowercase letters, numbers, and underscores";
          return true;
        },
      },
    ]);

    // Check if round already exists
    if (await this.fileManager.roundExists(id)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `Round "${id}" already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log("Round creation cancelled.");
        process.exit(0);
      }
    }

    // Get round details
    const details = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Round display name:",
        default: roundInfo.name || "",
      },
      {
        type: "input",
        name: "description",
        message: "Round description:",
        default: roundInfo.description || "",
      },
      {
        type: "input",
        name: "author",
        message: "Author name:",
        default: roundInfo.author || "Hacker Jeopardy Community",
      },
    ]);

    // Get categories
    const categories = await this.getCategories(roundInfo.categories);

    return {
      id,
      name: details.name,
      description: details.description,
      author: details.author,
      categories,
    };
  }

  /**
   * Load round template
   */
  async loadTemplate(templateName) {
    try {
      const templatesPath = path.join(
        __dirname,
        "..",
        "templates",
        "round-templates.json",
      );
      const templates = require(templatesPath);

      const template = templates[templateName];
      if (!template) {
        console.log(
          chalk.yellow(
            `Template "${templateName}" not found. Available templates:`,
          ),
        );
        Object.keys(templates).forEach((key) => {
          const t = templates[key];
          console.log(`  ${key}: ${t.name} - ${t.description}`);
        });
        return {};
      }

      return {
        id: templateName,
        name: template.name,
        description: template.description,
        author: template.author,
        categories: template.categories,
      };
    } catch (error) {
      console.warn(chalk.yellow("Could not load templates, using defaults"));
      return {};
    }
  }

  /**
   * Get categories from user
   */
  async getCategories(existingCategories = []) {
    const categories = [...existingCategories];

    if (categories.length === 0) {
      console.log(chalk.blue("\n📂 Category Creation"));
      console.log("==================\n");

      for (let i = 1; i <= 6; i++) {
        const { category } = await inquirer.prompt([
          {
            type: "input",
            name: "category",
            message: `Category ${i} name (fun theme):`,
            validate: (input) =>
              input.trim() !== "" || "Category name is required",
          },
        ]);
        categories.push(category.trim());
      }
    }

    return categories;
  }

  /**
   * Edit round metadata
   */
  async editMetadata(roundId, currentMetadata) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "New round name:",
        default: currentMetadata.name,
      },
      {
        type: "input",
        name: "author",
        message: "New author:",
        default: currentMetadata.author,
      },
      {
        type: "input",
        name: "comment",
        message: "New description:",
        default: currentMetadata.comment || "",
      },
    ]);

    const updatedMetadata = {
      ...currentMetadata,
      name: answers.name,
      author: answers.author,
      comment: answers.comment,
    };

    await this.fileManager.saveRoundMetadata(roundId, updatedMetadata);
    console.log(chalk.green("✅ Round metadata updated!"));
  }

  /**
   * Edit categories
   */
  async editCategories(roundId, metadata) {
    console.log(
      "Category editing not yet implemented. Please manually edit the round.json file.",
    );
  }

  /**
   * Edit questions
   */
  async editQuestions(roundId, metadata) {
    const QuestionEditor = require("./question-editor");
    const editor = new QuestionEditor();

    for (const category of metadata.categories) {
      const { editCategory } = await inquirer.prompt([
        {
          type: "confirm",
          name: "editCategory",
          message: `Edit questions for "${category}"?`,
          default: false,
        },
      ]);

      if (editCategory) {
        await editor.addQuestions(roundId, category, 5);
      }
    }
  }
}

module.exports = RoundCreator;
