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
- **Google OAuth**: A special static HTML callback page at `/auth/google/callback/index.html` handles the Google OAuth redirect and passes the authentication code to your hash-based application.

## Google OAuth Configuration

For Google authentication to work properly with GitHub Pages:

1. **Set up Google OAuth credentials**: 
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create or select your project
   - Navigate to "APIs & Services" > "Credentials"
   - Create an OAuth 2.0 Client ID if you don't have one

2. **Configure correct redirect URIs**:
   - Add `https://workmate.dataidea.org/auth/google/callback` to the authorized redirect URIs
   - Do NOT include the hash fragment version (`/#/auth/google/callback`)

3. **How it works**:
   - When users click "Sign in with Google", they're redirected to Google's auth page
   - After authentication, Google redirects to `/auth/google/callback`
   - Our static HTML page at that location extracts the code and redirects to our hash-based route
   - The React application then processes the authentication

## Deployment Steps

### Option 1: Automated Deployment with GitHub Actions (Recommended)

The project is configured with a GitHub Actions workflow that automatically deploys to GitHub Pages whenever you push to the main branch.

1. **Ensure your repository has GitHub Pages enabled**:
   - Go to your repository settings on GitHub
   - Navigate to the GitHub Pages section
   - Select the `gh-pages` branch as the source
   - Save your changes

2. **Push changes to the main branch**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **Monitor the deployment**:
   - Go to the "Actions" tab in your GitHub repository
   - You'll see the workflow running, and once completed, your site will be deployed

### Option 2: Using NPM Scripts (Manual Deployment)

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