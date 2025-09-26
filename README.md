## Daily Briefing Agent

Fullstack agent with a Python FastAPI backend and a React frontend. It aggregates:
- Weather via Open-Meteo
- Top news via HackerNews Algolia
- Stock quotes via Yahoo Finance
It can optionally email a summary via SendGrid.

### Backend (Python FastAPI)

Location: `apps/py-backend`

- Environment variables:
  - `PORT` (default: 8000)
  - `SENDGRID_API_KEY`
  - `SENDGRID_FROM`

- Run for development:
```
cd apps/py-backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

- API endpoints:
  - `GET /health`
  - `POST /api/briefing`
    - body: `{ city: string, countryCode?: string, tickers: string[], email?: string }`
    - returns: `{ summary, weather?, news?, stocks?, emailSent? }`

### Frontend (React)

Location: `apps/frontend`

- Set environment variable to point to your backend base URL:
  - `VITE_API_BASE=<your-backend-base-url>`

- Run for development:
```
cd apps/frontend
npm install
npm run dev
```

### Docker

- Backend image: `apps/py-backend/Dockerfile`
- Frontend image: `apps/frontend/Dockerfile`

### Deployment (Render)

This repo includes `Render.yaml` to deploy both services:
- Web Service: Python backend at `apps/py-backend` with env vars `PORT`, `SENDGRID_API_KEY`, `SENDGRID_FROM`.
- Web Service: Frontend at `apps/frontend` with env var `VITE_API_BASE` pointing to the backend URL.

Steps (high level):
1. Push to a Git repository.
2. In Render, “New +” → “Blueprint” → select this repo.
3. Set environment variables for both services.
4. Deploy.


