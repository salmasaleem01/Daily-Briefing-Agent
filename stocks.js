"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStocks = fetchStocks;
const axios_1 = __importDefault(require("axios"));
async function fetchStocks(tickers) {
    if (!tickers.length)
        return [];
    const symbols = tickers.join(',');
    const url = 'https://query1.finance.yahoo.com/v7/finance/quote';
    const res = await axios_1.default.get(url, { params: { symbols } });
    const results = res.data?.quoteResponse?.result ?? [];
    return results.map((r) => ({
        ticker: r.symbol,
        price: Number(r.regularMarketPrice ?? 0),
        changePercent: Number(r.regularMarketChangePercent ?? 0),
    }));
}
//# sourceMappingURL=stocks.js.map