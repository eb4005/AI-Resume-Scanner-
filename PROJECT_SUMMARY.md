# Resume Scanner AI - Project Summary

## Project Overview

This is a full-stack resume screening and matching application that uses Groq's LLM (Large Language Model) to analyze and compare candidate resumes against job descriptions.

## Live Demo

**Frontend**: https://ttltq52qvpt5c.ok.kimi.link

> **Note**: The deployed frontend requires a running backend server to function fully. Follow the setup instructions below to run the complete application locally.

## Features Implemented

### Core Features
1. **Job Description Input**: Rich text area for entering job requirements
2. **Single Resume Analysis**: Upload and analyze one resume at a time
3. **Multiple Resume Comparison**: Compare up to 10 resumes simultaneously
4. **AI-Powered Scoring**: Match scores from 0-100% based on job fit
5. **Smart Recommendations**: Categories include:
   - Hire
   - Strong Consider
   - Consider
   - Reject

### Analysis Results
- **Match Score**: Numerical score with visual progress bar
- **Summary**: Brief overview of candidate fit
- **Strengths**: Key qualifications matching the job
- **Weaknesses**: Gaps or missing qualifications
- **Skills Analysis**: 
  - Matched skills (found in resume)
  - Missing skills (required but not found)
- **Experience Match**: Assessment of relevant experience
- **Education Match**: Assessment of educational qualifications
- **Detailed Reasoning**: Comprehensive explanation of the recommendation

### UI/UX Features
- Modern, responsive design with Tailwind CSS
- Real-time feedback with toast notifications
- Drag-and-drop file upload
- Tabbed interface for single vs. multiple analysis
- Animated transitions and loading states
- Color-coded scores and recommendations

## Technical Architecture

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (40+ pre-built components)
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: Express.js with TypeScript
- **File Upload**: Multer
- **PDF Parsing**: pdf-parse
- **LLM Integration**: Groq SDK
- **CORS**: Enabled for cross-origin requests

### API Endpoints

#### `GET /api/health`
Health check endpoint.

#### `POST /api/analyze`
Analyze a single resume.
- **Body**: multipart/form-data
  - `resume`: File (PDF, DOC, DOCX, TXT)
  - `jobDescription`: string

#### `POST /api/compare`
Compare multiple resumes.
- **Body**: multipart/form-data
  - `resumes`: File[] (max 10)
  - `jobDescription`: string

## Project Structure

```
resume-scanner-ai/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD
├── server/
│   └── index.ts            # Express server & API routes
├── src/
│   ├── components/
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/
│   │   └── use-mobile.ts   # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── services/
│   │   └── api.ts          # API client
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   ├── App.tsx             # Main application
│   ├── App.css             # App styles
│   ├── index.css           # Global styles
│   └── main.tsx            # Entry point
├── dist/                   # Built frontend (generated)
├── .env                    # Environment variables
├── .env.example            # Example env file
├── .gitignore              # Git ignore rules
├── components.json         # shadcn/ui config
├── DEPLOYMENT.md           # Deployment guide
├── index.html              # HTML template
├── package.json            # Dependencies & scripts
├── postcss.config.js       # PostCSS config
├── README.md               # Main documentation
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite config
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Groq API key (get at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone/Download the project**
```bash
cd resume-scanner-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=gsk_your_api_key_here
PORT=3001
```

4. **Run in development mode**
```bash
npm run dev
```
This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

5. **Build for production**
```bash
npm run build
```

6. **Run in production mode**
```bash
npm start
```

## How It Works

1. **User inputs job description** - Paste the complete job posting with requirements

2. **User uploads resume(s)** - Single file or multiple files (PDF, DOC, DOCX, TXT)

3. **Backend processes files**:
   - Extracts text from PDF/documents
   - Sends text + job description to Groq LLM

4. **LLM analyzes and returns**:
   - Match score (0-100)
   - Recommendation category
   - Detailed analysis in JSON format

5. **Frontend displays results**:
   - Visual score with progress bar
   - Organized sections for easy reading
   - Comparison table for multiple resumes

## LLM Prompt Engineering

The application uses a carefully crafted prompt to get structured JSON output from the LLM:

```
You are an expert HR recruiter and resume analyzer...

Please analyze the resume and provide the following in JSON format:
{
  "score": <number between 0-100>,
  "summary": "<brief summary>",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "skillsMatch": {
    "matched": ["..."],
    "missing": ["..."]
  },
  "experienceMatch": "...",
  "educationMatch": "...",
  "recommendation": "<Hire/Strong Consider/Consider/Reject>",
  "reasoning": "..."
}
```

## Deployment Options

### Option 1: Full-Stack Deployment (Recommended)
Deploy frontend and backend together on:
- Render
- Railway
- Heroku
- DigitalOcean App Platform

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Option 2: Separate Deployment
- Frontend: Netlify, Vercel, or GitHub Pages
- Backend: Render, Railway, or AWS

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | Yes | - | Your Groq API key |
| `PORT` | No | 3001 | Server port |
| `NODE_ENV` | No | development | Environment mode |

## Technologies Used

### Core
- React 19
- TypeScript 5
- Node.js 20
- Express.js

### Build & Development
- Vite
- tsx (TypeScript execution)
- Concurrently

### UI/UX
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Sonner (notifications)

### Backend
- Express
- Multer (file uploads)
- pdf-parse
- CORS
- dotenv

### AI/ML
- Groq SDK
- Llama 3.3 70B model

## Future Enhancements

Potential improvements for the project:

1. **Authentication**: Add user accounts and saved analyses
2. **Database**: Store resume analyses for future reference
3. **Batch Processing**: Queue system for large batches
4. **Resume Templates**: Suggest improvements based on job type
5. **Export**: PDF/Excel export of analysis results
6. **Analytics**: Dashboard for recruitment metrics
7. **Integration**: Connect with ATS (Applicant Tracking Systems)
8. **Multi-language**: Support for non-English resumes

## Troubleshooting

### Common Issues

**"Failed to analyze resume"**
- Check your Groq API key
- Ensure resume file is valid PDF/DOCX/TXT
- Check file size (max 10MB)

**CORS errors**
- Backend must be running
- Check Vite proxy configuration
- Ensure CORS is enabled in server

**Build errors**
- Use Node.js 20+
- Delete node_modules and run `npm install` again

## License

MIT License - Feel free to use for personal or commercial projects.

## Credits

- Built with [Groq](https://groq.com) LLM API
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)

## Support

For issues or questions:
1. Check [README.md](./README.md)
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Open an issue on GitHub

---

**Project Status**: ✅ Complete and ready for use

**Last Updated**: February 2025
