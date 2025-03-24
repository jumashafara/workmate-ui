 

This guide explains how to deploy the Workmate frontend application to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js and npm installed

## Setup

1. If you haven't already, create a GitHub repository for your project.
2. Make sure your local repository is connected to the GitHub repository.

## Configuration

The project is already configured for GitHub Pages deployment with the following:

- **Hash Router**: The app uses hash-based routing (`HashRouter`) which is compatible with GitHub Pages.
- **Base Path**: The build configuration sets the correct base path using the environment variable `BASE_PATH`.
- **404 Page**: A custom 404.html page handles redirects for deep linking.

## Deployment Steps

### Option 1: Using NPM Scripts (Recommended)

1. **Update Base Path**: 
   - Open `package.json` and find the `build:github` script
   - Change `/workmate/frontend/` to match your repository name, e.g., `/your-repo-name/`

2. **Deploy**:
   ```bash
   npm run deploy
   ```
   This command will:
   - Build your application with the correct base path
   - Push the build to the `gh-pages` branch of your repository

3. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to the GitHub Pages section
   - Select the `gh-pages` branch as the source
   - Save your changes

### Option 2: Manual Deployment

1. **Build the application**:
   ```bash
   npm run build:github
   ```

2. **Push the `dist` directory to the `gh-pages` branch**:
   ```bash
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

## Troubleshooting

- **Blank Page**: If you see a blank page, check the browser console for errors. Ensure that the base path is correctly set.
- **404 Errors**: Ensure your 404.html file is correctly set up to redirect to the homepage with the hash.
- **Asset Loading Issues**: Make sure asset paths are relative and work with the configured base path.

## Local Testing

To test the GitHub Pages build locally:
```bash
npm run build:github
npm run preview
```

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)