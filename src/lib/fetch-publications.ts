import { fallbackArticles } from '@/components/technical-publications/fallback-articles';
import {
  cleanDescription,
  extractThumbnail,
} from '@/components/technical-publications/utils';
import type { MediumArticle, RSSItem } from '@/components/technical-publications/types';

type PublicationsPayload = {
  generatedAt: string;
  source: string;
  count: number;
  articles: MediumArticle[];
};

const MEDIUM_FEED_URL = 'https://medium.com/feed/@jawadsher';

function mapRss2JsonItems(items: RSSItem[]): MediumArticle[] {
  return items.map((item) => {
    const rawDescription = item.description || '';
    const thumbnail =
      item.thumbnail ||
      extractThumbnail(item.content || rawDescription) ||
      '';

    return {
      title: item.title,
      pubDate: item.pubDate,
      link: item.link,
      guid: item.guid,
      description: cleanDescription(rawDescription),
      categories: item.categories || [],
      thumbnail,
    };
  });
}

function parsePubDate(dateStr: string): number {
  const parsed = Date.parse(dateStr.replace(/-/g, '/'));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortByNewest(articles: MediumArticle[]): MediumArticle[] {
  return [...articles].sort(
    (a, b) => parsePubDate(b.pubDate) - parsePubDate(a.pubDate),
  );
}

function articleRichness(article: MediumArticle): number {
  return (
    (article.description ? 2 : 0) +
    (article.thumbnail ? 1 : 0) +
    (article.categories.length > 0 ? 1 : 0)
  );
}

function mergeArticles(...sources: MediumArticle[][]): MediumArticle[] {
  const byGuid = new Map<string, MediumArticle>();

  for (const source of sources) {
    for (const article of source) {
      if (!article.guid) continue;

      const existing = byGuid.get(article.guid);
      if (!existing || articleRichness(article) >= articleRichness(existing)) {
        byGuid.set(article.guid, article);
      }
    }
  }

  return sortByNewest([...byGuid.values()]);
}

async function fetchStaticPublications(): Promise<MediumArticle[] | null> {
  try {
    const response = await fetch(`/data/publications.json?t=${Date.now()}`, {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = (await response.json()) as PublicationsPayload;
    if (!data.articles?.length) return null;

    return data.articles;
  } catch {
    return null;
  }
}

async function fetchRss2JsonPublications(): Promise<MediumArticle[] | null> {
  try {
    const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_FEED_URL)}&t=${Date.now()}`;
    const response = await fetch(feedUrl, { cache: 'no-store' });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 'ok' || !data.items?.length) return null;

    return mapRss2JsonItems(data.items);
  } catch {
    return null;
  }
}

export type PublicationsFetchResult = {
  articles: MediumArticle[];
  isLive: boolean;
  source: 'medium-rss' | 'rss2json' | 'fallback';
};

export async function fetchPublications(): Promise<PublicationsFetchResult> {
  const [staticArticles, rss2JsonArticles] = await Promise.all([
    fetchStaticPublications(),
    fetchRss2JsonPublications(),
  ]);

  const merged = mergeArticles(
    staticArticles ?? [],
    rss2JsonArticles ?? [],
  );

  if (merged.length > 0) {
    const usedStatic = Boolean(staticArticles?.length);
    const usedRss2Json = Boolean(rss2JsonArticles?.length);

    return {
      articles: merged,
      isLive: usedStatic || usedRss2Json,
      source:
        usedStatic && (!usedRss2Json || merged.length > (rss2JsonArticles?.length ?? 0))
          ? 'medium-rss'
          : 'rss2json',
    };
  }

  return {
    articles: fallbackArticles,
    isLive: false,
    source: 'fallback',
  };
}
