import { fetchWeather } from '../tools/weather';
import { fetchTopNews } from '../tools/news';
import { fetchStocks } from '../tools/stocks';
export type BriefingInput = {
    city: string;
    countryCode?: string | undefined;
    tickers: string[];
    email?: string | undefined;
};
export type BriefingResult = {
    weather?: Awaited<ReturnType<typeof fetchWeather>>;
    news?: Awaited<ReturnType<typeof fetchTopNews>>;
    stocks?: Awaited<ReturnType<typeof fetchStocks>>;
    emailSent?: boolean;
    summary: string;
};
export declare function runBriefing(input: BriefingInput): Promise<BriefingResult>;
//# sourceMappingURL=runBriefing.d.ts.map