# Hacker Jeopardy Creator CLI

A command-line tool for creating and managing Hacker Jeopardy content rounds and questions.

## Installation

### Local Development Setup

1. Clone the main repository:

```bash
git clone https://github.com/krauni/hackerjeopardy-content.git
cd hackerjeopardy-content
```

2. Install dependencies:

```bash
npm install
```

3. Link the CLI tool:

```bash
npm link
```

## Usage

### Create a New Round

```bash
# Interactive round creation
hackerjeopardy-creator create-round

# Use a template
hackerjeopardy-creator create-round --template cybersecurity_basics
```

### Edit Existing Round

```bash
hackerjeopardy-creator edit-round <round-id>
```

### Add Questions to Category

```bash
# Add 5 questions (default)
hackerjeopardy-creator add-questions my-round "Code Catastrophes"

# Add specific number of questions
hackerjeopardy-creator add-questions my-round "Code Catastrophes" --count 3
```

### Validate Round

```bash
hackerjeopardy-creator validate my-round
```

### Generate AI-Powered Suggestions

```bash
# Generate question suggestions (requires local LLM)
hackerjeopardy-creator suggest-questions --category "Firewall Follies" --difficulty 200 --number 3
```

### List Available Rounds

```bash
hackerjeopardy-creator list
```

## Available Templates

- **cybersecurity_basics**: Introduction to fundamental cybersecurity concepts
- **programming_fundamentals**: Core programming concepts and techniques
- **tech_history**: Important moments and figures in technology history
- **internet_culture**: Memes, trends, and cultural moments from the internet
- **system_administration**: Server management, networking, and infrastructure concepts

## Jeopardy Format

This tool follows proper Jeopardy game mechanics:

- **Clue**: The text displayed to contestants (goes in `answer` field)
- **Response**: What contestants say as their answer (goes in `question` field)
- **Point Values**: 100, 200, 300, 400, 500 (increasing difficulty)
- **Categories**: 6 thematic groupings per round

## Question Structure

```json
{
  "answer": "This security device acts like a nightclub bouncer...",
  "question": "What is a firewall?",
  "available": true,
  "value": 100,
  "cat": "Firewall Follies",
  "image": "firewall-diagram.png" // optional
}
```

## AI Integration

The tool includes AI-powered features using local LLMs:

- **Question Generation**: Create new questions based on category and difficulty
- **Content Enhancement**: Improve existing questions for clarity and engagement
- **Quality Analysis**: Assess question difficulty and educational value

### Requirements for AI Features

- [Ollama](https://ollama.ai/) installed locally
- LLM model pulled (e.g., `ollama pull llama2`)
- Ollama server running

## Development

### Project Structure

```
hackerjeopardy-creator/
├── bin/
│   └── creator.js          # CLI entry point
├── lib/
│   ├── round-creator.js    # Round creation logic
│   ├── question-editor.js  # Question editing interface
│   ├── validator.js        # Content validation wrapper
│   └── file-manager.js     # File operations
├── templates/
│   └── round-templates.json # Round templates
├── test/
│   └── *.test.js          # Unit tests
├── package.json
└── README.md
```

### Running Tests

```bash
npm test
```

### Code Quality

```bash
npm run lint
npm run format
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use meaningful commit messages

## License

MIT - Same as the main Hacker Jeopardy project.
