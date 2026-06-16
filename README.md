# CodeInsight-AI
🎯 Overview

**AI Code Reviewer** is a modern, full-stack web application that combines **machine learning** with **static code analysis** to provide comprehensive, automated code reviews. It helps developers identify bugs, security vulnerabilities, and code quality issues instantly.

Why AI Code Reviewer?

| Problem | Our Solution |
|---------|--------------|
| ⏰ Manual reviews take hours | ⚡ Instant automated analysis |
| 🎲 Inconsistent review quality | 📊 ML-based objective scoring |
| 🔓 Security issues go unnoticed | 🔒 Automated vulnerability detection |
| 📉 No quality metrics | 📈 Visual analytics dashboard |
| 💰 Expensive enterprise tools | 🆓 Free and open source |



✨ Features

🤖 Machine Learning Scoring
- **Quality Scores**: Overall, Maintainability, Readability, Security (0-100)
- **AI Confidence**: Prediction reliability percentage
- **Feature Extraction**: 7 code metrics analyzed per review

🔍 Security Analysis
- **SQL Injection** detection
- **Hardcoded Secrets** (API keys, passwords, tokens)
- **Unsafe Execution** (eval, exec)
- **Performance Issues** (nested loops, complexity)

📊 Visual Analytics
- **Severity Distribution** - Bar chart
- **Quality Trends** - Line chart
- **Complexity Metrics** - Radar chart
- **Security Breakdown** - Pie chart

💻 Modern Interface
- 🌙 **Dark Mode** by default
- 📱 **Responsive Design** for all screen sizes
- 🎨 **Professional UI** inspired by GitHub, VS Code

📄 Export Options
- 📑 PDF Reports- Shareable review documents
- 💾 Improved Code - Download AI-fixed version

🔧 Multiple Input Methods
- ✏️ Paste Code - Direct input
- 📁 Upload Files - Drag and drop
- 🔗 GitHub URL- Repository integration (UI ready)


### Three-Tier Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Presentation** | React, Tailwind | User interface |
| **Application** | FastAPI, scikit-learn | Business logic, ML |
| **Data** | In-Memory (upgradeable) | Storage |


🛠 Tech Stack

Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | UI Framework | 18.x |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Type Safety | 5.x |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool | 7.x |
| ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | Animations | 10.x |
| ![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat&logo=plotly&logoColor=white) | Charts | 2.x |

Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Language | 3.11+ |
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) | Web Framework | 0.116 |
| ![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white) | ML Library | 1.7 |
| ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat&logo=pydantic&logoColor=white) | Validation | 2.11 |
| ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white) | Numerical | 2.3 |


### 📦 Installation

 Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.11+
- **Git**

### Frontend Setup

bash
- Install dependencies
  npm install

- Start development server
  npm run dev


Frontend runs at: `http://localhost:5173`

### Backend Setup

bash
- Navigate to backend
  cd backend

- Create virtual environment
  python -m venv .venv

- Activate virtual environment
  On Windows:
  .venv\Scripts\activate

- Install dependencies
  pip install -r requirements.txt

- Start server
  uvicorn main:app --reload --port 8000


### Installation and API integration 

bash
- Install Groq SDK
  pip install groq

- Install with all dependencies
  pip install groq openai python-dotenv requests

- Verify installation
  python -c "from groq import Groq; print('Groq installed successfully')"


Environment Setup

bash
# Set API key (Linux/macOS)
export GROQ_API_KEY="gsk_your_key_here"

# Set API key (Windows)
set GROQ_API_KEY=gsk_your_key_here

# Verify API key
python -c "import os; print('Key set:', bool(os.getenv('GROQ_API_KEY')))"


Backend runs at: `http://localhost:8000`

Main Dashboard
1) User interface (Backend offline)
<img width="1902" height="865" alt="Screenshot 2026-06-12 020755" src="https://github.com/user-attachments/assets/5affaacd-9502-45e6-baef-c2344e8c6b30" />


2) User interface (Backend online)
<img width="1901" height="873" alt="Screenshot 2026-06-12 020604" src="https://github.com/user-attachments/assets/6afad4db-d40c-4b16-b5f3-00194c122fae" />


3) Code paste
<img width="1885" height="865" alt="Screenshot 2026-06-12 020906" src="https://github.com/user-attachments/assets/2c71327b-d02a-4fa6-beaf-dd55cd094415" />


4) Review summary
<img width="1878" height="868" alt="Screenshot 2026-06-12 021001" src="https://github.com/user-attachments/assets/e9e75e5b-baed-4321-8dea-b9a6e9653876" />


<img width="1903" height="865" alt="Screenshot 2026-06-12 021034" src="https://github.com/user-attachments/assets/5248cb82-8c0a-4d3f-b439-7fc22179270c" />


<img width="1901" height="870" alt="Screenshot 2026-06-12 021054" src="https://github.com/user-attachments/assets/3dc16f35-31a0-47ba-b158-27cf00cffae8" />


5) History check
<img width="1903" height="852" alt="Screenshot 2026-06-12 021113" src="https://github.com/user-attachments/assets/e072fa5b-d478-4108-b4c9-bbeabd4ffead" />








