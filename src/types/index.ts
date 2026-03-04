export interface ResumeAnalysis {
  filename: string;
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
  };
  experienceMatch: string;
  educationMatch: string;
  recommendation: string;
  reasoning: string;
}

export interface ComparisonResult {
  totalResumes: number;
  rankings: ResumeAnalysis[];
  bestMatch: ResumeAnalysis | null;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: ResumeAnalysis | null;
  error: string | null;
}

export interface ComparisonState {
  isComparing: boolean;
  result: ComparisonResult | null;
  error: string | null;
}
