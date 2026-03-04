import type { ResumeAnalysis, ComparisonResult } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function analyzeResume(
  resumeFile: File,
  jobDescription: string
): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze resume');
  }

  return await response.json();
}

export async function compareResumes(
  resumeFiles: File[],
  jobDescription: string
): Promise<ComparisonResult> {
  const formData = new FormData();
  resumeFiles.forEach((file) => {
    formData.append('resumes', file);
  });
  formData.append('jobDescription', jobDescription);

  const response = await fetch(`${API_URL}/compare`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to compare resumes');
  }

  return await response.json();
}

export async function checkHealth(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_URL}/health`);
  return await response.json();
}
