import { memo, useCallback, useRef, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Inbox } from 'lucide-react';
import { PublicationSearch } from './publication-search';
import {
  MobileArticleDrawer,
  PublicationCard,
} from './publication-card';
import { listVariants } from './animations';
import type { MediumArticle } from './types';

type PublicationsSidebarProps = {
  articles: MediumArticle[];
  selectedArticle: MediumArticle | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (guid: string) => void;
  hasArticles: boolean;
};

export const PublicationsSidebar = memo(function PublicationsSidebar({
  articles,
  selectedArticle,
  query,
  onQueryChange,
  onSelect,
  hasArticles,
}: PublicationsSidebarProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (articles.length === 0) return;

      const currentIndex = articles.findIndex(
        (article) => article.guid === selectedArticle?.guid,
      );
      const startIndex = currentIndex >= 0 ? currentIndex : 0;

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = (startIndex + 1) % articles.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = (startIndex - 1 + articles.length) % articles.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = articles.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const nextArticle = articles[nextIndex];
      onSelect(nextArticle.guid);
      listRef.current
        ?.querySelector<HTMLElement>(`#publication-${nextArticle.guid} button`)
        ?.focus();
    },
    [articles, onSelect, selectedArticle?.guid],
  );

  return (
    <aside className="flex min-h-0 flex-col border-b border-border/50 bg-background/35 p-4 lg:border-b-0 lg:border-r">
      <PublicationSearch value={query} onChange={onQueryChange} />

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {!hasArticles ? (
          <EmptyPublicationsState />
        ) : articles.length === 0 ? (
          <NoSearchResultsState query={query} />
        ) : (
          <motion.div
            ref={listRef}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            onKeyDown={handleKeyDown}
            className="flex min-h-0 flex-1 flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1"
            role="listbox"
            aria-label="Publications list"
            tabIndex={0}
            aria-activedescendant={
              selectedArticle ? `publication-${selectedArticle.guid}` : undefined
            }
          >
            {articles.map((article) => {
              const isActive = article.guid === selectedArticle?.guid;

              return (
                <div
                  key={article.guid}
                  id={`publication-${article.guid}`}
                  role="presentation"
                >
                  <PublicationCard
                    article={article}
                    isActive={isActive}
                    onSelect={onSelect}
                  />
                  {isActive && selectedArticle ? (
                    <MobileArticleDrawer article={selectedArticle} />
                  ) : null}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </aside>
  );
});

function EmptyPublicationsState() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-background/45 px-6 py-12 text-center"
      role="status"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/30">
        <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="font-medium text-foreground">No publications yet</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Articles from the Medium feed will appear here once they are available.
      </p>
    </div>
  );
}

function NoSearchResultsState({ query }: { query: string }) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border/50 bg-background/45 px-6 py-10 text-center"
      role="status"
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted/40">
        <FileSearch className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="font-medium text-foreground">No publications found</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        No results for &ldquo;{query}&rdquo;. Try a different title, topic, or
        category.
      </p>
    </div>
  );
}
