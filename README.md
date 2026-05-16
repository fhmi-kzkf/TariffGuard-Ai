# 🛡️ TariffGuard AI

**Autonomous Regulatory Compliance & Tariff Auditor**

TariffGuard AI is an intelligent system that automates tariff classification, regulatory compliance checking, and customs audit processes using AI-powered agents. Built with CrewAI, FastAPI, and Next.js.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🤖 **AI-Powered Agents**: Multi-agent system using CrewAI for intelligent tariff analysis
- 📊 **Product Classification**: Automatic HS code classification for imported goods
- 🔍 **Customs Scraping**: Real-time tariff data extraction from customs databases
- ⚖️ **Legal Auditing**: Compliance verification against international trade regulations
- 📈 **Risk Assessment**: Penalty calculation and compliance risk analysis
- 🌐 **FTA Analysis**: Free Trade Agreement eligibility checking
- 💼 **Audit History**: Complete audit trail and historical analysis
- 🎨 **Modern UI**: Responsive Next.js frontend with real-time updates

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │New Audit │  │ History  │  │   Docs   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (FastAPI)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CrewAI Agent System                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │  Product    │  │  Customs    │  │   Legal     │ │  │
│  │  │ Classifier  │  │  Scraper    │  │  Auditor    │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Tools Layer                       │  │
│  │  • Classifier Tools  • Scraper Tools                 │  │
│  │  • FTA Tools         • Penalty Tools                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │ SQLite  │
                    │Database │
                    └─────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.111+
- **AI Engine**: CrewAI 0.51+ with Google Gemini
- **Database**: SQLAlchemy with SQLite/PostgreSQL
- **Tools**: CrewAI Tools 0.8.3+
- **Web Scraping**: BeautifulSoup4, HTTPX
- **Async Support**: aiosqlite, asyncio

### Frontend
- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **State Management**: SWR for data fetching
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 📦 Prerequisites

- **Python**: 3.11.0 or higher
- **Node.js**: 18.18.0 or higher
- **npm/yarn/pnpm**: Latest version
- **Git**: For version control

### API Keys Required
- **Gemini API Key**: For AI agent operations
- **Serper API Key** (Optional): For web search capabilities
- **WCO API Key** (Optional): For World Customs Organization data
- **Redis URL** (Optional): For caching

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TariffGuard-Ai.git
cd TariffGuard-Ai
```

### 2. Backend Setup

```bash
cd tariff_auditor_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys
```

### 3. Frontend Setup

```bash
cd tariff_auditor_frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in `tariff_auditor_backend/`:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite+aiosqlite:///./tariffguard.db
FRONTEND_URL=http://localhost:3000

# Optional
SERPER_API_KEY=your_serper_api_key
WCO_API_KEY=your_wco_api_key
REDIS_URL=redis://localhost:6379
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:8000` for the backend API. To change this, update the API base URL in your frontend configuration.

---

## 🎯 Usage

### Starting the Backend

```bash
cd tariff_auditor_backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run the server
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### Starting the Frontend

```bash
cd tariff_auditor_frontend

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will be available at: `http://localhost:3000`

### Running Both Simultaneously

**Terminal 1 (Backend):**
```bash
cd tariff_auditor_backend && python main.py
```

**Terminal 2 (Frontend):**
```bash
cd tariff_auditor_frontend && npm run dev
```

---

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Health Check
```http
GET /health
```

#### Create Audit
```http
POST /api/audit
Content-Type: application/json

{
  "product_name": "Laptop Computer",
  "product_description": "15-inch laptop with Intel processor",
  "origin_country": "China",
  "destination_country": "United States",
  "declared_value": 1200.00,
  "declared_hs_code": "8471.30"
}
```

#### Get Audit Status
```http
GET /api/audit/{audit_id}
```

#### List Audits
```http
GET /api/audits?skip=0&limit=10
```

---

## 📁 Project Structure

```
TariffGuard-Ai/
├── tariff_auditor_backend/
│   ├── agents/                 # AI agent definitions
│   │   ├── crew.py            # CrewAI orchestration
│   │   ├── product_classifier.py
│   │   ├── customs_scraper.py
│   │   └── legal_auditor.py
│   ├── api/                   # API routes
│   │   └── routes/
│   │       ├── audit.py
│   │       └── health.py
│   ├── models/                # Database models
│   │   ├── audit.py
│   │   └── schemas.py
│   ├── services/              # Business logic
│   │   └── audit_service.py
│   ├── tools/                 # Agent tools
│   │   ├── classifier_tools.py
│   │   ├── scraper_tools.py
│   │   ├── fta_tools.py
│   │   └── penalty_tools.py
│   ├── prompts/               # Agent prompts
│   │   └── agent_prompts.py
│   ├── config.py              # Configuration
│   ├── database.py            # Database setup
│   ├── main.py                # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── tariff_auditor_frontend/
│   ├── src/
│   │   ├── app/               # Next.js app router
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── dashboard/
│   │   │   ├── audit/
│   │   │   ├── history/
│   │   │   └── docs/
│   │   ├── components/        # React components
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── next.config.ts         # Next.js config
│
└── README.md                  # This file
```

---

## 🔧 Development

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests (if available)
pytest

# Format code
black .

# Lint code
flake8 .
```

### Frontend Development

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 🚢 Deployment

### Backend Deployment (Heroku)

The backend includes a `Procfile` for Heroku deployment:

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd tariff_auditor_frontend
vercel
```

### Docker Deployment (Coming Soon)

Docker configuration will be added for containerized deployment.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend**: Follow PEP 8 guidelines
- **Frontend**: Follow Airbnb JavaScript/TypeScript style guide
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **CrewAI**: For the multi-agent framework
- **Google Gemini**: For AI capabilities
- **FastAPI**: For the excellent web framework
- **Next.js**: For the React framework
- **Vercel**: For frontend hosting
- **Heroku**: For backend hosting

---

## 📞 Support

For support, email support@tariffguard.ai or open an issue in the GitHub repository.

---

## 🗺️ Roadmap

- [ ] Add user authentication and authorization
- [ ] Implement real-time notifications via WebSockets
- [ ] Add support for multiple languages
- [ ] Integrate with more customs databases
- [ ] Add PDF report generation
- [ ] Implement caching with Redis
- [ ] Add comprehensive test coverage
- [ ] Create Docker containers
- [ ] Add CI/CD pipeline
- [ ] Mobile app development

---
