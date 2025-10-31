import React from 'react';
import { ExternalLink } from 'lucide-react';

type LegacyNews = {
  id: string;
  title: string;
  source: string;
  time: string;
  tickers: string[];
};

type Article = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
};

export function NewsCard(props: { news?: LegacyNews; article?: Article }) {
  const article: Article | null = props.article
    ? props.article
    : props.news
      ? {
          id: props.news.id,
          title: props.news.title,
          summary: props.news.title,
          source: props.news.source,
          url: '#',
          publishedAt: new Date().toISOString(),
        }
      : null;

  if (!article) return null;

  const timeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const CardInner = (
    <div className="block bg-white rounded-xl p-4 border hover:shadow-lg transition-all group">
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover rounded-lg mb-3" />
      )}
      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
        {article.title}
        <ExternalLink className="inline w-4 h-4 ml-1 text-gray-400" />
      </h3>
      {article.summary && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{article.source}</span>
        <span>•</span>
        <span>{timeAgo(article.publishedAt)}</span>
      </div>
    </div>
  );

  return article.url && article.url !== '#'
    ? (
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {CardInner}
        </a>
      )
    : (
        CardInner
      );
}
