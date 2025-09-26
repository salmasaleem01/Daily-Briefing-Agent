export type StockQuote = {
    ticker: string;
    price: number;
    changePercent: number;
};
export declare function fetchStocks(tickers: string[]): Promise<StockQuote[]>;
//# sourceMappingURL=stocks.d.ts.map