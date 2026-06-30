'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Rss,
  Search,
  BookOpenCheck,
} from 'lucide-react';
import { portfolio } from '@/config/portfolio';
import { cn } from '@/lib/utils';

type MediumArticle = {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  description: string;
  categories: string[];
  thumbnail: string;
};

type RSSItem = {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  description?: string;
  content?: string;
  categories?: string[];
  thumbnail?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const fallbackArticles: MediumArticle[] = [
  {
    title: 'Selection Sort: The Algorithm That Finds First, Swaps Once',
    pubDate: '2026-06-06 18:43:10',
    link: 'https://medium.com/@jawadsher/selection-sort-the-algorithm-that-finds-first-swaps-once-8dcb735384a2',
    guid: 'https://medium.com/p/8dcb735384a2',
    description:
      'A complete guide to understanding Selection Sort—when to use it, when to avoid it, and why it still matters. Learn about passes, invariants, and how it defer action until it has complete information.',
    categories: ['dsa-problem', 'algorithms', 'sorting-algorithms'],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*qUcbsnKMryD2q_4T6XLzBg.png',
  },
  {
    title:
      'Demystifying Binary Conversions in C++: From Basic Math to Bitwise Magic',
    pubDate: '2026-05-29 10:15:02',
    link: 'https://medium.com/@jawadsher/demystifying-binary-conversions-in-c-from-basic-math-to-bitwise-magic-25201d66b419',
    guid: 'https://medium.com/p/25201d66b419',
    description:
      'Computers only understand on (1) and off (0). This guide breaks down multiple decimal-to-binary and binary-to-decimal conversion techniques in C++, moving from schoolbook modulo to high-performance bitwise math.',
    categories: ['dsa-problem', 'binary-conversion', 'binary', 'leetcode'],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*G6mL3-VIE6PFPjQs_fh8KA.png',
  },
  {
    title: 'The Gap That Breaks Everything (And How Semaphores Fix It)',
    pubDate: '2026-05-05 07:04:22',
    link: 'https://medium.com/@jawadsher/the-gap-that-breaks-everything-and-how-semaphores-fix-it-b42267dfa770',
    guid: 'https://medium.com/p/b42267dfa770',
    description:
      'A close look at race conditions, critical regions, and mutual exclusion. We analyze Ali and Bilal fighting over the printer queue, showing how semaphores remove the gap between test and set.',
    categories: [
      'operating-systems',
      'deadlock',
      'race-condition',
      'semaphore',
    ],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*rek8QtzuauCLFF-F2HzfzQ.png',
  },
  {
    title: 'Operating System Process & Its Administration',
    pubDate: '2026-05-04 05:59:42',
    link: 'https://medium.com/@jawadsher/operating-system-process-its-administration-28fd487bb3ae',
    guid: 'https://medium.com/p/28fd487bb3ae',
    description:
      'Learn how modern operating systems manage multitasking, context switching, process states, program counters, registers, and memory boundaries.',
    categories: ['operating-systems', 'context-switching', 'cpu-process'],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*T6qkCF2zV662EggzuZk4Ow.png',
  },
  {
    title: 'Data Compression (Video & Audio)',
    pubDate: '2026-04-28 06:35:33',
    link: 'https://medium.com/@jawadsher/data-compression-video-audio-cb80ea087445',
    guid: 'https://medium.com/p/cb80ea087445',
    description:
      'How MPEG and MP3 compress massive media files without human-perceptible quality loss. Covers temporal masking, frequency masking, I-frames, and JPEG compression.',
    categories: ['data-compression', 'video-compression', 'audio-compression'],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*80w1-qPtvLqZg6EGxTmE4A.png',
  },
  {
    title: 'Data Compression (Image)',
    pubDate: '2026-04-27 07:11:18',
    link: 'https://medium.com/@jawadsher/data-compression-image-0d3dd1f168b4',
    guid: 'https://medium.com/p/0d3dd1f168b4',
    description:
      'Exploring image compression standards: GIF palettes, LZW dictionary encoding, JPEG luminance-chrominance channels, and uncompressed TIFF layouts.',
    categories: [
      'data-compression',
      'image-compression',
      'reduce-image-file-size',
    ],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*4Vo4g2vOA54NRmva2Ee1nQ.png',
  },
  {
    title: 'Data Compression (Generic Techniques)',
    pubDate: '2026-04-26 05:47:27',
    link: 'https://medium.com/@jawadsher/data-compression-generic-techniques-50cfb1509725',
    guid: 'https://medium.com/p/50cfb1509725',
    description:
      'A study of lossless vs. lossy compression, reviewing fundamental encoding strategies like Run-Length Encoding, Huffman coding, and LZW adaptive dictionaries.',
    categories: ['data-compression', 'compression', 'software-engineering'],
    thumbnail:
      'https://cdn-images-1.medium.com/max/1024/1*tf39tG2AMRohIQ2D89bbFg.png',
  },
];

// Extract first image source from HTML string if thumbnail field is missing
function extractThumbnail(htmlText: string): string {
  if (!htmlText) return '';
  const match = htmlText.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

// Clean HTML tags and trim description snippet
function cleanDescription(htmlText: string): string {
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

// Format RSS dates into "Month Day, Year"
function formatDate(dateStr: string): string {
  try {
    const cleanDateStr = dateStr.replace(/-/g, '/');
    const date = new Date(cleanDateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function TechnicalPublications() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchPublications() {
      try {
        const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jawadsher`;
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error('Failed to fetch feed');

        const data = await res.json();
        if (
          data.status === 'ok' &&
          data.items &&
          data.items.length > 0 &&
          active
        ) {
          const parsed: MediumArticle[] = data.items.map((item: RSSItem) => {
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
              thumbnail: thumbnail,
            };
          });
          setArticles(parsed);
          setIsLive(true);
          if (parsed.length > 0) {
            setSelectedGuid(parsed[0].guid);
          }
        } else {
          throw new Error('Invalid feed format');
        }
      } catch {
        if (active) {
          setArticles(fallbackArticles);
          setIsLive(false);
          if (fallbackArticles.length > 0) {
            setSelectedGuid(fallbackArticles[0].guid);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchPublications();

    return () => {
      active = false;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const norm = query.toLowerCase().trim();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(norm) ||
        a.description.toLowerCase().includes(norm) ||
        a.categories.some((c) => c.toLowerCase().includes(norm)),
    );
  }, [query, articles]);

  const selectedArticle = useMemo(() => {
    return (
      filteredArticles.find((a) => a.guid === selectedGuid) ||
      filteredArticles[0] ||
      null
    );
  }, [filteredArticles, selectedGuid]);

  return (
    <section id="publications" className="relative overflow-hidden py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Background Ambience */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <div className="grid-pattern absolute inset-0" />
          <motion.div
            aria-hidden="true"
            className="absolute right-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
            animate={{ opacity: [0.25, 0.45, 0.25], y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.04] px-3 py-1 text-xs text-primary font-medium tracking-wide mb-2">
              <Rss className="size-3.5" />
              <span>Medium Feed</span>
              {loading ? (
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse ml-1" />
              ) : (
                <span
                  className={cn(
                    'size-1.5 rounded-full ml-1',
                    isLive ? 'bg-emerald-500' : 'bg-muted-foreground/60',
                  )}
                />
              )}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Publications & Insights
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
              Deep dives into systems architecture, algorithms, binary data
              logic, and low-level computer science engineering.
            </p>
          </div>
          <a
            href={
              portfolio.socials.find((s) => s.kind === 'medium')?.href ||
              'https://medium.com/@jawadsher'
            }
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BookOpen className="size-4" />
            <span className="bg-linear-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
              View Medium
            </span>
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </motion.div>

        {/* Workspace Container */}
        <motion.div
          variants={columnVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/70 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          {loading ? (
            <div className="flex h-[560px] items-center justify-center gap-3 p-6 text-sm text-muted-foreground">
              <span className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading publications workspace...
            </div>
          ) : (
            <div className="grid min-h-[600px] lg:grid-cols-[minmax(310px,1.05fr)_minmax(0,1.4fr)]">
              {/* Left Column: Scrollable List & Search */}
              <aside className="flex flex-col border-b border-border/50 bg-background/35 p-4 lg:border-b-0 lg:border-r">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="h-11 w-full rounded-full border border-border/60 bg-background/55 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur transition focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
                  />
                </div>

                {/* Scrollable list area */}
                <div
                  className="mt-4 flex flex-1 flex-row gap-3 overflow-x-auto pb-2 md:flex-row h-full lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1"
                  role="listbox"
                  aria-label="Publications list"
                >
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => {
                      const isActive = article.guid === selectedArticle?.guid;

                      return (
                        <div
                          key={article.guid}
                          className="min-w-[280px] lg:min-w-0"
                        >
                          <motion.button
                            variants={itemVariants}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => setSelectedGuid(article.guid)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className={cn(
                              'group relative flex w-full items-start gap-3 border-b border-border/30 px-2.5 py-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
                              isActive
                                ? 'bg-primary/8 text-foreground'
                                : 'text-muted-foreground hover:bg-background/45 hover:text-foreground',
                            )}
                          >
                            <span
                              className={cn(
                                'absolute left-0 top-2 bottom-2 w-px rounded-full transition-all',
                                isActive
                                  ? 'bg-primary shadow-[0_0_22px_rgba(255,255,255,0.34)]'
                                  : 'bg-transparent group-hover:bg-primary/30',
                              )}
                            />

                            {/* Cover Thumbnail on Left Pane List */}
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/30">
                              {article.thumbnail ? (
                                <img
                                  src={article.thumbnail}
                                  alt=""
                                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted/40">
                                  <BookOpen className="size-4 opacity-50" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <span
                                className={cn(
                                  'block line-clamp-2 font-serif font-medium leading-snug transition-all',
                                  isActive
                                    ? 'text-[0.92rem] text-foreground'
                                    : 'text-[0.85rem]',
                                )}
                              >
                                {article.title}
                              </span>
                              <span className="flex items-center justify-between text-[10px] text-muted-foreground/80">
                                <span className="inline-flex items-center gap-1 font-mono">
                                  <Calendar className="size-2.5" />
                                  {formatDate(article.pubDate).split(',')[0]}
                                </span>
                                {article.categories &&
                                  article.categories.length > 0 && (
                                    <span className="max-w-[100px] truncate uppercase font-semibold text-[8px] tracking-wide text-primary/70">
                                      {article.categories[0].replace(/-/g, ' ')}
                                    </span>
                                  )}
                              </span>
                            </div>
                          </motion.button>

                          {/* Mobile Details Drawer Expansion */}
                          {isActive && selectedArticle ? (
                            <div className="block lg:hidden border-b border-border/30 bg-background/20 px-3 py-4">
                              <MobileArticleDrawer article={selectedArticle} />
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-border/50 bg-background/45 p-4 text-sm text-muted-foreground">
                      No articles match your search.
                    </div>
                  )}
                </div>
              </aside>

              {/* Right Column: Full Details Preview Panel */}
              <main className="hidden flex-col justify-between bg-background/10 p-6 lg:flex">
                <AnimatePresence mode="wait">
                  {selectedArticle ? (
                    <motion.div
                      key={selectedArticle.guid}
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="flex flex-1 flex-col"
                    >
                      {/* Header Image Cover */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-md">
                        {selectedArticle.thumbnail ? (
                          <img
                            src={selectedArticle.thumbnail}
                            alt={selectedArticle.title}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted/30">
                            <BookOpenCheck className="size-12 text-muted-foreground/30 stroke-[1]" />
                          </div>
                        )}
                      </div>

                      {/* Metadata line */}
                      <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 opacity-75" />
                          {formatDate(selectedArticle.pubDate)}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-primary/80 uppercase tracking-wide">
                          {selectedArticle.categories[0]?.replace(/-/g, ' ') ||
                            'Technical Publication'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
                        {selectedArticle.title}
                      </h3>

                      {/* Body snippet */}
                      <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted-foreground/90">
                        {selectedArticle.description}
                      </p>

                      {/* Tags row */}
                      {selectedArticle.categories &&
                        selectedArticle.categories.length > 1 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedArticle.categories
                              .slice(1, 5)
                              .map((category) => (
                                <span
                                  key={category}
                                  className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                                >
                                  #{category.toLowerCase()}
                                </span>
                              ))}
                          </div>
                        )}

                      {/* Action button */}
                      <div className="mt-auto pt-6 flex justify-end">
                        <motion.a
                          href={selectedArticle.link}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/80 focus-visible:outline focus-visible:outline-2 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="dark:text-black text-white">
                            Continue Reading on Medium
                          </span>
                          <ArrowUpRight className=" text-white size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-black" />
                        </motion.a>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Select an article to view details
                    </div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

// Compact details layout for mobile inline expansion (inside the list drawer)
function MobileArticleDrawer({ article }: { article: MediumArticle }) {
  return (
    <div className="space-y-4 pt-1 animate-fadeIn">
      {article.thumbnail ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-muted/20">
          <img
            src={article.thumbnail}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="font-sans text-xs font-light leading-relaxed text-muted-foreground">
          {article.description}
        </p>

        {article.categories && article.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.categories.map((c) => (
              <span
                key={c}
                className="text-[9px] font-mono text-muted-foreground/80"
              >
                #{c}
              </span>
            ))}
          </div>
        )}

        <div className="pt-3">
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-black bg-black py-2.5 text-xs font-medium text-white dark:border-white dark:bg-white dark:text-black"
          >
            <span>Read on Medium</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
