## 🎯 Overview

**AI Code Reviewer** is a modern, full-stack web application that combines **machine learning** with **static code analysis** to provide comprehensive, automated code reviews. It helps developers identify bugs, security vulnerabilities, and code quality issues instantly.

### Why AI Code Reviewer?

| Problem | Our Solution |
|---------|--------------|
| ⏰ Manual reviews take hours | ⚡ Instant automated analysis |
| 🎲 Inconsistent review quality | 📊 ML-based objective scoring |
| 🔓 Security issues go unnoticed | 🔒 Automated vulnerability detection |
| 📉 No quality metrics | 📈 Visual analytics dashboard |
| 💰 Expensive enterprise tools | 🆓 Free and open source |

<br>

## ✨ Features

### 🤖 Machine Learning Scoring
- **Quality Scores**: Overall, Maintainability, Readability, Security (0-100)
- **AI Confidence**: Prediction reliability percentage
- **Feature Extraction**: 7 code metrics analyzed per review

### 🔍 Security Analysis
- **SQL Injection** detection
- **Hardcoded Secrets** (API keys, passwords, tokens)
- **Unsafe Execution** (eval, exec)
- **Performance Issues** (nested loops, complexity)

### 📊 Visual Analytics
- **Severity Distribution** - Bar chart
- **Quality Trends** - Line chart
- **Complexity Metrics** - Radar chart
- **Security Breakdown** - Pie chart

### 💻 Modern Interface
- 🌙 **Dark Mode** by default
- ✨ **Smooth Animations** with Framer Motion
- 📱 **Responsive Design** for all screen sizes
- 🎨 **Professional UI** inspired by GitHub, VS Code

### 📄 Export Options
- 📑 **PDF Reports** - Shareable review documents
- 📋 **JSON Export** - Machine-readable data
- 💾 **Improved Code** - Download AI-fixed version

### 🔧 Multiple Input Methods
- ✏️ **Paste Code** - Direct input
- 📁 **Upload Files** - Drag and drop
- 🔗 **GitHub URL** - Repository integration (UI ready)

<br>




<br>



### Three-Tier Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Presentation** | React, Tailwind | User interface |
| **Application** | FastAPI, scikit-learn | Business logic, ML |
| **Data** | In-Memory (upgradeable) | Storage |

<br>

## 🛠 Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | UI Framework | 18.x |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Type Safety | 5.x |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool | 7.x |
| ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Styling | 3.x |
| ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | Animations | 10.x |
| ![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat&logo=plotly&logoColor=white) | Charts | 2.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Language | 3.11+ |
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) | Web Framework | 0.116 |
| ![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white) | ML Library | 1.7 |
| ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat&logo=pydantic&logoColor=white) | Validation | 2.11 |
| ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white) | Numerical | 2.3 |

<br>

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.11+
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-code-reviewer.git
cd ai-code-reviewer
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
### Installation

```bash
# Install Groq SDK
pip install groq

# Install with all dependencies
pip install groq openai python-dotenv requests

# Verify installation
python -c "from groq import Groq; print('Groq installed successfully')"
```

### Environment Setup

```bash
# Set API key (Linux/macOS)
export GROQ_API_KEY="gsk_your_key_here"

# Set API key (Windows)
set GROQ_API_KEY=gsk_your_key_here

# Verify API key
python -c "import os; print('Key set:', bool(os.getenv('GROQ_API_KEY')))"
```

## Main Dashboard
1) User interface(Backend offline)   <img width="1902" height="865" alt="Screenshot 2026-06-12 020755" src="https://github.com/user-attachments/assets/b28d7ffc-4727-4c3c-9006-6c2fb3f3497f" />

2) User interface(Backend online) <img width="1901" height="873" alt="Screenshot 2026-06-12 020604" src="https://github.com/user-attachments/assets/6f9baed8-6cd5-4e74-9b5a-d46c620917d0" />

3) Function copying <img width="1885" height="865" alt="Screenshot 2026-06-12 020906" src="https://github.com/user-attachments/assets/c7c053b7-26a4-47bf-9fe2-8bc6a969cdec" />


4) Review summary  <img width="1878" height="868" alt="Screenshot 2026-06-12 021001" src="https://github.com/user-attachments/assets/7717c86e-2c75-4134-9970-7182b15490e8" />
                   <img width="1903" height="865" alt="Screenshot 2026-06-12 021034" src="https://github.com/user-attachments/assets/878b0557-62b9-43d9-a7d0-078893d62eeb" />
                   <img width="1901" height="870" alt="Screenshot 2026-06-12 021054" src="https://github.com/user-attachments/assets/61438713-f8ad-41b1-b330-9c4c6886081b" />
5) History check <img width="1903" height="852" alt="Screenshot 2026-06-12 021113" src="https://github.com/user-attachments/assets/7217e4ef-9009-4702-8dbc-d6055d327739" />
