# Agent Instructions for Hacker Jeopardy Content

## Build/Lint/Test Commands

- `npm run validate rounds/round_id` - Validate a specific round
- `npm run validate-all` - Validate all rounds (also runs as `npm test`)
- `npm run build-manifest` - Build manifest.json from round directories
- `npm run format` - Format JSON files with Prettier

## Code Style Guidelines

### JavaScript/Node.js Scripts

- Use ES6+ features (classes, arrow functions, template literals)
- PascalCase for class names, camelCase for variables/functions
- 2-space indentation for consistency
- JSDoc comments for classes and public methods
- Try/catch blocks for error handling
- CLI scripts with proper argument parsing and help messages

### JSON Content Files

- 2-space indentation (formatted with Prettier)
- Required fields: name, categories in round.json; name, questions in cat.json
- Questions require: available (boolean), value (number), cat (string); and either answer (clue) or image (string path)
- Optional question fields: question (response)
- Lowercase round IDs with underscores, descriptive category names

### File Structure

- Round directories: `rounds/{round_id}/`
- Category directories: `rounds/{round_id}/{CategoryName}/`
- Metadata files: round.json, cat.json
- Content validation mandatory before commits

### Naming Conventions

- Round IDs: lowercase, underscores (e.g., `cybersecurity_basics`)
- Category names: Fun theme names (e.g., "Firewall Follies" instead of "Network Security")
- Consistent with existing patterns in codebase

### Content Creation Guidelines

#### Jeopardy Game Format

- Clues displayed to contestants, answers provided by players
- Point values (100, 200, 300, 400, 500) scale difficulty within categories
- 6 categories per round, 5 questions per category
- Flexible answer formats: text, images, or combinations

#### Fun-First Content Philosophy

- Questions should be engaging and entertaining
- Use puns, wordplay, pop culture references, and humor
- Maintain educational value while being accessible
- Include images in ~40% of questions for visual engagement

#### Difficulty Scaling

- 100pts: Basic/common knowledge
- 200pts: Standard intermediate concepts
- 300pts: Practical applications
- 400pts: Specialized knowledge
- 500pts: Expert-level principles

#### Category Naming

- Use fun, thematic names instead of standard technical terms
- Examples: "Firewall Follies", "Code Catastrophes", "Phishing Fiasco"
- Employ alliteration and memorable themes

### Entertainment-Focused Rounds

For non-educational rounds prioritizing fun and entertainment:

- **Focus**: Pop culture, memes, gaming, internet trends, humor
- **Guidelines**: See "Creating Entertainment-Focused Rounds" in CONTRIBUTING.md
- **Themes**: Internet culture, gaming fails, viral moments, nostalgia, industry drama
- **Quality**: Shareability and engagement over technical accuracy
- **Examples**: Meme Museum, Boss Battle Blunders, Hashtag Havoc, Retro Gaming Relics</content>
  <parameter name="filePath">/home/user/dev/hackerjeopardy-content/AGENTS.md
