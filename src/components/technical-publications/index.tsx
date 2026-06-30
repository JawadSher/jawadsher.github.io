'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PublicationHeader } from './publication-header';
import { PublicationsSidebar } from './publications-sidebar';
import { PublicationPreview } from './publication-preview';
import { PublicationsSkeleton } from './publications-skeleton';
import { sectionVariants } from './animations';
import { fetchPublications } from '@/lib/fetch-publications';
import type { MediumArticle } from './types';

export function TechnicalPublications() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPublications() {
      try {
        const result = await fetchPublications();
        if (!active) return;

        setArticles(result.articles);
        setIsLive(result.isLive);
        if (result.articles.length > 0) {
          setSelectedGuid(result.articles[0].guid);
        }
      } catch {
        if (active) {
          setArticles([]);
          setIsLive(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPublications();

    return () => {
      active = false;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const norm = query.toLowerCase().trim();
    if (!norm) return articles;

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(norm) ||
        article.description.toLowerCase().includes(norm) ||
        article.categories.some((category) =>
          category.toLowerCase().includes(norm),
        ),
    );
  }, [query, articles]);

  const selectedArticle = useMemo(() => {
    if (filteredArticles.length === 0) return null;
    return (
      filteredArticles.find((article) => article.guid === selectedGuid) ??
      filteredArticles[0]
    );
  }, [filteredArticles, selectedGuid]);

  const handleSelect = useCallback((guid: string) => {
    setSelectedGuid(guid);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return (
    <section id="publications" className="relative overflow-hidden py-4">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <div className="grid-pattern absolute inset-0" />
          <motion.div
            aria-hidden="true"
            className="absolute right-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
            animate={{ opacity: [0.25, 0.45, 0.25], y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <PublicationHeader loading={loading} isLive={isLive} />

        <div className="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/70 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          {loading ? (
            <PublicationsSkeleton />
          ) : (
            <div className="grid min-h-[600px] lg:grid-cols-[minmax(310px,1.05fr)_minmax(0,1.4fr)]">
              <PublicationsSidebar
                articles={filteredArticles}
                selectedArticle={selectedArticle}
                query={query}
                onQueryChange={handleQueryChange}
                onSelect={handleSelect}
                hasArticles={articles.length > 0}
              />
              <PublicationPreview article={selectedArticle} />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
