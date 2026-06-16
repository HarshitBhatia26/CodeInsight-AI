import re
from dataclasses import dataclass
from typing import Dict, List

import numpy as np
from sklearn.ensemble import RandomForestRegressor


def _clip_score(value: float) -> int:
    return int(max(0, min(100, round(value))))


@dataclass
class FeatureVector:
    line_count: int
    avg_line_length: float
    function_count: int
    loop_count: int
    nested_loop_hints: int
    security_hints: int
    comment_ratio: float

    def as_array(self) -> np.ndarray:
        return np.array(
            [
                self.line_count,
                self.avg_line_length,
                self.function_count,
                self.loop_count,
                self.nested_loop_hints,
                self.security_hints,
                self.comment_ratio,
            ],
            dtype=float,
        )


class MLCodeScorer:
    """Trains lightweight regressors over synthetic labeled code metrics."""

    def __init__(self) -> None:
        self.maint_model = RandomForestRegressor(n_estimators=120, random_state=7)
        self.read_model = RandomForestRegressor(n_estimators=120, random_state=13)
        self.sec_model = RandomForestRegressor(n_estimators=120, random_state=21)
        self._fit_models()

    def _fit_models(self) -> None:
        rng = np.random.default_rng(42)
        x_train: List[np.ndarray] = []
        y_maint: List[float] = []
        y_read: List[float] = []
        y_sec: List[float] = []

        for _ in range(1500):
            lines = int(rng.integers(8, 500))
            avg_len = float(rng.uniform(20, 120))
            funcs = int(rng.integers(1, 45))
            loops = int(rng.integers(0, 30))
            nested = int(rng.integers(0, 10))
            sec_hints = int(rng.integers(0, 12))
            comment_ratio = float(rng.uniform(0.0, 0.35))

            feat = np.array([lines, avg_len, funcs, loops, nested, sec_hints, comment_ratio], dtype=float)
            x_train.append(feat)

            maintainability = 95 - (lines * 0.03) - (nested * 3.0) - (loops * 0.45) + (funcs * 0.25)
            readability = 92 - (avg_len * 0.35) - (nested * 1.3) + (comment_ratio * 40)
            security = 96 - (sec_hints * 5.4) - (nested * 0.8)

            noise = rng.normal(0, 2.2)
            y_maint.append(maintainability + noise)
            y_read.append(readability + noise)
            y_sec.append(security + noise)

        x_arr = np.vstack(x_train)
        self.maint_model.fit(x_arr, np.array(y_maint))
        self.read_model.fit(x_arr, np.array(y_read))
        self.sec_model.fit(x_arr, np.array(y_sec))

    def extract_features(self, code: str) -> FeatureVector:
        lines = [line for line in code.splitlines() if line.strip()]
        line_count = max(1, len(lines))
        avg_line_length = sum(len(line) for line in lines) / line_count
        function_count = len(re.findall(r"\b(def|function|func|public\s+static)\b", code))
        loop_count = len(re.findall(r"\b(for|while)\b", code))
        nested_loop_hints = len(re.findall(r"for\s+.*:\n\s+for\s+", code, flags=re.MULTILINE))
        security_hints = len(
            re.findall(r"(password\s*=|api[_-]?key\s*=|token\s*=|SELECT\s+\*\s+FROM.+\+|eval\()", code, flags=re.IGNORECASE)
        )
        comment_lines = len([line for line in lines if line.strip().startswith(("#", "//", "/*", "*"))])
        comment_ratio = comment_lines / line_count

        return FeatureVector(
            line_count=line_count,
            avg_line_length=avg_line_length,
            function_count=function_count,
            loop_count=loop_count,
            nested_loop_hints=nested_loop_hints,
            security_hints=security_hints,
            comment_ratio=comment_ratio,
        )

    def score(self, code: str) -> Dict[str, int]:
        features = self.extract_features(code)
        x = features.as_array().reshape(1, -1)

        maintainability = _clip_score(float(self.maint_model.predict(x)[0]))
        readability = _clip_score(float(self.read_model.predict(x)[0]))
        security = _clip_score(float(self.sec_model.predict(x)[0]))
        overall = _clip_score((maintainability + readability + security) / 3)

        tree_predictions = np.array([estimator.predict(x)[0] for estimator in self.maint_model.estimators_])
        uncertainty = float(np.std(tree_predictions))
        confidence = _clip_score(98 - (uncertainty * 6.5))
        confidence = max(confidence, 55)

        return {
            "overall": overall,
            "maintainability": maintainability,
            "readability": readability,
            "security": security,
            "confidence": confidence,
        }
