export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
}

export async function fetchFinancialNews(): Promise<NewsArticle[]> {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) {
    console.error('NEWS_API_KEY not configured');
    return [];
  }
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&country=us&pageSize=20&apiKey=${NEWS_API_KEY}`
    );
    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status}`);
      return [];
    }
    const data = await response.json() as any;
    return (data.articles || []).map((article: any, index: number) => ({
      id: `news-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description || article.title,
      source: article.source?.name || 'Unknown',
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

