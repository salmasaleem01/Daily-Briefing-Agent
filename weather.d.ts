export type WeatherResult = {
    temperatureC: number;
    description: string;
    humidity: number;
};
export declare function fetchWeather(city: string, countryCode?: string): Promise<WeatherResult>;
//# sourceMappingURL=weather.d.ts.map