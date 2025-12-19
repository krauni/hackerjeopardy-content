# Agent Instructions for Hacker Jeopardy Content

## Build/Lint/Test Commands

- `npm run validate rounds/round_id` - Validate a specific round
- `npm run validate-all` - Validate all rounds (also runs as `npm test`)
- `npm run build-manifest` - Build manifest.json from round directories
- `npm run format` - Format JSON files with Prettier
- `cd hackerjeopardy-creator && npm test` - Run all creator tool tests
- `cd hackerjeopardy-creator && npx jest path/to/test.js` - Run single test

## Code Style Guidelines

### JavaScript/Node.js Scripts

- Use ES6+ features (classes, arrow functions, template literals)
- PascalCase for class names, camelCase for variables/functions
- 2-space indentation for consistency
- JSDoc comments for classes and public methods
- Try/catch blocks for error handling in async functions
- CLI scripts with proper argument parsing and help messages
- Import order: Node.js built-ins, external packages, local modules

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
- Content validation mandatory before commits</content>
  <parameter name="filePath">/home/user/dev/hackerjeopardy-content/AGENTS.md
