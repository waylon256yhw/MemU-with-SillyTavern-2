# Contributing to MemU

Thank you for your interest in contributing to MemU! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

We welcome all types of contributions:

- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new capabilities and improvements  
- 📝 **Documentation** - Improve guides, examples, and API docs
- 🔧 **Code Contributions** - Add features, fix bugs, optimize performance
- 🧪 **Testing** - Write tests, improve coverage, test edge cases
- 🎨 **UI/UX** - Enhance user experience and interface design
- 🌐 **Translations** - Help make MemU accessible globally
- 📢 **Community** - Help others in discussions and support channels

## 🚀 Quick Start for Contributors

### Prerequisites
- Python 3.8+
- Git
- A code editor (VS Code recommended)

### Development Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/MemU.git
cd MemU

# 3. Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 4. Install development dependencies
pip install -e ".[dev]"

# 5. Install pre-commit hooks
make pre-commit-install

# 6. Verify setup by running tests
make test
```

### Available Commands

```bash
make help              # Show all available commands
make test              # Run tests
make coverage          # Run tests with coverage report
make lint              # Run linting (flake8, mypy)
make format            # Format code (black, isort)
make pre-commit-run    # Run all pre-commit checks
make clean             # Clean build artifacts
```

## 🔧 Development Guidelines

### Code Style
- Follow **PEP 8** Python style guidelines
- Use **Black** for code formatting (line length: 88)
- Use **isort** for import sorting
- Use **type hints** for all functions and methods
- Write **docstrings** for public APIs

### Code Quality Standards
- Maintain **test coverage > 80%**
- All code must pass **linting** (flake8, mypy)
- Use **meaningful variable and function names**
- Keep functions **focused and small**
- Follow **SOLID principles**

### Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=memu --cov-report=html

# Run specific test file
pytest tests/test_memory_agent.py

# Run tests with specific marker
pytest -m "not slow"
```

## 📝 Submitting Changes

### Before You Start
1. **Search existing issues** to avoid duplicates
2. **Create an issue** for new features or major changes
3. **Discuss your approach** in the issue before implementing

### Creating Issues

When reporting bugs, please include:
- **Environment details** (Python version, OS, MemU version)
- **Reproduction steps** with minimal code example
- **Expected vs actual behavior**
- **Error messages** or stack traces

For feature requests, please describe:
- **The problem** you're trying to solve
- **Proposed solution** or approach
- **Alternative solutions** you've considered
- **Use cases** and examples

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or for bug fixes
   git checkout -b bugfix/fix-memory-leak
   ```

2. **Make your changes**
   - Write clear, descriptive commit messages
   - Keep commits focused and atomic
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   make test
   make lint
   make coverage
   ```

4. **Submit pull request**
   - Use descriptive title and description
   - Reference related issues (e.g., "Fixes #123")
   - Include testing instructions
   - Add screenshots for UI changes

### Commit Message Format

Use conventional commit format:

```
type(scope): description

Examples:
feat(memory): add semantic search functionality
fix(llm): resolve OpenAI timeout issues  
docs(readme): update installation instructions
test(agent): add unit tests for memory retrieval
refactor(core): restructure memory storage logic
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or fixing tests
- `refactor`: Code restructuring without feature changes
- `perf`: Performance improvements
- `chore`: Maintenance tasks

## 🎯 Current Priorities

We're currently focusing on:

| Priority | Area | Description |
|----------|------|-------------|
| 🔥 **High** | Multi-modal Support | Images, audio, video memory processing |
| 🔥 **High** | Performance | Memory retrieval optimization, caching |
| 🔥 **High** | LLM Providers | Additional provider integrations |
| 🟡 **Medium** | Enterprise Features | SSO, RBAC, audit logging |
| 🟡 **Medium** | Mobile SDKs | React Native, Flutter support |
| 🟢 **Low** | UI Improvements | Dashboard, memory visualization |

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `good first issue` | Perfect for newcomers |
| `help wanted` | Extra attention needed |
| `bug` | Something isn't working |
| `enhancement` | New feature request |
| `documentation` | Improvements to docs |
| `performance` | Performance optimization |
| `breaking change` | Requires version bump |
| `priority:high` | Urgent issues |
| `priority:medium` | Important issues |
| `priority:low` | Nice to have |

## 📋 Code Review Process

### For Contributors
- Be open to feedback and constructive criticism
- Respond promptly to review comments
- Make requested changes in new commits (don't force push)
- Ask questions if feedback is unclear

### For Reviewers
- Be constructive and respectful in feedback
- Focus on code quality, maintainability, and project goals
- Suggest improvements with explanations
- Approve when ready, request changes when needed

## 🔒 Security

**Reporting Security Issues:**
- **DO NOT** create public issues for security vulnerabilities
- Email security issues privately to [contact@nevamind.ai](mailto:contact@nevamind.ai)
- Include detailed reproduction steps and impact assessment
- We'll acknowledge receipt within 24 hours

## 📄 License and Attribution

By contributing to MemU, you agree that:
- Your contributions will be licensed under the **Apache License 2.0**
- You have the right to contribute the code/content
- Your contribution doesn't violate any third-party rights

## 🌍 Community Guidelines

- Be respectful and inclusive
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Help others learn and grow
- Share knowledge and best practices
- Celebrate diverse perspectives and experiences

## 📞 Getting Help

| Channel | Best For |
|---------|----------|
| 💬 [Discord](https://discord.gg/memu) | Real-time chat, quick questions |
| 🗣️ [GitHub Discussions](https://github.com/NevaMind-AI/MemU/discussions) | Feature discussions, Q&A |
| 🐛 [GitHub Issues](https://github.com/NevaMind-AI/MemU/issues) | Bug reports, feature requests |
| 📧 [Email](mailto:contact@nevamind.ai) | Private inquiries |

## 🎉 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- Our [Contributors](https://github.com/NevaMind-AI/MemU/graphs/contributors) page

Thank you for helping make MemU better! 🚀