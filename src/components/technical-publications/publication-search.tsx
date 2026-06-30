import { Search } from 'lucide-react';

type PublicationSearchProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

export function PublicationSearch({
  value,
  onChange,
  id = 'publications-search',
}: PublicationSearchProps) {
  return (
    <div className="relative shrink-0">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles..."
        aria-label="Search publications"
        autoComplete="off"
        className="h-11 w-full rounded-full border border-border/60 bg-background/55 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur transition focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
