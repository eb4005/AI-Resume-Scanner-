import { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Loader2,
  Trash2,
  Sparkles,
  Zap,
  ChevronRight,
  Cpu,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeResume, compareResumes } from '@/services/api';
import type { ResumeAnalysis, ComparisonResult } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Toaster, toast } from 'sonner';

// Utility for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Score color helper
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-rose-600';
}

function getRecommendationColor(rec: string): string {
  if (rec.includes('Hire')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (rec.includes('Strong')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (rec.includes('Consider')) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-rose-100 text-rose-700 border-rose-200';
}

// Single Analysis Result Component
function SingleResult({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Match Score</p>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-5xl font-bold", getScoreColor(analysis.score))}>
                  {analysis.score}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant="outline"
                className={cn("text-sm px-3 py-1", getRecommendationColor(analysis.recommendation))}
              >
                {analysis.recommendation}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={analysis.score}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-rose-700 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Skills Match */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Skills Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-emerald-700 mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsMatch.matched.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-rose-700 mb-2">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsMatch.missing.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-rose-700 border-rose-200 bg-rose-50/50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Detailed Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Analysis Reasoning</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{analysis.reasoning}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Experience</p>
                <p className="text-xs text-muted-foreground">{analysis.experienceMatch}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Education</p>
                <p className="text-xs text-muted-foreground">{analysis.educationMatch}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Comparison Results Component
function ComparisonResults({ result }: { result: ComparisonResult }) {
  return (
    <div className="space-y-6">
      {/* Best Match Banner */}
      {result.bestMatch && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Top Recommendation</p>
                <p className="text-xl font-bold">{result.bestMatch.filename.replace(/\.[^/.]+$/, "")}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn("text-2xl font-bold", getScoreColor(result.bestMatch.score))}>
                    {result.bestMatch.score}%
                  </span>
                  <Badge className={cn("font-bold shadow-none", getRecommendationColor(result.bestMatch.recommendation))}>
                    {result.bestMatch.recommendation}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Candidate Rankings
          </CardTitle>
          <CardDescription>
            All uploaded resumes ranked by job requirement matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.rankings.map((resume, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-all",
                  index === 0 ? "border-emerald-200 bg-emerald-50" : "border-border bg-card"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                  index === 0 ? "bg-emerald-600 text-white" : "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{resume.filename}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-1.5 py-0", getRecommendationColor(resume.recommendation))}>
                      {resume.recommendation}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <p className={cn("text-xl font-bold", getScoreColor(resume.score))}>
                    {resume.score}%
                  </p>
                  <Progress value={resume.score} className="w-16 h-1 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparative Data Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Detailed Analysis Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {result.rankings.map((resume, index) => (
                <div key={index} className="p-4 rounded-xl border border-border bg-secondary/20">
                  <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                    <h4 className="font-bold text-sm">
                      <span className="text-muted-foreground mr-2">#{index + 1}</span>
                      {resume.filename}
                    </h4>
                    <span className={cn("font-bold", getScoreColor(resume.score))}>
                      {resume.score}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 italic">"{resume.summary}"</p>
                  <div className="flex flex-wrap gap-2">
                    {resume.strengths.slice(0, 3).map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] font-medium">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Main App Component
function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [singleResult, setSingleResult] = useState<ResumeAnalysis | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState('single');

  const handleSingleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSingleFile(file);
      setSingleResult(null);
    }
  }, []);

  const handleMultipleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMultipleFiles(files);
      setComparisonResult(null);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setMultipleFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSingleAnalyze = async () => {
    if (!singleFile || !jobDescription.trim()) {
      toast.error('Please upload a resume and provide a job description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(singleFile, jobDescription);
      setSingleResult(result);
      toast.success('Resume analysis completed successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze resume.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompare = async () => {
    if (multipleFiles.length === 0 || !jobDescription.trim()) {
      toast.error('Please upload resumes and provide a job description.');
      return;
    }

    setIsComparing(true);
    try {
      const result = await compareResumes(multipleFiles, jobDescription);
      setComparisonResult(result);
      toast.success(`Successfully compared ${result.totalResumes} resumes.`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to compare resumes.');
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Cpu className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AI Resume <span className="text-purple-600">Scanner</span></h1>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Fast & Intelligent Screening</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 bg-background">
              v1.2.0
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Column - Controls */}
          <div className="lg:col-span-5 space-y-6">

            {/* Job Description Input */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Job Description
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] bg-muted/50">{jobDescription.length} characters</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none focus-visible:ring-purple-600 border-border"
                />
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="single">Single Analysis</TabsTrigger>
                <TabsTrigger value="multiple">Compare Resumes</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Upload Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer relative border-emerald-100">
                      <input
                        type="file"
                        id="single-resume"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleSingleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-sm">Click or drag to upload</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT (Max 10MB)</p>
                        </div>
                      </div>
                    </div>

                    {singleFile && (
                      <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-md">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="truncate max-w-[200px]">{singleFile.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSingleFile(null)}>
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={handleSingleAnalyze}
                      disabled={!singleFile || !jobDescription.trim() || isAnalyzing}
                      className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Run AI Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="multiple" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-400" />
                      Batch Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        id="multiple-resumes"
                        accept=".pdf,.doc,.docx,.txt"
                        multiple
                        onChange={handleMultipleFilesChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-sm">Upload Multiple Resumes</p>
                          <p className="text-xs text-muted-foreground mt-1">Select up to 10 files</p>
                        </div>
                      </div>
                    </div>

                    {multipleFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase">{multipleFiles.length} Resumes Selected</p>
                        <ScrollArea className="h-40 border rounded-md p-2">
                          <div className="space-y-1">
                            {multipleFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded text-xs">
                                <span className="truncate font-medium">{file.name}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                  <Trash2 className="w-3 h-3 text-rose-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    <Button
                      onClick={handleCompare}
                      disabled={multipleFiles.length === 0 || !jobDescription.trim() || isComparing}
                      className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                    >
                      {isComparing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Comparing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Compare All Resumes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-7">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>

              {!singleResult && !comparisonResult ? (
                <Card className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Cpu className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg">No Results Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                    Upload a resume and click analyze to see the AI assessment here.
                  </p>
                </Card>
              ) : activeTab === 'single' && singleResult ? (
                <SingleResult analysis={singleResult} />
              ) : activeTab === 'multiple' && comparisonResult ? (
                <ComparisonResults result={comparisonResult} />
              ) : (
                <Card className="p-10 text-center">
                  <p className="text-muted-foreground">Please perform the corresponding analysis.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12 py-8 bg-card shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 AI Resume Scanner • Built with Groq LLM
          </p>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
