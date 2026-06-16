# AI Code Reviewer - Full Running Project

This project now includes:

- React + Vite + Tailwind frontend (developer dashboard UI)
- FastAPI machine learning backend for code scoring and review generation

## 1. Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

## 3. How Frontend Connects to ML Backend

- Frontend calls `POST /review` when "Review My Code" is clicked.
- Backend performs:
  - synthetic-feature ML scoring (`scikit-learn` random forest regressors)
  - static security and quality checks
  - review comment generation
  - improved code transformation
- Response is rendered in the dashboard cards, issues, charts, and diff viewer.

## 4. API Endpoints

- `GET /health` - backend health check
- `GET /history` - in-memory review history
- `POST /review` - full ML-powered review

## 5. Build Frontend

```bash
npm run build
```
