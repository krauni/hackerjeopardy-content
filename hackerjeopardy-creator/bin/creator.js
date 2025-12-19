#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");

const program = new Command();

// Import our custom modules
const RoundCreator = require("../lib/round-creator");
const QuestionEditor = require("../lib/question-editor");
const Validator = require("../lib/validator");
const FileManager = require("../lib/file-manager");

program
  .name("hackerjeopardy-creator")
  .description("CLI tool for creating Hacker Jeopardy content")
  .version("1.0.0");

// Create new round
program
  .command("create-round")
  .description("Create a new Jeopardy round")
  .option("-t, --template <template>", "Use a template for the round")
  .option("-o, --output <path>", "Output directory (defaults to ./rounds)")
  .action(async (options) => {
    try {
      const creator = new RoundCreator();
      await creator.createRound(options);
    } catch (error) {
      console.error(chalk.red("Error creating round:"), error.message);
      process.exit(1);
    }
  });

// Edit existing round
program
  .command("edit-round <roundId>")
  .description("Edit an existing round")
  .action(async (roundId) => {
    try {
      const creator = new RoundCreator();
      await creator.editRound(roundId);
    } catch (error) {
      console.error(chalk.red("Error editing round:"), error.message);
      process.exit(1);
    }
  });

// Add questions to category
program
  .command("add-questions <roundId> <categoryName>")
  .description("Add questions to a specific category")
  .option("-c, --count <number>", "Number of questions to add", "5")
  .action(async (roundId, categoryName, options) => {
    try {
      const editor = new QuestionEditor();
      await editor.addQuestions(roundId, categoryName, parseInt(options.count));
    } catch (error) {
      console.error(chalk.red("Error adding questions:"), error.message);
      process.exit(1);
    }
  });

// Validate round
program
  .command("validate <roundId>")
  .description("Validate a round for correctness")
  .action(async (roundId) => {
    try {
      const validator = new Validator();
      await validator.validateRound(roundId);
    } catch (error) {
      console.error(chalk.red("Validation failed:"), error.message);
      process.exit(1);
    }
  });

// List available rounds
program
  .command("list")
  .description("List all available rounds")
  .action(async () => {
    try {
      const fileManager = new FileManager();
      await fileManager.listRounds();
    } catch (error) {
      console.error(chalk.red("Error listing rounds:"), error.message);
      process.exit(1);
    }
  });

// Generate question suggestions (LLM-powered)
program
  .command("suggest-questions")
  .description("Generate question suggestions using AI")
  .option("-c, --category <category>", "Category name")
  .option(
    "-d, --difficulty <level>",
    "Difficulty level (100, 200, 300, 400, 500)",
  )
  .option("-n, --number <count>", "Number of suggestions", "3")
  .action(async (options) => {
    try {
      const editor = new QuestionEditor();
      await editor.generateSuggestions(options);
    } catch (error) {
      console.error(chalk.red("Error generating suggestions:"), error.message);
      process.exit(1);
    }
  });

// Show help if no command provided
program.action(() => {
  program.help();
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error(chalk.red("Unhandled error:"), error);
  process.exit(1);
});

// Parse command line arguments
program.parse();
