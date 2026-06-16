import re
from typing import Dict, List, Tuple

from schemas import ReviewComment, ReviewIssue


SEVERITY_ORDER = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}


def _line_number_from_pattern(code: str, pattern: str) -> int:
    match = re.search(pattern, code, flags=re.IGNORECASE)
    if not match:
        return 1
    return code[: match.start()].count("\n") + 1


def detect_issues(code: str, language: str) -> Tuple[List[ReviewIssue], List[str], List[str]]:
    issues: List[ReviewIssue] = []
    security_findings: List[str] = []
    perf_tips: List[str] = []

    if re.search(r"(api[_-]?key\s*=|token\s*=|password\s*=)", code, flags=re.IGNORECASE):
        issues.append(
            ReviewIssue(
                id="sec-1",
                title="Hardcoded secret detected",
                line=_line_number_from_pattern(code, r"(api[_-]?key\s*=|token\s*=|password\s*=)"),
                severity="High",
                explanation="A credential-like value appears in source code.",
                fix="Move secrets to environment variables or a secrets manager.",
            )
        )
        security_findings.append("Hardcoded secret or credential pattern detected")

    if re.search(r"(SELECT\s+.+\+|f\"SELECT|format\(.*SELECT)", code, flags=re.IGNORECASE):
        issues.append(
            ReviewIssue(
                id="sec-2",
                title="Potential SQL injection",
                line=_line_number_from_pattern(code, r"SELECT"),
                severity="Critical",
                explanation="SQL query appears dynamically concatenated with user-controlled input.",
                fix="Use prepared statements with bound parameters.",
            )
        )
        security_findings.append("SQL injection risk in query composition")

    if re.search(r"\beval\(|exec\(", code):
        issues.append(
            ReviewIssue(
                id="sec-3",
                title="Unsafe dynamic execution",
                line=_line_number_from_pattern(code, r"\beval\(|exec\("),
                severity="High",
                explanation="Dynamic execution functions can run unsafe payloads.",
                fix="Avoid eval/exec, or strictly sandbox and validate expressions.",
            )
        )
        security_findings.append("Dynamic execution primitive detected")

    if re.search(r"for\s+.*:\n\s+for\s+", code, flags=re.MULTILINE):
        issues.append(
            ReviewIssue(
                id="perf-1",
                title="Nested loop may impact performance",
                line=_line_number_from_pattern(code, r"for\s+"),
                severity="Medium",
                explanation="Detected nested iteration likely causing O(n^2) complexity.",
                fix="Use hash-based lookup or batching to reduce complexity.",
            )
        )
        perf_tips.append("Replace nested loops with dictionary or set lookups where possible")

    if len(code.splitlines()) > 180:
        issues.append(
            ReviewIssue(
                id="maint-1",
                title="Large file with high maintenance load",
                line=1,
                severity="Low",
                explanation="Large source files are harder to reason about and test.",
                fix="Split into smaller modules by responsibility.",
            )
        )

    if not perf_tips:
        perf_tips = [
            "Cache repeated expensive operations.",
            "Profile hotspots before major refactors.",
            "Use streaming for large file processing.",
        ]

    if not security_findings:
        security_findings = ["No critical security signatures detected in this scan."]

    issues.sort(key=lambda issue: SEVERITY_ORDER[issue.severity])
    return issues, security_findings, perf_tips


def build_comments(issues: List[ReviewIssue], file_name: str = "main.py") -> List[ReviewComment]:
    comments: List[ReviewComment] = []
    for idx, issue in enumerate(issues, start=1):
        comments.append(
            ReviewComment(
                id=f"comment-{idx}",
                severity=issue.severity,
                file=file_name,
                line=issue.line,
                message=issue.title,
                suggestion=issue.fix,
            )
        )

    if not comments:
        comments.append(
            ReviewComment(
                id="comment-0",
                severity="Low",
                file=file_name,
                line=1,
                message="No major issues detected.",
                suggestion="Consider adding extra tests and docs for long-term maintainability.",
            )
        )

    return comments


def auto_improve_code(code: str) -> str:
    improved = code
    improved = re.sub(r"(api[_-]?key\s*=\s*[\"\']).+?([\"'])", r"\1<REDACTED_SECRET>\2", improved, flags=re.IGNORECASE)
    improved = improved.replace("SELECT * FROM", "SELECT id, name FROM")

    if "TODO:" not in improved:
        improved = "# TODO: Add unit tests for reviewed logic\n" + improved

    return improved


def build_analytics(issues: List[ReviewIssue], score: Dict[str, int]) -> Dict[str, List[int]]:
    severity = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    for issue in issues:
        severity[issue.severity] += 1

    sec_penalty = max(0, 100 - score["security"])
    return {
        "severityDistribution": [severity["Critical"], severity["High"], severity["Medium"], severity["Low"]],
        "complexityMetrics": [
            max(15, 100 - (len(issues) * 7)),
            max(18, 88 - (len(issues) * 6)),
            max(20, 84 - (len(issues) * 5)),
            max(24, score["maintainability"]),
            max(20, score["readability"]),
        ],
        "securityBreakdown": [
            max(5, int(sec_penalty * 0.35)),
            max(4, int(sec_penalty * 0.22)),
            max(3, int(sec_penalty * 0.18)),
            max(2, int(sec_penalty * 0.15)),
            max(2, int(sec_penalty * 0.10)),
        ],
    }
