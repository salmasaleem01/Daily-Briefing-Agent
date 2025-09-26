"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBriefing = runBriefing;
const weather_1 = require("../tools/weather");
const news_1 = require("../tools/news");
const stocks_1 = require("../tools/stocks");
const email_1 = require("../tools/email");
async function runBriefing(input) {
    const { city, countryCode, tickers, email } = input;
    const tasks = await Promise.allSettled([
        (0, weather_1.fetchWeather)(city, countryCode),
        (0, news_1.fetchTopNews)(),
        (0, stocks_1.fetchStocks)(tickers),
    ]);
    const [weatherRes, newsRes, stocksRes] = tasks;
    const weather = weatherRes.status === 'fulfilled' ? weatherRes.value : undefined;
    const news = newsRes.status === 'fulfilled' ? newsRes.value : undefined;
    const stocks = stocksRes.status === 'fulfilled' ? stocksRes.value : undefined;
    const summary = buildSummary({
        city,
        ...(weather ? { weather } : {}),
        ...(news ? { news } : {}),
        ...(stocks ? { stocks } : {}),
    });
    let emailSent;
    if (email) {
        try {
            await (0, email_1.sendEmail)(email, `Your Daily Briefing for ${city}`, summary);
            emailSent = true;
        }
        catch (_e) {
            emailSent = false;
        }
    }
    const result = { summary };
    if (weather)
        result.weather = weather;
    if (news)
        result.news = news;
    if (stocks)
        result.stocks = stocks;
    if (email !== undefined)
        result.emailSent = Boolean(emailSent);
    return result;
}
function buildSummary(params) {
    const lines = [];
    lines.push(`# Daily Briefing - ${params.city}`);
    if (params.weather) {
        const w = params.weather;
        lines.push(`Weather: ${w.temperatureC}°C, ${w.description}, humidity ${w.humidity}%`);
    }
    else {
        lines.push('Weather: unavailable');
    }
    if (params.stocks) {
        const s = params.stocks;
        lines.push('Stocks:');
        for (const item of s) {
            lines.push(`- ${item.ticker}: ${item.price} (${item.changePercent}%)`);
        }
    }
    else {
        lines.push('Stocks: unavailable');
    }
    if (params.news) {
        const n = params.news.slice(0, 3);
        lines.push('Top News:');
        for (const a of n) {
            lines.push(`- ${a.title} (${a.source})`);
        }
    }
    else {
        lines.push('Top News: unavailable');
    }
    return lines.join('\n');
}
//# sourceMappingURL=runBriefing.js.map