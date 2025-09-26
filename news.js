"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTopNews = fetchTopNews;
const axios_1 = __importDefault(require("axios"));
// Using HackerNews Algolia front page (no API key required)
async function fetchTopNews() {
    const res = await axios_1.default.get('https://hn.algolia.com/api/v1/search', {
        params: { tags: 'front_page' },
    });
    const hits = Array.isArray(res.data?.hits) ? res.data.hits : [];
    return hits.slice(0, 10).map((h) => ({
        title: h.title ?? h.story_title ?? 'Untitled',
        url: h.url ?? h.story_url ?? '#',
        source: 'HackerNews',
    }));
}
//# sourceMappingURL=news.js.map