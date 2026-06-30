import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { listItemVariants } from './animations';
import { formatDate } from './utils';
import type { MediumArticle } from './types';

type PublicationCardProps = {
  article: MediumArticle;
  isActive: boolean;
  onSelect: (guid: string) => void;
};

export const PublicationCard = memo(function PublicationCard({
  article,
  isActive,
  onSelect,
}: PublicationCardProps) {
  return (
    <motion.div variants={listItemVariants} className="min-w-[280px] lg:min-w-0">
      <motion.button
        type="button"
        role="option"
        aria-selected={isActive}
        onClick={() => onSelect(article.guid)}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={cn(
          'group relative flex w-full items-start gap-3 border-b border-border/30 px-2.5 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-primary/8 text-foreground'
            : 'text-muted-foreground hover:bg-background/45 hover:text-foreground',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-2 left-0 top-2 w-px rounded-full transition-all',
            isActive
              ? 'bg-primary shadow-[0_0_22px_rgba(255,255,255,0.34)]'
              : 'bg-transparent group-hover:bg-primary/30',
          )}
        />

        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/30">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt=""
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/40">
              <BookOpen className="size-4 opacity-50" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <span
            className={cn(
              'block line-clamp-2 font-serif font-medium leading-snug transition-all',
              isActive ? 'text-[0.92rem] text-foreground' : 'text-[0.85rem]',
            )}
          >
            {article.title}
          </span>
          <span className="flex items-center justify-between text-[10px] text-muted-foreground/80">
            <span className="inline-flex items-center gap-1 font-mono">
              <Calendar className="size-2.5" aria-hidden="true" />
              {formatDate(article.pubDate).split(',')[0]}
            </span>
            {article.categories.length > 0 && (
              <span className="max-w-[100px] truncate text-[8px] font-semibold uppercase tracking-wide text-primary/70">
                {article.categories[0].replace(/-/g, ' ')}
              </span>
            )}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
});

type MobileArticleDrawerProps = {
  article: MediumArticle;
};

export function MobileArticleDrawer({ article }: MobileArticleDrawerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden border-b border-border/30 bg-background/20 px-3 py-4 lg:hidden"
    >
      <div className="space-y-4 pt-1">
        {article.thumbnail ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-muted/20">
            <img
              src={article.thumbnail}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="font-sans text-xs font-light leading-relaxed text-muted-foreground">
            {article.description}
          </p>

          {article.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.categories.map((category) => (
                <span
                  key={category}
                  className="text-[9px] font-mono text-muted-foreground/80"
                >
                  #{category}
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
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
