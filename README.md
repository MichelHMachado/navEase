# GitHub NavEase Chrome Extension

Welcome to GitHub NavEase, a Chrome extension designed to simplify navigation to repositories you have access to but were not the original creator. This README provides an overview of the project, development instructions, and details on how to contribute.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)

## Overview

GitHub NavEase is a Chrome extension that enhances your GitHub experience by making it easier to navigate to repositories that you have access to but did not create. It leverages the GitHub API and various Chrome extension APIs to provide a seamless and efficient navigation tool.

## Features

- Quick access to repositories you have access to on GitHub.
- Easy-to-use popup interface.
- Supports OAuth2 authentication for secure access to your GitHub data.
- Customizable through permissions and options.

## Usage
After installing the extension:

1. Click on the GitHub NavEase icon in the Chrome toolbar.
2. A popup will appear showing the repositories you have access to.
3. Use the search bar to select the repository you want.
3. Click on any repository name to navigate to it.

## Development
To start developing the extension:

1. Install the dependencies:
   pnpm install
2. Start the development server:
   npm run dev
3. Make changes to the code and the extension will automatically reload.

For Firefox development:
   Only diference is using npm dev:firefox

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   git checkout -b feature-branch
3. Make your changes.
4. Commit your changes:
   git commit -m 'Add some feature'
5. Push to the branch:
   git push origin feature-branch
6. Open a pull request.
