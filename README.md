# Resume Scanner AI

An intelligent resume screening and matching application powered by Groq LLM. Upload job descriptions and candidate resumes to get AI-powered analysis, scoring, and rankings.

**Live Demo**: [https://ttltq52qvpt5c.ok.kimi.link](https://ttltq52qvpt5c.ok.kimi.link)

![Resume Scanner AI](https://img.shields.io/badge/Resume%20Scanner-AI-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)
![Groq](https://img.shields.io/badge/Powered%20by-Groq-orange)

## Features

- **Single Resume Analysis**: Get detailed insights on individual candidates
- **Batch Comparison**: Compare up to 10 resumes simultaneously
- **AI-Powered Scoring**: Match scores (0-100%) based on job requirements
- **Skills Analysis**: Identifies matched and missing skills
- **Smart Recommendations**: Hire / Strong Consider / Consider / Reject classifications
- **Strengths & Weaknesses**: Detailed breakdown of candidate fit
- **Beautiful UI**: Modern, responsive interface with real-time feedback

## Tech Stack

### Frontend
- React 19 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Vite for build tooling

### Backend
- Express.js with TypeScript
- Multer for file uploads
- pdf-parse for PDF extraction
- Groq SDK for LLM integration

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Groq API key (get one at [groq.com](https://groq.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resume-scanner-ai.git
cd resume-scanner-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

### Running the Application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```
This starts:
- Frontend at `http://localhost:5173`
- Backend at `http://localhost:3001`

#### Production Build
```bash
npm run build
```

## Usage

1. **Enter Job Description**: Paste the complete job description including requirements, skills, and qualifications.

2. **Upload Resumes**: 
   - For single analysis: Upload one resume (PDF, DOC, DOCX, or TXT)
   - For comparison: Upload up to 10 resumes

3. **Get Results**:
   - Match score (0-100%)
   - Recommendation category
   - Skills match analysis
   - Strengths and weaknesses
   - Detailed assessment

## API Endpoints

### Health Check
```
GET /api/health
```

### Analyze Single Resume
```
POST /api/analyze
Content-Type: multipart/form-data

Fields:
- resume: File (PDF, DOC, DOCX, TXT)
- jobDescription: string
```

### Compare Multiple Resumes
```
POST /api/compare
Content-Type: multipart/form-data

Fields:
- resumes: File[] (max 10 files)
- jobDescription: string
```

## Response Format

### Single Analysis Response
```json
{
  "filename": "john_doe_resume.pdf",
  "score": 85,
  "summary": "Strong candidate with relevant experience...",
  "strengths": ["5+ years React experience", "TypeScript proficiency"],
  "weaknesses": ["No cloud experience"],
  "skillsMatch": {
    "matched": ["React", "TypeScript", "Node.js"],
    "missing": ["AWS", "Docker"]
  },
  "experienceMatch": "Relevant 5 years in frontend development",
  "educationMatch": "Bachelor's in Computer Science - matches requirement",
  "recommendation": "Strong Consider",
  "reasoning": "Candidate has strong technical skills..."
}
```

### Comparison Response
```json
{
  "totalResumes": 3,
  "rankings": [...],
  "bestMatch": {...}
}
```

## 🚀 Deployment (Free on Render)

This project is optimized for a single-service deployment on **Render**.

1. **Build command**: `npm install && npm run build`
2. **Start command**: `npm start`
3. **Environment Variables**:
   - `GROQ_API_KEY`: Your key from [console.groq.com](https://console.groq.com)
   - `NODE_ENV`: `production`

The server will automatically serve the compiled frontend from the `dist` directory and the backend from `dist-server`.

## Project Structure

```
resume-scanner-ai/
├── server/
│   └── index.ts          # Express server and API routes
├── src/
│   ├── components/       # React components
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main application
│   └── main.tsx          # Entry point
├── uploads/              # Temporary file uploads
├── .env                  # Environment variables
├── .env.example          # Example environment file
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [Groq](https://groq.com) for providing the LLM API
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
