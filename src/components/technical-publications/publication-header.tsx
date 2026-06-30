import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Rss } from 'lucide-react';
import { portfolio } from '@/config/portfolio';
import { cn } from '@/lib/utils';

type PublicationHeaderProps = {
  loading: boolean;
  isLive: boolean;
};

export function PublicationHeader({ loading, isLive }: PublicationHeaderProps) {
  const mediumHref =
    portfolio.socials.find((s) => s.kind === 'medium')?.href ||
    'https://medium.com/@jawadsher';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="max-w-3xl">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.04] px-3 py-1 text-xs font-medium tracking-wide text-primary">
          <Rss className="size-3.5" aria-hidden="true" />
          <span>Medium Feed</span>
          {loading ? (
            <span
              className="ml-1 size-1.5 animate-pulse rounded-full bg-amber-500"
              aria-label="Loading feed status"
            />
          ) : (
            <span
              className={cn(
                'ml-1 size-1.5 rounded-full',
                isLive ? 'bg-emerald-500' : 'bg-muted-foreground/60',
              )}
              aria-label={isLive ? 'Live feed connected' : 'Using cached articles'}
            />
          )}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Publications & Insights
        </h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
          Deep dives into systems architecture, algorithms, binary data logic,
          and low-level computer science engineering.
        </p>
      </div>
      <a
        href={mediumHref}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BookOpen className="size-4" aria-hidden="true" />
        <span className="bg-linear-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
          View Medium
        </span>
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden="true"
        />
      </a>
    </motion.div>
  );
}
