
# UXcellence Spin Wheel App

This is a code bundle for UXcellence Spin Wheel App. The original project is available at [Figma](https://www.figma.com/design/SoLfP2h6WIM7jgZ222lOWb/UXcellence-Spin-Wheel-App).

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This application is configured for deployment on [Render](https://render.com/).

### Deploy to Render

1. Push your code to a GitHub or GitLab repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" and select "Static Site"
4. Connect your repository
5. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
6. Click "Create Web Service"

### Environment Variables

If your application requires any environment variables, make sure to set them in the Render dashboard under the "Environment" section of your service settings.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be available in the `dist` directory.