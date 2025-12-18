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
- Questions require: question, available (boolean), value (number), cat (string)
- Optional question fields: answer (string), image (string path)
- Lowercase round IDs with underscores, descriptive category names

### File Structure

- Round directories: `rounds/{round_id}/`
- Category directories: `rounds/{round_id}/{CategoryName}/`
- Metadata files: round.json, cat.json
- Content validation mandatory before commits

### Naming Conventions

- Round IDs: lowercase, underscores (e.g., `cybersecurity_basics`)
- Category names: Title Case (e.g., "Network Security")
- Consistent with existing patterns in codebase</content>
  <parameter name="filePath">/home/user/dev/hackerjeopardy-content/AGENTS.md
