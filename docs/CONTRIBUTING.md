# Contributing to Pocket Import to Notion

Thank you for your interest in contributing! Here are some guidelines to help you get started:

## Development Setup

1. **Install dependencies:**
   ```sh
   npm ci
   ```
2. **Run lint checks:**
   ```sh
   npm run lint
   ```
3. **Run tests:**
   ```sh
   npm run test
   ```

## Code Style
- This project uses [Airbnb's TypeScript ESLint config](https://www.npmjs.com/package/eslint-config-airbnb-typescript).
- Please run `npm run lint:fix` before submitting a pull request.
- All code should be formatted and pass linting.

## Pull Requests
- Fork the repository and create your branch from `main`.
- Include tests for new features or bug fixes.
- Ensure all tests pass and code is linted before submitting.
- Describe your changes clearly in the PR description.

## Running in CI
- All PRs and pushes to `main`/`master` will run lint and test checks via GitHub Actions.

Thank you for helping improve this project! 