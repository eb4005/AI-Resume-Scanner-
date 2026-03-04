# Deployment Guide

This guide covers how to deploy the Resume Scanner AI application to various platforms.

## Overview

The application consists of:
- **Frontend**: React app built with Vite (static files in `dist/`)
- **Backend**: Express.js server with TypeScript

## Option 1: Deploy Frontend and Backend Together

### Render (Recommended)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `GROQ_API_KEY`: Your Groq API key
     - `NODE_ENV`: production
     - `PORT`: 10000 (Render's default)

4. Deploy!

### Railway

1. Create a new project on Railway
2. Deploy from GitHub repo
3. Add environment variables in Railway dashboard
4. Railway will automatically detect the build/start commands from package.json

### Heroku

1. Create a new Heroku app
2. Add Heroku remote:
```bash
heroku git:remote -a your-app-name
```

3. Set environment variables:
```bash
heroku config:set GROQ_API_KEY=your_key_here
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git push heroku main
```

## Option 2: Deploy Frontend Separately (Static Hosting)

### Netlify / Vercel (Frontend Only)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist/` folder to Netlify or Vercel

3. Update `src/services/api.ts` to point to your deployed backend URL:
```typescript
const API_URL = 'https://your-backend-url.com/api';
```

4. Rebuild and redeploy

## Option 3: Local Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment variables:
```bash
export GROQ_API_KEY=your_key_here
export NODE_ENV=production
export PORT=3001
```

3. Start the server:
```bash
npm start
```

4. Access the application at `http://localhost:3001`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Your Groq API key |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Set to `production` for production builds |

## Getting a Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure the backend CORS configuration allows your frontend domain:
```typescript
// server/index.ts
app.use(cors({
  origin: ['https://your-frontend-domain.com']
}));
```

### File Upload Issues
- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX, TXT
- Temporary files are cleaned up after processing

### API Rate Limits
Groq API has rate limits. If you hit limits:
- Upgrade your Groq plan
- Implement request queuing
- Add rate limiting middleware

## Security Considerations

1. **Never commit `.env` file** - Always use environment variables in production
2. **Use HTTPS** - Always deploy with HTTPS in production
3. **File validation** - The server validates file types and sizes
4. **API key protection** - Keep your Groq API key secure

## Monitoring

For production deployments, consider adding:
- Application monitoring (e.g., Sentry)
- Logging (e.g., Winston, LogRocket)
- Uptime monitoring (e.g., UptimeRobot)

## Support

For issues or questions:
- Check the [README.md](./README.md)
- Open an issue on GitHub
- Contact the maintainer
