from typing import Dict, List, Literal

from pydantic import BaseModel


Severity = Literal["Critical", "High", "Medium", "Low"]


class ReviewIssue(BaseModel):
    id: str
    title: str
    line: int
    severity: Severity
    explanation: str
    fix: str


class ReviewComment(BaseModel):
    id: str
    severity: Severity
    file: str
    line: int
    message: str
    suggestion: str


class ReviewRequest(BaseModel):
    code: str
    model: str
    language: str
    depth: str
    options: Dict[str, bool]


class ScoreBlock(BaseModel):
    overall: int
    maintainability: int
    readability: int
    security: int


class AnalyticsBlock(BaseModel):
    severityDistribution: List[int]
    complexityMetrics: List[int]
    securityBreakdown: List[int]


class ReviewResponse(BaseModel):
    issues: List[ReviewIssue]
    comments: List[ReviewComment]
    securityFindings: List[str]
    performanceTips: List[str]
    improvedCode: str
    scores: ScoreBlock
    confidence: int
    summary: str
    trendScores: List[int]
    analytics: AnalyticsBlock
