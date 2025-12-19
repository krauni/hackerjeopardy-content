const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const FileManager = require("./file-manager");

class QuestionEditor {
  constructor() {
    this.fileManager = new FileManager();
  }

  /**
   * Add questions to a category
   */
  async addQuestions(roundId, categoryName, count = 5) {
    console.log(chalk.blue(`\n🎯 Question Editor - ${categoryName}`));
    console.log("=".repeat(40));

    // Validate inputs
    if (!(await this.fileManager.roundExists(roundId))) {
      throw new Error(`Round "${roundId}" does not exist.`);
    }

    if (!(await this.fileManager.categoryExists(roundId, categoryName))) {
      throw new Error(
        `Category "${categoryName}" does not exist in round "${roundId}".`,
      );
    }

    // Load existing questions
    const existingQuestions = await this.fileManager.loadCategoryQuestions(
      roundId,
      categoryName,
    );
    const questions = [...existingQuestions];

    console.log(`Current questions: ${existingQuestions.length}`);

    // Determine point values to add
    const pointValues = this.getAvailablePointValues(existingQuestions);

    if (pointValues.length === 0) {
      console.log(
        chalk.yellow(
          "All point values (100-500) are already filled for this category.",
        ),
      );
      return;
    }

    console.log(`Available point values: ${pointValues.join(", ")}\n`);

    // Add questions
    for (let i = 0; i < Math.min(count, pointValues.length); i++) {
      const pointValue = pointValues[i];

      console.log(chalk.cyan(`\n📝 Creating ${pointValue}-point question:`));

      const question = await this.createQuestion(categoryName, pointValue);

      if (question) {
        questions.push(question);
        console.log(chalk.green("✅ Question added!"));

        // Ask to continue
        if (i < Math.min(count, pointValues.length) - 1) {
          const { continue: shouldContinue } = await inquirer.prompt([
            {
              type: "confirm",
              name: "continue",
              message: "Add another question?",
              default: true,
            },
          ]);

          if (!shouldContinue) break;
        }
      }
    }

    // Save questions
    if (questions.length > existingQuestions.length) {
      await this.fileManager.saveCategoryQuestions(
        roundId,
        categoryName,
        questions,
      );
      console.log(
        chalk.green(
          `\n✅ Saved ${questions.length - existingQuestions.length} new questions to ${categoryName}!`,
        ),
      );
    }
  }

  /**
   * Generate AI-powered question suggestions
   */
  async generateSuggestions(options = {}) {
    const { category, difficulty, number } = options;

    console.log(chalk.blue("\n🤖 AI Question Suggestions"));
    console.log("==========================\n");

    // Check for LLM availability
    if (!(await this.isLLMAvailable())) {
      console.log(
        chalk.yellow(
          "⚠️  Local LLM not available. Using basic templates instead.\n",
        ),
      );
      return this.generateBasicSuggestions(category, difficulty, number);
    }

    // Use LLM to generate suggestions
    const suggestions = await this.generateLLMSuggestions(
      category,
      difficulty,
      parseInt(number),
    );

    console.log(chalk.green(`Generated ${suggestions.length} suggestions:\n`));

    suggestions.forEach((suggestion, index) => {
      console.log(chalk.cyan(`${index + 1}. ${difficulty}-point question:`));
      console.log(`   Clue: "${suggestion.clue}"`);
      console.log(`   Answer: "${suggestion.answer}"`);
      console.log();
    });

    // Ask if user wants to use any suggestions
    const { useSuggestions } = await inquirer.prompt([
      {
        type: "confirm",
        name: "useSuggestions",
        message: "Would you like to use any of these suggestions?",
        default: true,
      },
    ]);

    if (useSuggestions) {
      // Implementation for using suggestions would go here
      console.log("Suggestion integration coming soon!");
    }
  }

  /**
   * Create a single question interactively
   */
  async createQuestion(categoryName, pointValue) {
    const answers = await inquirer.prompt([
      {
        type: "editor",
        name: "clue",
        message: `Enter the clue (what contestants will see on screen):`,
        default: `This ${pointValue}-point clue is about...`,
        validate: (input) => {
          const trimmed = input.trim();
          if (trimmed.length < 10)
            return "Clue must be at least 10 characters long";
          if (trimmed.length > 500)
            return "Clue must be less than 500 characters";
          return true;
        },
      },
      {
        type: "input",
        name: "answer",
        message: "Enter the contestant response (the answer they give):",
        validate: (input) => {
          const trimmed = input.trim();
          if (trimmed.length < 3)
            return "Answer must be at least 3 characters long";
          return true;
        },
      },
      {
        type: "confirm",
        name: "hasImage",
        message: "Does this question have an associated image?",
        default: false,
      },
    ]);

    let image = "";
    if (answers.hasImage) {
      const imageAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "imagePath",
          message: "Image file path (relative to category directory):",
          validate: (input) => {
            if (!input.trim()) return "Image path is required";
            // Basic validation - could be enhanced
            return true;
          },
        },
      ]);
      image = imageAnswer.imagePath;
    }

    return {
      answer: answers.clue,
      question: answers.answer,
      available: true,
      value: pointValue,
      cat: categoryName,
      ...(image && { image }),
    };
  }

  /**
   * Get available point values for a category
   */
  getAvailablePointValues(existingQuestions) {
    const usedValues = existingQuestions.map((q) => q.value);
    const allValues = [100, 200, 300, 400, 500];

    return allValues.filter((value) => !usedValues.includes(value));
  }

  /**
   * Check if local LLM is available
   */
  async isLLMAvailable() {
    // This would check for Ollama or other local LLM services
    // For now, return false to use basic suggestions
    return false;
  }

  /**
   * Generate LLM-powered suggestions
   */
  async generateLLMSuggestions(category, difficulty, number) {
    // Placeholder for LLM integration
    // Would use Ollama API or similar to generate suggestions
    console.log(
      `Generating ${number} suggestions for ${category} at ${difficulty} points...`,
    );

    // Return mock suggestions for now
    return [
      {
        clue: `This fundamental security concept requires users to have only the minimum privileges needed to perform their job`,
        answer: "What is the principle of least privilege?",
      },
      {
        clue: `This type of cyber attack involves tricking users into revealing sensitive information through deceptive communications`,
        answer: "What is phishing?",
      },
    ];
  }

  /**
   * Generate basic template suggestions
   */
  generateBasicSuggestions(category, difficulty, number) {
    const templates = {
      cybersecurity: [
        {
          clue: "This security principle states that a system should remain secure even if one of its components is compromised",
          answer: "What is defense in depth?",
        },
        {
          clue: "This type of malware spreads from computer to computer without user interaction",
          answer: "What is a worm?",
        },
      ],
      programming: [
        {
          clue: "This programming paradigm treats computation as the evaluation of mathematical functions",
          answer: "What is functional programming?",
        },
        {
          clue: "This data structure follows Last In, First Out (LIFO) principle",
          answer: "What is a stack?",
        },
      ],
    };

    const categoryType =
      category.toLowerCase().includes("cyber") ||
      category.toLowerCase().includes("security")
        ? "cybersecurity"
        : "programming";

    const availableTemplates =
      templates[categoryType] || templates.cybersecurity;

    console.log(chalk.green(`Basic suggestions for ${category}:`));
    availableTemplates.slice(0, number).forEach((template, index) => {
      console.log(chalk.cyan(`\n${index + 1}. Template:`));
      console.log(`   Clue: "${template.clue}"`);
      console.log(`   Answer: "${template.answer}"`);
    });
  }
}

module.exports = QuestionEditor;
