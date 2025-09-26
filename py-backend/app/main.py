from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import asyncio
from .tools.weather import fetch_weather
from .tools.news import fetch_top_news
from .tools.stocks import fetch_stocks
from .tools.emailer import send_email

app = FastAPI(title="Daily Briefing Agent (Python)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BriefingRequest(BaseModel):
    city: str
    countryCode: Optional[str] = None
    tickers: List[str] = []
    email: Optional[EmailStr] = None


class Weather(BaseModel):
    temperatureC: float
    description: str
    humidity: float


class NewsArticle(BaseModel):
    title: str
    url: str
    source: str


class StockQuote(BaseModel):
    ticker: str
    price: float
    changePercent: float


class BriefingResponse(BaseModel):
    summary: str
    weather: Optional[Weather] = None
    news: Optional[List[NewsArticle]] = None
    stocks: Optional[List[StockQuote]] = None
    emailSent: Optional[bool] = None


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/briefing", response_model=BriefingResponse)
async def create_briefing(body: BriefingRequest):
    try:
        weather_task = asyncio.create_task(fetch_weather(body.city, body.countryCode))
        news_task = asyncio.create_task(fetch_top_news())
        stocks_task = asyncio.create_task(fetch_stocks(body.tickers))
        weather_res, news_res, stocks_res = await asyncio.gather(
            weather_task, news_task, stocks_task, return_exceptions=True
        )

        weather: Optional[Weather] = None
        news: Optional[List[NewsArticle]] = None
        stocks: Optional[List[StockQuote]] = None

        if not isinstance(weather_res, Exception):
            weather = Weather(**weather_res)
        if not isinstance(news_res, Exception):
            news = [NewsArticle(**n) for n in news_res][:10]
        if not isinstance(stocks_res, Exception):
            stocks = [StockQuote(**s) for s in stocks_res]

        summary = build_summary(city=body.city, weather=weather, news=news, stocks=stocks)

        email_sent: Optional[bool] = None
        if body.email:
            try:
                await send_email(body.email, f"Your Daily Briefing for {body.city}", summary)
                email_sent = True
            except Exception:
                email_sent = False

        return BriefingResponse(summary=summary, weather=weather, news=news, stocks=stocks, emailSent=email_sent)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate briefing")


def build_summary(city: str, weather: Optional[Weather], news: Optional[List[NewsArticle]], stocks: Optional[List[StockQuote]]) -> str:
    lines: List[str] = []
    lines.append(f"# Daily Briefing - {city}")
    if weather:
        lines.append(f"Weather: {weather.temperatureC}°C, {weather.description}, humidity {weather.humidity}%")
    else:
        lines.append("Weather: unavailable")
    if stocks:
        lines.append("Stocks:")
        for s in stocks:
            lines.append(f"- {s.ticker}: {s.price} ({s.changePercent}%)")
    else:
        lines.append("Stocks: unavailable")
    if news:
        lines.append("Top News:")
        for a in news[:3]:
            lines.append(f"- {a.title} ({a.source})")
    else:
        lines.append("Top News: unavailable")
    return "\n".join(lines)
