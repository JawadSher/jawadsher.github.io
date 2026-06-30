import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MEDIUM_FEED_URL = 'https://medium.com/feed/@jawadsher';
const OUTPUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'data',
  'publications.json',
);

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getTagContent(block, tag) {
  const cdata = block.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`),
  );
  if (cdata) return cdata[1];

  const plain = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`));
  return plain ? plain[1] : '';
}

function getContentEncoded(block) {
  const match = block.match(
    /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/,
  );
  return match ? match[1] : '';
}

function extractThumbnail(htmlText) {
  if (!htmlText) return '';
  const match = htmlText.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

function cleanDescription(htmlText) {
  if (!htmlText) return '';
  let cleaned = htmlText.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, '');
  cleaned = cleaned.replace(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/gi, '');
  cleaned = cleaned.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*>/gi, '');
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (cleaned.length > 240) {
    cleaned = cleaned.slice(0, 240).trim() + '...';
  }
  return cleaned;
}

function parseMediumRss(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.map((match) => {
    const block = match[1];
    const rawContent =
      getContentEncoded(block) || getTagContent(block, 'description');
    const categories = [
      ...block.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g),
    ].map((m) => m[1]);
    const guid = getTagContent(block, 'guid');
    const link = getTagContent(block, 'link').split('?')[0];

    return {
      title: decodeEntities(getTagContent(block, 'title')),
      pubDate: getTagContent(block, 'pubDate'),
      link,
      guid: guid || link,
      description: cleanDescription(rawContent),
      categories,
      thumbnail: extractThumbnail(rawContent),
    };
  });
}

async function main() {
  console.log('Fetching Medium RSS feed...');

  const response = await fetch(MEDIUM_FEED_URL, {
    headers: { 'User-Agent': 'portfolio-build/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Medium RSS fetch failed: ${response.status}`);
  }

  const xml = await response.text();
  const articles = parseMediumRss(xml);

  if (articles.length === 0) {
    throw new Error('No articles parsed from Medium RSS feed');
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: MEDIUM_FEED_URL,
    count: articles.length,
    articles,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));

  console.log(`Wrote ${articles.length} articles to public/data/publications.json`);
  console.log(`Latest: ${articles[0].title}`);
}

main().catch((error) => {
  console.error('Failed to generate publications.json:', error.message);
  process.exit(1);
});
