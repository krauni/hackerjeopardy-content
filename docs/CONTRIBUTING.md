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
  "answer": "The clue text displayed to contestants",
  "question": "The correct contestant response (What is...?)",
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

## Content Creation Guidelines

### Game Mechanics

Hacker Jeopardy follows standard Jeopardy rules:

- **Clues**: Questions displayed to contestants (e.g., "What does HTTPS stand for?")
- **Answers**: Contestant responses (e.g., "HyperText Transfer Protocol Secure")
- **Categories**: 6 thematic groupings per round
- **Point Values**: 100, 200, 300, 400, 500 (difficulty scaling)
- **Answer Formats**: Flexible - text, images, or combinations

### Fun-First Approach

Questions should be engaging and entertaining while maintaining educational value:

- Use puns, wordplay, and pop culture references
- Include humor and clever analogies
- Make technical concepts accessible and memorable
- Balance entertainment with learning

### Visual Integration

- **40% of questions** should include relevant images
- Images enhance clues or provide answer context
- Support diagrams, memes, screenshots, and educational graphics
- Store images in category directories alongside `cat.json`

### Difficulty Scaling

Progressive difficulty based on point values:

- **100 points**: Common knowledge, basic concepts
- **200 points**: Standard practices, intermediate terms
- **300 points**: Practical applications, common techniques
- **400 points**: Specialized knowledge, specific technologies
- **500 points**: Expert principles, advanced concepts

### Category Naming Conventions

Replace standard technical names with engaging, thematic alternatives:

**Examples:**

- Network Security → "Firewall Follies"
- Cryptography → "Encryption Extravaganza"
- Web Security → "Web Weirdness"
- System Security → "Access Control Circus"
- Social Engineering → "Phishing Fiasco"
- Programming → "Code Catastrophes"
- Databases → "Data Disco"
- APIs → "API Adventure"

**Guidelines:**

- Keep names memorable and thematic
- Use alliteration when possible
- Ensure names reflect the category's fun personality
- Maintain clarity about technical content

### Development Workflow

1. **Planning Phase**
   - Define round theme and target audience
   - Brainstorm 6 fun category names
   - Outline question difficulty progression
   - Plan image content integration

2. **Content Creation**
   - Write clues with engaging language
   - Ensure progressive difficulty scaling
   - Add relevant images where helpful
   - Test question clarity and fun factor

3. **Quality Assurance**
   - Run `npm run validate` for JSON compliance
   - Verify difficulty scaling within categories
   - Check educational value and entertainment balance
   - Update manifest with `npm run build-manifest`

4. **Review & Iteration**
   - Test gameplay experience
   - Gather community feedback
   - Refine based on player engagement
   - Maintain consistent quality standards

### Quality Standards

**Question Criteria:**

- Engaging and fun language
- Clear educational value
- Appropriate difficulty for point value
- Technically accurate information
- Accessible to target audience

**Image Guidelines:**

- Relevant to clue or answer
- High quality and clear
- Optimized file size (<500KB)
- Proper licensing or original creation
- Accessible descriptions

**Category Balance:**

- 6 categories per round
- 5 questions per category (100-500 points)
- Mix of text and image-based content
- Progressive difficulty scaling

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
