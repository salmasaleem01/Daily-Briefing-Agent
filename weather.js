"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWeather = fetchWeather;
const axios_1 = __importDefault(require("axios"));
async function fetchWeather(city, countryCode) {
    const q = countryCode ? `${city}, ${countryCode}` : city;
    const geo = await axios_1.default.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: q, count: 1 },
    });
    const loc = geo.data?.results?.[0];
    if (!loc)
        throw new Error('Location not found');
    const { latitude, longitude } = loc;
    const forecast = await axios_1.default.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude,
            longitude,
            current: 'temperature_2m,relative_humidity_2m,weather_code',
        },
    });
    const current = forecast.data?.current;
    const code = current?.weather_code;
    return {
        temperatureC: Number(current?.temperature_2m ?? 0),
        humidity: Number(current?.relative_humidity_2m ?? 0),
        description: describeWeatherCode(code),
    };
}
function describeWeatherCode(code) {
    if (code === undefined)
        return 'Unknown';
    // Simple mapping
    const map = {
        0: 'Clear',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        61: 'Rain',
        71: 'Snow',
        80: 'Rain showers',
        95: 'Thunderstorm',
    };
    return map[code] ?? 'Mixed conditions';
}
//# sourceMappingURL=weather.js.map