import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  BrainCircuit,
  CloudUpload,
  Code,
  GitBranch,
  History,
  LayoutDashboard,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Download,
  FileJson,
  FileText,
  WandSparkles,
} from "lucide-react";
import jsPDF from "jspdf";
import { MetricTile } from "./components/MetricTile";
import { ScoreRing } from "./components/ScoreRing";
import { IssueAccordion } from "./components/IssueAccordion";
import { ReviewCommentItem } from "./components/ReviewCommentItem";
import { ChartsPanel } from "./components/ChartsPanel";
import { ProgressTimeline } from "./components/ProgressTimeline";
import {
  type ReviewComment,
  type ReviewIssue,
  bugIssues,
  improvedCode,
  performanceTips,
  reviewComments,
  sampleCode,
  securityFindings,
  trendScores,
} from "./data/mockData";

type NavSection = "Dashboard" | "Code Review" | "GitHub Review" | "History" | "Settings";
type InputTab = "Paste Code" | "Upload File" | "GitHub Repository";

interface ReviewResult {
  issues: ReviewIssue[];
  comments: ReviewComment[];
  securityFindings: string[];
  performanceTips: string[];
  improvedCode: string;
  scores: {
    overall: number;
    maintainability: number;
    readability: number;
    security: number;
  };
  confidence: number;
  summary: string;
  trendScores: number[];
  analytics: {
    severityDistribution: number[];
    complexityMetrics: number[];
    securityBreakdown: number[];
  };
}

const defaultReviewResult: ReviewResult = {
  issues: bugIssues,
  comments: reviewComments,
  securityFindings,
  performanceTips,
  improvedCode,
  scores: {
    overall: 86,
    maintainability: 88,
    readability: 82,
    security: 79,
  },
  confidence: 93,
  summary:
    "Strong code foundation with actionable improvements in query safety, secret handling, and loop optimization.",
  trendScores,
  analytics: {
    severityDistribution: [2, 4, 6, 5],
    complexityMetrics: [82, 75, 68, 79, 72],
    securityBreakdown: [35, 22, 18, 15, 10],
  },
};

const API_BASE_URL = "http://localhost:8000";

const reviewSteps = [
  "Parsing code",
  "Running static analysis",
  "AI reviewing",
  "Generating suggestions",
  "Finalizing report",
];

const uiText = {
  English: {
    title: "CodeInsight AI",
    subtitle: "Analyze, review, optimize, and secure your code using AI.",
    reviewCta: "Review My Code",
  },
  Spanish: {
    title: "Revisor de Codigo IA",
    subtitle: "Analiza, revisa, optimiza y protege tu codigo con IA.",
    reviewCta: "Revisar Mi Codigo",
  },
};

function detectLanguage(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes("def ") || lower.includes("import os")) return "Python";
  if (lower.includes("public class") || lower.includes("system.out")) return "Java";
  if (lower.includes("#include") || lower.includes("std::")) return "C++";
  return "Plain Text";
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavSection>("Code Review");
  const [activeTab, setActiveTab] = useState<InputTab>("Paste Code");
  const [model, setModel] = useState("Grok");
  const [language, setLanguage] = useState("Auto Detect");
  const [themeDark, setThemeDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [code, setCode] = useState(sampleCode);
  const [repoUrl, setRepoUrl] = useState("https://github.com/example/repo");
  const [branch, setBranch] = useState("main");
  const [repoFile, setRepoFile] = useState("src/main.py");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [uiLanguage] = useState<"English">("English");
  const [reviewDepth, setReviewDepth] = useState("Deep Analysis");
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens] = useState(3500);
  const [aiExplanations, setAiExplanations] = useState(true);
  const [responseStyle, setResponseStyle] = useState("Detailed");
  const [reviewOptions, setReviewOptions] = useState({
    bugDetection: true,
    codeOptimization: true,
    securityAnalysis: true,
    styleImprovements: true,
    performanceAnalysis: true,
    complexityAnalysis: true,
    aiSuggestions: true,
    autoFix: true,
  });
  const [historyItems, setHistoryItems] = useState([
    { timestamp: "2026-02-11 11:21", file: "payment_service.py", score: 78 },
    { timestamp: "2026-02-12 09:40", file: "auth_handler.ts", score: 84 },
  ]);
  const [reviewResult, setReviewResult] = useState<ReviewResult>(defaultReviewResult);
  const [backendStatus, setBackendStatus] = useState("Connecting...");

  const text = uiText[uiLanguage];
  const detectedLanguage = useMemo(() => detectLanguage(code), [code]);
  const activeLanguage = language === "Auto Detect" ? detectedLanguage : language;
  const charCount = code.length;
  const tokenCount = Math.ceil(code.length / 4);
  const overallScore = reviewResult.scores.overall;
  const confidence = reviewResult.confidence;

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setBackendStatus("Connected"))
      .catch(() => setBackendStatus("Offline - local demo mode"));
  }, []);

  const runReview = async () => {
    setAnalyzing(true);
    setAnalysisReady(false);
    setCurrentStep(0);
    let scoreForHistory = overallScore;

    for (let step = 0; step < reviewSteps.length; step += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 420));
      setCurrentStep(step + 1);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          model,
          language: activeLanguage,
          depth: reviewDepth,
          options: reviewOptions,
        }),
      });

      if (!response.ok) {
        throw new Error("Review endpoint failed");
      }

      const data = (await response.json()) as ReviewResult;
      setReviewResult(data);
      setBackendStatus("Connected");
      scoreForHistory = data.scores.overall;
    } catch {
      setReviewResult(defaultReviewResult);
      setBackendStatus("Offline - local demo mode");
      scoreForHistory = defaultReviewResult.scores.overall;
    }

    setAnalyzing(false);
    setAnalysisReady(true);
    setHistoryItems((prev) => [
      {
        timestamp: new Date().toLocaleString(),
        file: uploadedFileName || repoFile || "pasted_code.py",
        score: scoreForHistory,
      },
      ...prev,
    ]);
  };

  const exportJson = () => {
    const payload = {
      model,
      language: activeLanguage,
      summary: {
        overallScore,
        confidence,
        issues: reviewResult.issues.length,
      },
      issues: reviewResult.issues,
      comments: reviewResult.comments,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "review-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportImprovedCode = () => {
    const blob = new Blob([reviewResult.improvedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "improved_code.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("AI Code Reviewer Report", 14, 18);
    pdf.setFontSize(11);
    pdf.text(`Model: ${model}`, 14, 30);
    pdf.text(`Language: ${activeLanguage}`, 14, 38);
    pdf.text(`Overall Score: ${overallScore}`, 14, 46);
    pdf.text(`AI Confidence: ${confidence}%`, 14, 54);
    pdf.text("Top Findings:", 14, 66);
    reviewResult.issues.forEach((issue, idx) => {
      pdf.text(`- [${issue.severity}] L${issue.line}: ${issue.title}`, 16, 76 + idx * 8);
    });
    pdf.save("review-report.pdf");
  };

  return (
    <div className={themeDark ? "app-shell theme-dark" : "app-shell theme-light"}>
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div>
          <div className="logo-wrap">
            <BrainCircuit className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="logo-title">CodeInsight AI</p>
              <p className="logo-sub">Hb</p>
            </div>
          </div>

          <nav className="nav-menu">
            {[
              { label: "Dashboard", icon: LayoutDashboard },
              { label: "Code Review", icon: Code },
              { label: "History", icon: History },
              { label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={activeNav === item.label ? "nav-btn active" : "nav-btn"}
                  onClick={() => setActiveNav(item.label as NavSection)}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>

          <div className="side-group">
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option>GPT-4</option>
              <option>Grok</option>
              <option>Gemini</option>
              <option>Local LLM</option>
            </select>
          </div>

          <div className="side-group">
            <label>Programming Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}> 
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
            </select>
          </div>

          <div className="side-group">
            <label>UI Language</label>
            
          </div>

          <button className="theme-toggle" onClick={() => setThemeDark((value) => !value)}>
            {themeDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Theme toggle
          </button>
        </div>
        <button
  className="collapse-btn"
  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
>
  {sidebarCollapsed ? "→" : "←"}
</button>

        <div className="about-box">
          <p>About</p>
          <span>Production-style AI code analysis workspace inspired by modern developer tools.</span>
        </div>
      </aside>

      <main className="main-content">
        <section className="hero">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="main-title">
            <span className="gradient-text">{text.title}</span>
            </h1>
            <p>{text.subtitle}</p>
            <div className={`status-badge ${backendStatus.includes("Connected") ? "online" : "offline"}`}>
             Backend: {backendStatus}
            </div>
          </motion.div>
          <div className="metrics-row">
            <MetricTile label="Bugs Detected" value={String(reviewResult.issues.length)} accent="dot-red" />
            <MetricTile
              label="Security Issues"
              value={String(reviewResult.securityFindings.length)}
              accent="dot-orange"
            />
            <MetricTile label="Code Quality Score" value={`${reviewResult.scores.overall}/100`} accent="dot-cyan" />
            <MetricTile label="Suggestions Generated" value={String(reviewResult.comments.length)} accent="dot-green" />
          </div>
        </section>

        {(activeNav === "Code Review"  || activeNav === "Dashboard") && (
          <>
            <section className="panel">
              <div className="section-header">
                <h3>Code Input</h3>
                <p>Paste source code, upload files, or connect a GitHub repository.</p>
              </div>

              <div className="tab-row">
                {(["Paste Code", "Upload File", "GitHub Repository"] as InputTab[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? "tab-btn active" : "tab-btn"}>
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Paste Code" && (
                <div className="input-panel">
                  <textarea
                   className="code-input modern-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your source code here"
                  />
                  <div className="inline-actions">
                    <button onClick={() => setCode(sampleCode)}>Sample Code</button>
                    <button onClick={() => setCode("")}>Clear</button>
                  </div>
                </div>
              )}

              {activeTab === "Upload File" && (
                <div className="upload-dropzone">
                  <CloudUpload className="h-6 w-6 text-cyan-300" />
                  <p>Drag and drop or select a source file</p>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadedFileName(file.name);
                      file.text().then((content) => setCode(content));
                    }}
                  />
                  {uploadedFileName && <span>Loaded: {uploadedFileName}</span>}
                </div>
              )}

              {activeTab === "GitHub Repository" && (
                <div className="repo-grid">
                  <label>
                    GitHub Repository URL
                    <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
                  </label>
                  <label>
                    Branch
                    <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                      <option>main</option>
                      <option>develop</option>
                      <option>release/v1</option>
                    </select>
                  </label>
                  <label>
                    File Selector
                    <select value={repoFile} onChange={(e) => setRepoFile(e.target.value)}>
                      <option>src/main.py</option>
                      <option>src/auth.ts</option>
                      <option>backend/payment_service.py</option>
                    </select>
                  </label>
                </div>
              )}

              <div className="code-preview">
                <div className="meta-row">
                  <span>Detected Language: {detectedLanguage}</span>
                  <span>
                    Characters: {charCount} | Tokens: {tokenCount}
                  </span>
                </div>
                <SyntaxHighlighter language={activeLanguage.toLowerCase()} style={oneDark} customStyle={{ margin: 0, minHeight: 220 }}>
                  {code || "// Waiting for source code"}
                </SyntaxHighlighter>
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Review Options</h3>
                <p>Configure depth and analysis modules for your review run.</p>
              </div>
              <div className="options-grid">
                {[
                  ["Bug Detection", "bugDetection"],
                  ["Code Optimization", "codeOptimization"],
                  ["Security Analysis", "securityAnalysis"],
                  ["Style Improvements", "styleImprovements"],
                  ["Performance Analysis", "performanceAnalysis"],
                  ["Complexity Analysis", "complexityAnalysis"],
                  ["AI Suggestions", "aiSuggestions"],
                  ["Auto Fix Recommendations", "autoFix"],
                ].map(([label, key]) => (
                  <label className="toggle-item" key={key}>
                    <input
                      type="checkbox"
                      checked={reviewOptions[key as keyof typeof reviewOptions]}
                      onChange={(e) =>
                        setReviewOptions((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="depth-row">
                <label>Review Depth</label>
                <select value={reviewDepth} onChange={(e) => setReviewDepth(e.target.value)}>
                  <option>Basic</option>
                  <option>Intermediate</option>
                  <option>Deep Analysis</option>
                </select>
              </div>
            </section>

            <section className="action-panel">
              <button className="review-btn premium-btn" onClick={runReview} disabled={!code || analyzing}>
                <WandSparkles className="h-5 w-5" /> {text.reviewCta}
              </button>
              <ProgressTimeline steps={reviewSteps} currentStep={currentStep} active={analyzing} />
            </section>
          </>
        )}

        {analysisReady && (
          <>
            <section className="panel">
              <div className="section-header">
                <h3>Review Summary</h3>
                <p>AI confidence, scoring, and quality indicators for the current scan.</p>
              </div>
              <div className="summary-grid">
                <div className="summary-block">
                  <h4>Code Quality Score</h4>
                  <div className="score-group">
                    <ScoreRing score={overallScore} label="Overall" />
                    <div className="score-lines">
                      <p>Maintainability: {reviewResult.scores.maintainability}</p>
                      <p>Readability: {reviewResult.scores.readability}</p>
                      <p>Security: {reviewResult.scores.security}</p>
                      <p>AI Confidence: {confidence}%</p>
                    </div>
                  </div>
                </div>
                <div className="summary-block">
                  <h4>Quick Summary</h4>
                  <p>{reviewResult.summary}</p>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Bugs and Errors</h3>
                <p>Expandable issue cards with line-level severity and fixes.</p>
              </div>
              <div className="issues-list">
                {reviewResult.issues.map((issue) => (
                  <IssueAccordion key={issue.id} issue={issue} />
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>AI Review Comments</h3>
                <p>Human-like review notes, best practices, and optimization guidance.</p>
              </div>
              <div className="comment-list">
                {reviewResult.comments.map((comment) => (
                  <ReviewCommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </section>

            <section className="panel split-panels">
              <div>
                <div className="section-header">
                  <h3>Security Analysis</h3>
                  <p>Vulnerabilities, unsafe code, and secret exposure checks.</p>
                </div>
                <ul className="plain-list">
                  {reviewResult.securityFindings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="section-header">
                  <h3>Performance Improvements</h3>
                  <p>Complexity reduction and memory optimization opportunities.</p>
                </div>
                <ul className="plain-list">
                  {reviewResult.performanceTips.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="panel">
              <div className="section-header">
                <h3>Code Difference Viewer</h3>
                <p>Original and AI-improved code side-by-side.</p>
              </div>
              <div className="diff-grid">
                <div>
                  <p className="diff-label red">Original</p>
                  <SyntaxHighlighter language="python" style={oneDark} customStyle={{ margin: 0, background: "#1f1728" }}>
                    {code}
                  </SyntaxHighlighter>
                </div>
                <div>
                  <p className="diff-label green">AI Improved</p>
                  <SyntaxHighlighter language="python" style={oneDark} customStyle={{ margin: 0, background: "#14231b" }}>
                    {reviewResult.improvedCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            </section>

            <ChartsPanel
              trendScores={reviewResult.trendScores}
              severityDistribution={reviewResult.analytics.severityDistribution}
              complexityMetrics={reviewResult.analytics.complexityMetrics}
              securityBreakdown={reviewResult.analytics.securityBreakdown}
            />

            <section className="panel">
              <div className="section-header">
                <h3>Export Features</h3>
                <p>Share reports and improved code artifacts.</p>
              </div>
              <div className="export-row">
                <button onClick={exportPdf}>
                  <FileText className="h-4 w-4" /> Export PDF Report
                </button>
                <button onClick={exportImprovedCode}>
                  <Download className="h-4 w-4" /> Download Improved Code
                </button>
              </div>
            </section>
          </>
        )}

        {(activeNav === "History" || activeNav === "Dashboard") && (
          <section className="panel">
            <div className="section-header">
              <h3>History</h3>
              <p>Timestamped reviews with quick download options.</p>
            </div>
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>File</th>
                    <th>Score</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((item, idx) => (
                    <tr key={`${item.file}-${idx}`}>
                      <td>{item.timestamp}</td>
                      <td>{item.file}</td>
                      <td>{item.score}</td>
                      <td>
                        <button className="mini-btn" onClick={exportJson}>
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(activeNav === "Settings" || activeNav === "Dashboard") && (
          <section className="panel">
            <div className="section-header">
              <h3>Settings</h3>
              <p>Model tuning, token limits, and response preferences.</p>
            </div>
            <div className="settings-grid">
              <label>
                API Key
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter provider API key"
                />
              </label>
              <label>
                Model Temperature: {temperature.toFixed(1)}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                />
              </label>
              <label>
                Max Token Limit
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                />
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={aiExplanations}
                  onChange={(e) => setAiExplanations(e.target.checked)}
                />
                Enable AI explanations
              </label>
              <label>
                Response Style
                <select value={responseStyle} onChange={(e) => setResponseStyle(e.target.value)}>
                  <option>Detailed</option>
                  <option>Short</option>
                  <option>Technical</option>
                </select>
              </label>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>Developer: Harshit Bhatia</span>
          <a href="https://github.com/HarshitBhatia26" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/harshit-bhatia-5827b6257/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span>Version 1.0.0</span>
          <span className="footer-note">
            <Sparkles className="h-3.5 w-3.5" /> Real-time status updates enabled
          </span>
        </footer>
      </main>
    </div>
  );
}
