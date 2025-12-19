# Hacker Jeopardy Content Repository

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/krauni/hackerjeopardy-content)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A community-driven repository for Hacker Jeopardy question sets. This repository contains all the game content that can be dynamically loaded into the Hacker Jeopardy application.

## 🚀 Quick Start

### For Players

1. Open [Hacker Jeopardy](http://127.0.0.1:4200)
2. Click the "⚙️ Content Manager" button in the top-right
3. Check for updates and download new question sets
4. Enjoy offline gameplay with cached content!

### For Contributors

1. [Read the contribution guide](docs/CONTRIBUTING.md)
2. Use the [CLI Creator Tool](#cli-creator-tool) for easy content creation
3. Fork this repository
4. Add your question set following the format
5. Submit a Pull Request

## 📁 Repository Structure

```
hackerjeopardy-content/
├── rounds/                    # Question sets
│   ├── demo_round/           # Example round
│   │   ├── round.json        # Round metadata
│   │   ├── Programming/      # Category folder
│   │   │   └── cat.json     # Category questions
│   │   └── Security/         # Another category
│   └── your_round/           # Your contributions here
├── assets/                    # Shared assets (if any)
├── manifest.json              # Content registry
├── docs/                      # Documentation
└── README.md                  # This file
```

## 🎮 Available Rounds

| Round Name             | Categories                              | Difficulty | Author               |
| ---------------------- | --------------------------------------- | ---------- | -------------------- |
| Demo Round             | Programming, Security, Fun              | Easy       | Hacker Jeopardy Team |
| Advanced Cybersecurity | Cryptography, Network Security, Malware | Hard       | Security Experts     |

_More rounds available - check the [manifest.json](manifest.json) for the complete list._

## 🤝 Contributing

We welcome contributions from the community! Whether you're a cybersecurity expert, programmer, or just passionate about technology, you can help create engaging question sets.

### Ways to Contribute

- **Create new rounds** on technology topics
- **Improve existing questions** for clarity and accuracy
- **Add images** to enhance visual questions
- **Translate rounds** to other languages
- **Review submissions** from other contributors

### Getting Started

1. Read our [Contributing Guide](docs/CONTRIBUTING.md)
2. Check existing rounds for examples
3. Use the validation tools
4. Submit your contribution!

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Agent Instructions

- [AGENTS.md](AGENTS.md) - Instructions for AI coding assistants working in this repository

### CLI Creator Tool

A powerful command-line tool for creating Jeopardy content:

```bash
# Install dependencies
npm install

# Use the CLI tool directly (no global linking needed)
node hackerjeopardy-creator/bin/creator.js create-round --template cybersecurity_basics

# Or create an alias for convenience
alias hjc='node hackerjeopardy-creator/bin/creator.js'

# Add questions to a category
hackerjeopardy-creator add-questions cybersecurity_basics "Firewall Follies"

# Validate your content
hackerjeopardy-creator validate cybersecurity_basics

# Get AI-powered question suggestions (requires local LLM)
hackerjeopardy-creator suggest-questions --category "Password Party" --difficulty 200
```

[Full CLI documentation](hackerjeopardy-creator/README.md)

### Validation

```bash
# Install dependencies
npm install

# Validate a specific round
npm run validate rounds/your_round_id

# Validate all content
npm run validate-all
```

### Content Guidelines

- Questions should be educational and engaging
- Maintain consistent difficulty levels
- Include both technical and fun questions
- Ensure content is appropriate for all ages
- Follow the established JSON format

## 📊 Statistics

- **Total Rounds**: 2
- **Total Questions**: ~30
- **Categories**: Programming, Security, Fun, Cryptography, etc.
- **Languages**: English (expanding to more languages)

## 🔄 Updates

Content updates are managed through the Hacker Jeopardy application:

- Users can check for updates manually
- New content is downloaded and cached automatically
- Offline play works with cached content
- No forced updates - user controls their experience

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hacker Jeopardy Team** for the application framework
- **Community Contributors** for creating amazing question sets
- **Open Source Community** for the tools and inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/krauni/hackerjeopardy-content/issues)
- **Discussions**: [GitHub Discussions](https://github.com/krauni/hackerjeopardy-content/discussions)
- **Documentation**: [Contributing Guide](docs/CONTRIBUTING.md)

---

**Ready to contribute?** Check out our [Contributing Guide](docs/CONTRIBUTING.md) and create your first question set! 🎉
