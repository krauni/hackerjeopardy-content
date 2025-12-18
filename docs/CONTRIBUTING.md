# Contributing to Hacker Jeopardy Content

Welcome! We're excited that you want to contribute question sets to Hacker Jeopardy. This guide will help you create and submit new rounds.

## Table of Contents
- [Quick Start](#quick-start)
- [Round Structure](#round-structure)
- [Category Format](#category-format)
- [Question Guidelines](#question-guidelines)
- [Validation](#validation)
- [Submission Process](#submission-process)
- [Best Practices](#best-practices)

## Quick Start

1. **Fork** the content repository
2. **Create** a new round directory under `rounds/`
3. **Add** your round files following the structure below
4. **Test** your content using the validation script
5. **Submit** a Pull Request

## Round Structure

Each round should be organized as follows:

```
rounds/
└── your_round_id/
    ├── round.json          # Round metadata and category list
    ├── Category1/
    │   └── cat.json       # Category questions
    │   └── image1.jpg     # Optional images
    ├── Category2/
    │   └── cat.json
    └── ...
```

### Round ID Naming Convention
- Use lowercase letters, numbers, and underscores only
- Be descriptive but concise: `cybersecurity_basics`, `programming_fundamentals`
- Avoid special characters or spaces

## Round Metadata (`round.json`)

```json
{
  "name": "Cybersecurity Basics",
  "categories": ["Network Security", "Cryptography", "Social Engineering"],
  "comment": "Introduction to basic cybersecurity concepts",
  "author": "Your Name",
  "version": "1.0.0",
  "created": "2025-12-18"
}
```

**Required fields:**
- `name`: Display name for the round
- `categories`: Array of category names (must match directory names)

**Optional fields:**
- `comment`: Additional description
- `author`: Your name
- `version`: Version number
- `created`: Creation date

## Category Format (`cat.json`)

```json
{
  "name": "Network Security",
  "path": "Network Security",
  "lang": "en",
  "difficulty": "easy",
  "author": "Your Name",
  "licence": "MIT",
  "date": "2025-12-18",
  "email": "your.email@example.com",
  "questions": [
    {
      "question": "What does HTTPS stand for?",
      "answer": "HyperText Transfer Protocol Secure",
      "available": true
    },
    {
      "question": "What type of attack involves tricking users into revealing sensitive information?",
      "answer": "Phishing",
      "available": true
    }
  ]
}
```

**Required fields:**
- `name`: Category display name
- `questions`: Array of question objects

**Optional fields:**
- `path`: Directory path for images (usually same as name)
- `lang`: Language code (en, de, fr, etc.)
- `difficulty`: easy, medium, hard, or mixed
- `author`, `licence`, `date`, `email`: Metadata

## Question Guidelines

### Question Structure
Each question object should have:
```json
{
  "question": "The question text that will be displayed as a clue",
  "answer": "The correct answer text",
  "available": true
}
```

### Content Guidelines

**Question Quality:**
- Questions should be clear and unambiguous
- Use proper grammar and spelling
- Avoid overly complex or obscure topics
- Ensure questions are educational and interesting

**Answer Quality:**
- Answers should be concise but complete
- Include brief explanations when helpful
- Use consistent formatting

**Difficulty Balance:**
- Easy: Basic concepts, common knowledge
- Medium: Intermediate understanding required
- Hard: Advanced or specialized knowledge

### Categories

**Popular Category Themes:**
- Programming languages and frameworks
- Cybersecurity concepts and tools
- Operating systems and commands
- Network protocols and infrastructure
- Famous hackers and events
- Internet culture and memes
- Science and technology history

## Validation

Before submitting, validate your content:

```bash
# Install validation dependencies
npm install

# Run validation on your round
npm run validate rounds/your_round_id
```

The validation will check:
- ✅ JSON syntax correctness
- ✅ Required fields presence
- ✅ Question/answer format compliance
- ✅ Image file references
- ✅ Round structure consistency

## Submission Process

1. **Create a new branch** for your contribution
2. **Add your round** following the structure above
3. **Update manifest.json** to include your round metadata
4. **Run validation** and fix any issues
5. **Test locally** if possible
6. **Commit your changes** with a clear message
7. **Submit a Pull Request** with:
   - Clear description of your round
   - Difficulty level and target audience
   - Any special instructions

## Best Practices

### Content Quality
- **Test your questions**: Try answering them yourself
- **Balance difficulty**: Mix easy, medium, and hard questions
- **Be inclusive**: Avoid culturally specific references
- **Keep it fun**: Include some lighter questions among technical ones

### Technical Best Practices
- **Use consistent formatting**: Follow the examples provided
- **Validate before submitting**: Use the validation tools
- **Keep file sizes reasonable**: Optimize images if included
- **Use descriptive names**: Clear round and category names

### Community Guidelines
- **Be respectful**: Content should be appropriate for all ages
- **Give credit**: Acknowledge sources if using existing questions
- **Be collaborative**: Help review other contributors' submissions
- **Stay on topic**: Focus on technology, programming, and security themes

## Need Help?

- Check existing rounds for examples
- Look at the validation error messages
- Ask questions in your Pull Request
- Join our community discussions

Thank you for contributing to Hacker Jeopardy! 🎉