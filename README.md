# 🛡️ Security Scanner - Web Vulnerability Analysis Platform

A full-stack microservices application for analyzing website security vulnerabilities. The platform allows users to submit URLs for security scanning and receive detailed reports on potential vulnerabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security Checks](#security-checks)
- [License](#license)

## 🔍 Overview

This platform provides automated security scanning for websites, checking for common vulnerabilities and security misconfigurations. Users can register, authenticate, submit URLs for analysis, and view detailed security reports through an intuitive dashboard.

## 🏗️ Architecture

The application follows a microservices architecture with three main services communicating via NATS messaging:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│    Securite     │
│   (React/Vite)  │     │   (Express.js)  │     │    (Python)     │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 ▼                       │
                        ┌─────────────────┐              │
                        │                 │              │
                        │   MongoDB       │◀─────────────┘
                        │   Atlas         │
                        │                 │
                        └─────────────────┘
                                 ▲
                                 │
                        ┌─────────────────┐
                        │                 │
                        │   NATS Server   │
                        │   (Messaging)   │
                        │                 │
                        └─────────────────┘
```

## ✨ Features

- **User Authentication**: Secure login/signup with JWT tokens and session management
- **URL Submission**: Submit websites for security analysis
- **Automated Security Scanning**: Comprehensive vulnerability detection
- **Security Reports**: Detailed reports with security scores and recommendations
- **Dashboard**: User-friendly interface to manage and view scan results
- **Real-time Processing**: Asynchronous scan processing via NATS messaging

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Motion** - Animations
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime
- **Express 5** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **NATS** - Message broker client
- **cookie-parser** - Cookie handling

### Security Service (Securite)

- **Python 3.11** - Runtime
- **Requests** - HTTP library
- **NATS-py** - NATS client
- **PyMongo** - MongoDB driver
- **SSL/TLS** - Certificate verification

### Infrastructure

- **Docker** - Containerization
- **NATS** - Message broker
- **MongoDB Atlas** - Cloud database
- **Nginx** - Frontend reverse proxy

## 📁 Project Structure

```
miniproject/
├── docker-compose.yaml      # Docker orchestration
├── README.md                # This file
│
├── backend/                 # Node.js API server
│   ├── Dockerfile
│   ├── index.js             # Entry point
│   ├── Route.js             # Route definitions
│   ├── package.json
│   ├── auth/
│   │   └── LoginAuth.js     # JWT middleware
│   ├── controller/
│   │   ├── AnalyseController.js
│   │   ├── LoginController.js
│   │   ├── LogoutController.js
│   │   └── SigningController.js
│   ├── models/
│   │   ├── Analyse.js       # Analysis schema
│   │   └── User.js          # User schema
│   ├── routers/
│   │   ├── analyse.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   └── signin.js
│   └── Singletons/
│       └── natSingleton.js  # NATS connection
│
├── frontend/                # React application
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx          # Main app component
│       ├── main.tsx         # Entry point
│       ├── API/             # API clients
│       ├── components/      # UI components
│       ├── hooks/           # Custom hooks
│       ├── lib/             # Utilities
│       ├── Pages/           # Route pages
│       └── store/           # Zustand store
│
└── securite/                # Python security scanner
    ├── Dockerfile
    ├── app.py               # Security scanner
    ├── requirements.txt
    └── myenv/               # Python virtual environment
```

## 📋 Prerequisites

- **Docker** & **Docker Compose** (for containerized deployment)
- **Node.js 18+** (for local development)
- **Python 3.11+** (for local development)
- **Bun** (optional, used in Dockerfiles)
- **MongoDB Atlas** account or local MongoDB instance
- **NATS Server**

## 🚀 Installation

### Clone the Repository

```bash
git clone <repository-url>
cd miniproject
```

### Using Docker (Recommended)

```bash
# Build and run all services
docker-compose up --build
```

### Local Development

#### Backend

```bash
cd backend
npm install
# Create .env file (see Configuration section)
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Security Service

```bash
cd securite
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
port=3000

# MongoDB Connection
url=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Frontend URL (for CORS)
fronturl=http://localhost:5173

# JWT Secret
JWT_SECRET=your-secret-key

# NATS Server
NATS_URL=nats://localhost:4222
```

### Security Service Configuration

The security service uses these configurations in `app.py`:

```python
NATS_SERVER = "nats://localhost:4222"
MONGO_URI = "mongodb+srv://..."
MONGO_DB = "db"
MONGO_COLLECTION = "analyses"
```

## 🏃 Running the Application

### Development Mode

1. **Start NATS Server**:

   ```bash
   docker run -p 4222:4222 nats:latest
   ```

2. **Start Backend**:

   ```bash
   cd backend && npm run dev
   ```

3. **Start Frontend**:

   ```bash
   cd frontend && npm run dev
   ```

4. **Start Security Service**:
   ```bash
   cd securite && python app.py
   ```

### Production Mode (Docker)

```bash
docker-compose up -d
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | `/api/signin` | Register new user |
| POST   | `/api/login`  | User login        |
| POST   | `/api/logout` | User logout       |

### Analysis

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | `/api/analyse` | Submit URL for analysis |
| GET    | `/api/analyse` | Get user's analyses     |

## 🔐 Security Checks

The security scanner performs the following checks:

### 1. HTTP Security Headers

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Content-Security-Policy` (CSP)
- `X-XSS-Protection`
- `Referrer-Policy`

### 2. SSL/TLS Certificate

- Certificate validity
- Expiration date
- Certificate chain verification

### 3. XSS Vulnerability Testing

- Reflected XSS detection
- Input validation checks

### 4. SQL Injection Testing

- Common SQL injection patterns
- Error-based detection

### 5. Security Score

- Calculated based on vulnerabilities found
- Weighted scoring system

## 📊 Security Report Output

Each scan generates a report containing:

```json
{
  "url": "https://example.com",
  "scan_date": "2026-01-08T12:00:00",
  "vulnerabilities": [...],
  "security_headers": {...},
  "ssl_info": {...},
  "recommendations": [...],
  "security_score": 85
}
```

## 🐳 Docker Services

| Service  | Port | Description                 |
| -------- | ---- | --------------------------- |
| Frontend | 80   | React app (Nginx)           |
| Backend  | 3000 | Express API                 |
| Securite | -    | Security scanner (internal) |
| NATS     | 4222 | Message broker              |

## 📄 License

ISC

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the repository.
