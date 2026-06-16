from datetime import datetime
from typing import Dict, List
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv

from ml_engine import MLCodeScorer
from schemas import AnalyticsBlock, ReviewRequest, ReviewResponse, ScoreBlock
from static_checks import auto_improve_code, build_analytics, build_comments, detect_issues

load_dotenv()

# ✅ Configure Groq
client = Groq(api_key="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")
GROQ_MODEL = "llama-3.3-70b-versatile"  # Free, fast, powerful

app = FastAPI(title="AI Code Reviewer ML Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scorer = MLCodeScorer()
history: List[Dict[str, str | int]] = []


@app.get("/")
def root():
    return {"message": "AI Code Reviewer Backend Running with Groq"}


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "service": "ml-review-backend"}


@app.get("/history")
def get_history() -> List[Dict[str, str | int]]:
    return history


@app.post("/review", response_model=ReviewResponse)
def review_code(payload: ReviewRequest) -> ReviewResponse:

    # ✅ ML scoring
    ml_scores = scorer.score(payload.code)

    # ✅ GROQ AI REVIEW
    try:
        prompt = f"""
        You are a senior software engineer and expert code reviewer.

        Review the following {payload.language} code.

        Provide:
        1. Bug detection (syntax + logical errors)
        2. Security vulnerabilities
        3. Performance improvements
        4. Code quality improvements
        5. Best practice recommendations
        6. A fully refactored version of the code

        Code:
        {payload.code}
        """

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior software engineer and expert code reviewer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=2048,
            temperature=0.3,
        )

        ai_review_text = response.choices[0].message.content or "No AI response generated."

    except Exception as e:
        ai_review_text = f"AI review failed: {str(e)}"

    # ✅ STATIC CHECKS
    issues, security_findings, perf_tips = detect_issues(payload.code, payload.language)
    comments = build_comments(issues)

    improved_code = ai_review_text
    analytics = build_analytics(issues, ml_scores)

    trend_start = max(35, ml_scores["overall"] - 18)
    trend_scores = [trend_start + i * 3 for i in range(6)]
    trend_scores[-1] = ml_scores["overall"]

    summary = ai_review_text

    score_block = ScoreBlock(
        overall=ml_scores["overall"],
        maintainability=ml_scores["maintainability"],
        readability=ml_scores["readability"],
        security=ml_scores["security"],
    )

    analytics_block = AnalyticsBlock(**analytics)

    history.insert(
        0,
        {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "file": "submitted_code",
            "score": ml_scores["overall"],
        },
    )

    return ReviewResponse(
        issues=issues,
        comments=comments,
        securityFindings=security_findings,
        performanceTips=perf_tips,
        improvedCode=improved_code,
        scores=score_block,
        confidence=ml_scores["confidence"],
        summary=summary,
        trendScores=trend_scores,
        analytics=analytics_block,
    )