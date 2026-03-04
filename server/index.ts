import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// pdf-parse is commonly published as CommonJS; when running this server as ESM
// ("type": "module" + tsx), a default import can fail. Use createRequire for compatibility.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// ESM equivalents for __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CJS import for pdf-parse (works reliably under ESM)
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
});

// Parse PDF file
async function parsePDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

// Parse text file
async function parseTextFile(filePath: string): Promise<string> {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error parsing text file:', error);
    throw new Error('Failed to parse text file');
  }
}

// Extract text from file
async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return await parsePDF(filePath);
  } else if (ext === '.txt' || ext === '.doc' || ext === '.docx') {
    return await parseTextFile(filePath);
  } else {
    throw new Error('Unsupported file format');
  }
}

// Analyze resume with Groq
async function analyzeResume(resumeText: string, jobDescription: string) {
  const prompt = `
You are an expert HR recruiter and resume analyzer. Your task is to analyze the provided resume against the job description and provide a detailed assessment.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Please analyze the resume and provide the following in JSON format:

{
  "score": <number between 0-100>,
  "summary": "<brief summary of the candidate's fit>",
  "strengths": ["<list of key strengths matching the job>"],
  "weaknesses": ["<list of gaps or weaknesses>"],
  "skillsMatch": {
    "matched": ["<skills that match the job requirements>"],
    "missing": ["<required skills not found in resume>"]
  },
  "experienceMatch": "<assessment of experience relevance>",
  "educationMatch": "<assessment of education fit>",
  "recommendation": "<Hire / Strong Consider / Consider / Reject>",
  "reasoning": "<detailed reasoning for the recommendation>"
}

Be objective and thorough in your analysis. Focus on actual qualifications and experience mentioned in the resume.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume analyzer and recruitment expert. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid response format from LLM');
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

// Compare multiple resumes
async function compareResumes(resumes: { filename: string; text: string }[], jobDescription: string) {
  const analyses = await Promise.all(
    resumes.map(async (resume) => {
      try {
        const analysis = await analyzeResume(resume.text, jobDescription);
        return {
          filename: resume.filename,
          ...analysis,
        };
      } catch (error) {
        console.error(`Error analyzing ${resume.filename}:`, error);
        return {
          filename: resume.filename,
          score: 0,
          summary: 'Error analyzing this resume',
          strengths: [],
          weaknesses: ['Analysis failed'],
          skillsMatch: { matched: [], missing: [] },
          experienceMatch: 'N/A',
          educationMatch: 'N/A',
          recommendation: 'Error',
          reasoning: 'Failed to analyze this resume. Please check the file format.',
        };
      }
    })
  );

  // Sort by score descending
  analyses.sort((a, b) => b.score - a.score);

  return analyses;
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Scanner API is running' });
});

// Single resume analysis
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const resumeText = await extractTextFromFile(req.file.path);
    const analysis = await analyzeResume(resumeText, jobDescription);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      filename: req.file.originalname,
      ...analysis,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Multiple resumes comparison
app.post('/api/compare', upload.array('resumes', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No resume files uploaded' });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const resumes = await Promise.all(
      files.map(async (file) => ({
        filename: file.originalname,
        text: await extractTextFromFile(file.path),
      }))
    );

    const results = await compareResumes(resumes, jobDescription);

    // Clean up uploaded files
    files.forEach((file) => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    });

    res.json({
      totalResumes: files.length,
      rankings: results,
      bestMatch: results[0] || null,
    });
  } catch (error: any) {
    console.error('Error in /api/compare:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../../dist');
  app.use(express.static(staticPath));

  // Handle client-side routing
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(staticPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
