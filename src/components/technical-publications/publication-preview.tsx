import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, BookOpen, BookOpenCheck, Calendar } from 'lucide-react';
import { previewVariants } from './animations';
import { formatDate } from './utils';
import type { MediumArticle } from './types';

type PublicationPreviewProps = {
  article: MediumArticle | null;
};

export const PublicationPreview = memo(function PublicationPreview({
  article,
}: PublicationPreviewProps) {
  return (
    <main
      className="hidden min-h-0 flex-col bg-background/10 p-6 lg:flex"
      aria-live="polite"
      aria-label="Selected publication preview"
    >
      <AnimatePresence mode="wait">
        {article ? (
          <motion.article
            key={article.guid}
            variants={previewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-md">
              {article.thumbnail ? (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/30">
                  <BookOpenCheck
                    className="size-12 stroke-[1] text-muted-foreground/30"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 opacity-75" aria-hidden="true" />
                <time dateTime={article.pubDate}>
                  {formatDate(article.pubDate)}
                </time>
              </span>
              <span aria-hidden="true">•</span>
              <span className="font-semibold uppercase tracking-wide text-primary/80">
                {article.categories[0]?.replace(/-/g, ' ') ||
                  'Technical Publication'}
              </span>
            </div>

            <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
              {article.title}
            </h3>

            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted-foreground/90">
              {article.description}
            </p>

            {article.categories.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {article.categories.slice(1, 5).map((category) => (
                  <span
                    key={category}
                    className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    #{category.toLowerCase()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex justify-end pt-6">
              <motion.a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-black/80 focus-visible:outline focus-visible:outline-2 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="dark:text-black text-white">Continue Reading on Medium</span>
                <ArrowUpRight
                  className="dark:text-black text-white size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </motion.a>
            </div>
          </motion.article>
        ) : (
          <motion.div
            key="empty-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/30">
              <BookOpen className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select an article to view details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
});
