'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  FolderGit2,
  GitFork,
  Layers3,
  Loader2,
  Search,
  ShieldCheck,
  Star,
  Workflow,
  Zap,
} from 'lucide-react';
import { EducationCertifications } from '@/components/education-certifications';
import { TechnicalPublications } from '@/components/technical-publications';
import { Services } from '@/components/services';
import { portfolio } from '@/config/portfolio';
import { cn } from '@/lib/utils';

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  license?: {
    spdx_id: string | null;
  } | null;
  created_at?: string;
  updated_at: string;
};

type RepositoryCategory =
  | 'All'
  | 'Full Stack'
  | 'Backend'
  | 'Frontend'
  | 'Security'
  | 'Algorithms'
  | 'Open Source'
  | 'AI';

type RepoMetric = {
  label: string;
  value: number;
};

const radarDomains = [
  { label: 'Frontend', value: 100 },
  { label: 'Backend', value: 100 },
  { label: 'Database', value: 100 },
  { label: 'Cloud', value: 100 },
  { label: 'Security', value: 100 },
  { label: 'DevOps', value: 100 },
];

const engineeringMetrics = [
  { label: 'Frontend Engineering', value: 100 },
  { label: 'Backend Architecture', value: 100 },
  { label: 'Cloud Infrastructure', value: 100 },
  { label: 'Database Design', value: 100 },
  { label: 'Security', value: 100 },
  { label: 'DevOps & CI/CD', value: 100 },
];

const techGroups = [
  {
    title: 'Frontend',
    items: ['TypeScript', 'React', 'Next.js', 'React Native', 'Tailwind', 'Framer Motion', 'TanStack Query', 'Redux Toolkit', 'Zustand', 'Apollo'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'NestJS', 'GraphQL', 'REST APIs', 'Supabase', 'Appwrite'],
  },
  {
    title: 'Database',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
  },
  {
    title: 'Cloud & DevOps',
    items: ['AWS', 'Docker', 'Kafka', 'Cloudflare', 'GitHub Actions', 'Vercel', 'Inngest'],
  },
  {
    title: 'Authentication',
    items: ['JWT', 'OAuth', 'NextAuth', 'Clerk', 'Arcjet'],
  },
];

const architectureSteps = [
  { title: 'Client', subtitle: 'Responsive interfaces', icon: Layers3 },
  { title: 'Next.js', subtitle: 'App shell & routing', icon: Code2 },
  { title: 'GraphQL', subtitle: 'Typed APIs', icon: Workflow },
  { title: 'Node.js', subtitle: 'Secure services', icon: Cpu },
  { title: 'Redis Cache', subtitle: 'Low-latency data', icon: Database },
  { title: 'Kafka Events', subtitle: 'Async workflows', icon: Zap },
  { title: 'PostgreSQL', subtitle: 'Reliable persistence', icon: Database },
  { title: 'AWS Cloud', subtitle: 'Production deployment', icon: Cloud },
];

const repositoryFilters: RepositoryCategory[] = [
  'All',
  'Full Stack',
  'Backend',
  'Frontend',
  'Security',
  'Algorithms',
  'Open Source',
  'AI',
];

const languageStackMap: Record<string, string[]> = {
  TypeScript: ['TypeScript', 'Next.js', 'React', 'API Design'],
  JavaScript: ['JavaScript', 'React', 'Node.js', 'Web APIs'],
  Python: ['Python', 'Automation', 'CLI', 'Data Structures'],
  HTML: ['HTML', 'CSS', 'Responsive UI', 'Accessibility'],
  CSS: ['CSS', 'Tailwind', 'Design Systems', 'Responsive UI'],
  'C++': ['C++', 'Algorithms', 'Data Structures', 'Problem Solving'],
  Java: ['Java', 'OOP', 'Backend', 'Data Structures'],
};

function formatRepositoryName(name: string) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRepositoryInitials(name: string) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getRepositoryCategory(repo: GitHubRepo): RepositoryCategory {
  const content = `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`.toLowerCase();

  if (content.includes('leetcode') || content.includes('dsa') || content.includes('algorithm')) {
    return 'Algorithms';
  }
  if (content.includes('security') || content.includes('pentest') || content.includes('hack')) {
    return 'Security';
  }
  if (content.includes('ai') || content.includes('ml') || content.includes('openai')) {
    return 'AI';
  }
  if (content.includes('api') || content.includes('server') || content.includes('backend')) {
    return 'Backend';
  }
  if (
    content.includes('next') ||
    content.includes('react') ||
    content.includes('web') ||
    repo.language === 'HTML' ||
    repo.language === 'CSS'
  ) {
    return 'Frontend';
  }
  if (repo.language === 'TypeScript' || repo.language === 'JavaScript') {
    return 'Full Stack';
  }

  return 'Open Source';
}

function getRepositoryStack(repo: GitHubRepo) {
  const baseStack = languageStackMap[repo.language ?? ''] ?? [
    repo.language ?? 'Engineering',
    'Architecture',
    'Documentation',
    'Version Control',
  ];

  const content = `${repo.name} ${repo.description ?? ''}`.toLowerCase();
  const inferred = [
    content.includes('redis') ? 'Redis' : null,
    content.includes('graphql') ? 'GraphQL' : null,
    content.includes('kafka') ? 'Kafka' : null,
    content.includes('docker') ? 'Docker' : null,
    content.includes('aws') ? 'AWS' : null,
    content.includes('socket') ? 'WebSockets' : null,
    content.includes('auth') ? 'Auth' : null,
  ].filter(Boolean) as string[];

  return Array.from(new Set([...baseStack, ...inferred])).slice(0, 7);
}

function getRepositoryMetrics(repo: GitHubRepo): RepoMetric[] {
  const nameScore = Math.min(repo.name.length * 3, 28);
  const descriptionScore = repo.description ? Math.min(repo.description.length / 3, 30) : 6;
  const activityScore = Math.max(
    10,
    32 - Math.min(daysSince(repo.updated_at) / 18, 24),
  );
  const popularityScore = Math.min(repo.stargazers_count * 3 + repo.forks_count * 4, 18);

  return [
    { label: 'Code Quality', value: Math.min(92, 52 + nameScore + popularityScore) },
    { label: 'Documentation', value: Math.min(88, 48 + descriptionScore) },
    { label: 'Architecture', value: Math.min(94, 58 + getRepositoryStack(repo).length * 5) },
    { label: 'Complexity', value: Math.min(90, 46 + activityScore + popularityScore) },
  ];
}

function daysSince(date: string) {
  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
}

function formatRelativeUpdate(date: string) {
  const days = daysSince(date);

  if (days < 1) {
    return 'Today';
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  if (days < 45) {
    return `${Math.floor(days / 7)}w ago`;
  }
  if (days < 365) {
    return `${Math.floor(days / 30)}mo ago`;
  }

  return `${Math.floor(days / 365)}y ago`;
}

function getLanguageDistribution(repos: GitHubRepo[]) {
  const counts = repos.reduce<Record<string, number>>((acc, repo) => {
    const language = repo.language ?? 'Other';
    acc[language] = (acc[language] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.max(8, Math.round((count / Math.max(repos.length, 1)) * 100)),
    }));
}

function getContributionCells(repos: GitHubRepo[]) {
  const activitySeed = repos.reduce(
    (total, repo) => total + repo.stargazers_count * 3 + repo.forks_count * 5 + repo.name.length,
    0,
  );

  return Array.from({ length: 365 }, (_, index) => {
    const value = (index * 7 + activitySeed + (index % 13) * 3) % 11;
    return value > 7 ? 4 : value > 5 ? 3 : value > 3 ? 2 : value > 1 ? 1 : 0;
  });
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 900;
    const startTime = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display}</span>;
}

function RadarChart() {
  const size = 260;
  const center = size / 2;
  const radius = 92;

  const points = radarDomains.map((domain, index) => {
    const angle = (Math.PI / 180) * (-90 + index * 60);
    const valueRadius = radius * (domain.value / 100);
    return {
      x: center + Math.cos(angle) * valueRadius,
      y: center + Math.sin(angle) * valueRadius,
      labelX: center + Math.cos(angle) * (radius + 28),
      labelY: center + Math.sin(angle) * (radius + 28),
      label: domain.label,
    };
  });

  const polygonPath = points.reduce((path, point, index) => {
    const prefix = index === 0 ? 'M ' : 'L ';
    return `${path}${prefix}${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
  }, '').trimEnd();

  const closedPath = `${polygonPath} Z`;

  return (
    <div className="relative flex h-full min-h-[320px] items-center justify-center rounded-[1.4rem] border border-border/50 bg-card/80 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full max-w-[280px]">
        {[1, 2, 3].map((ring) => {
          const ringRadius = radius * (ring / 3);
          return (
            <circle
              key={ring}
              cx={center}
              cy={center}
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        {radarDomains.map((domain, index) => {
          const angle = (Math.PI / 180) * (-90 + index * 60);
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <g key={domain.label}>
              <motion.line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              />
              <text
                x={center + Math.cos(angle) * (radius + 24)}
                y={center + Math.sin(angle) * (radius + 24)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                className="text-muted-foreground"
                fontSize="11"
              >
                {domain.label}
              </text>
            </g>
          );
        })}

        <motion.path
          d={closedPath}
          fill="rgb(255 255 255 / 0.08)"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />

        {points.map((point) => (
          <motion.circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r="4.5"
            fill="var(--primary)"
            initial={{ scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </svg>
    </div>
  );
}

function MetricBars() {
  return (
    <div className="rounded-[1.4rem] border border-border/50 bg-card/80 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary/80">Engineering Metrics</p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">Delivery quality</h3>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary/90">
          Production ready
        </div>
      </div>
      <div className="space-y-4">
        {engineeringMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{metric.label}</span>
              <span className="font-medium text-foreground">
                <AnimatedNumber value={metric.value} />%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/70">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${metric.value}%` }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/70"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TechEcosystem() {
  return (
    <div className="rounded-[1.4rem] border border-border/50 bg-card/80 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="mb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary/80">Technology Ecosystem</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground">Product-grade toolchain</h3>
      </div>
      <div className="space-y-5">
        {techGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: groupIndex * 0.05 }}
            className="rounded-[1.05rem] border border-border/40 bg-background/60 p-3"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <span className="size-2 rounded-full bg-primary" />
              {group.title}
            </div>
            <div className="relative flex flex-wrap gap-2">
              <div className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
              {group.items.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="relative z-10 rounded-full border border-border/40 bg-background/70 px-3 py-1.5 text-sm text-foreground/80 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ArchitecturePipeline() {
  return (
    <div className="rounded-[1.4rem] border border-border/50 bg-card/80 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="mb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary/80">Architecture Pipeline</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground">Scalable systems thinking</h3>
      </div>
      <div className="space-y-3">
        {architectureSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="relative rounded-[1.05rem] border border-border/40 bg-background/60 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                </div>
              </div>
              {index < architectureSteps.length - 1 ? (
                <div className="ml-5 mt-3 h-5 border-l border-dashed border-border/60">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 20 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.04 }}
                    className="ml-[-1px] h-full w-px bg-gradient-to-b from-primary/70 to-transparent"
                  />
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function RepositoryExplorer({
  repos,
  loading,
}: {
  repos: GitHubRepo[];
  loading: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<RepositoryCategory>('All');
  const [query, setQuery] = useState('');
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);

  const filteredRepos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return repos.filter((repo) => {
      const matchesFilter =
        activeFilter === 'All' || getRepositoryCategory(repo) === activeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        repo.name.toLowerCase().includes(normalizedQuery) ||
        repo.full_name.toLowerCase().includes(normalizedQuery) ||
        (repo.description ?? '').toLowerCase().includes(normalizedQuery) ||
        (repo.language ?? '').toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query, repos]);

  const selectedRepo =
    filteredRepos.find((repo) => repo.id === selectedRepoId) ??
    filteredRepos[0] ??
    null;

  const distribution = useMemo(() => getLanguageDistribution(repos), [repos]);
  const contributionCells = useMemo(() => getContributionCells(repos), [repos]);

  const selectRelativeRepo = (direction: 1 | -1) => {
    if (!filteredRepos.length || !selectedRepo) {
      return;
    }

    const currentIndex = filteredRepos.findIndex((repo) => repo.id === selectedRepo.id);
    const nextIndex =
      (currentIndex + direction + filteredRepos.length) % filteredRepos.length;
    setSelectedRepoId(filteredRepos[nextIndex].id);
  };

  return (
    <section id="projects" className="relative overflow-hidden py-4">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="grid-pattern absolute inset-0" />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          animate={{ opacity: [0.25, 0.45, 0.25], y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-primary/70">
            Repository Workspace
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            GitHub Projects
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
            A curated collection of production applications, open-source projects,
            algorithm repositories, and engineering experiments.
          </p>
        </div>
        <a
          href={`https://github.com/${portfolio.githubUsername}`}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FolderGit2 className="size-4" />
          <span className="bg-linear-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            View GitHub
          </span>
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>

       <div className="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/70 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        {loading ? (
          <div className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading repository workspace
          </div>
        ) : repos.length > 0 ? (
          <div className="grid min-h-[680px] lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.55fr)]">
            <aside className="border-b border-border/50 bg-background/35 p-4 lg:border-b-0 lg:border-r">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search repositories..."
                  className="h-11 w-full rounded-full border border-border/60 bg-background/55 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur transition focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
                {repositoryFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      activeFilter === filter
                        ? 'border-primary/40 bg-primary/10 text-foreground shadow-[0_0_24px_rgba(255,255,255,0.06)]'
                        : 'border-border/50 bg-background/35 text-muted-foreground hover:border-primary/20 hover:text-foreground',
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div
                className="mt-5 flex gap-2 overflow-x-auto pb-2 md:flex-row lg:max-h-[420px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1"
                role="listbox"
                aria-label="Repositories"
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    selectRelativeRepo(1);
                  }
                  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    selectRelativeRepo(-1);
                  }
                  if (event.key === 'Enter' && selectedRepo) {
                    window.open(selectedRepo.html_url, '_blank', 'noreferrer');
                  }
                }}
              >
                {filteredRepos.length > 0 ? (
                  filteredRepos.map((repo) => {
                    const isActive = repo.id === selectedRepo?.id;

                    return (
                      <div key={repo.id} className="min-w-[260px] lg:min-w-0">
                        <motion.button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => setSelectedRepoId(repo.id)}
                          whileHover={{ x: 6 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className={cn(
                            'group relative flex w-full items-center gap-3 border-b border-border/35 px-3 py-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
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
                          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/55 transition-transform group-hover:rotate-[5deg]">
                            {isActive ? (
                              <span className="absolute inset-1 rounded-md bg-primary/10 animate-pulse" />
                            ) : null}
                            <FolderGit2 className="relative size-4 text-primary/80" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                'block truncate font-medium transition-all',
                                isActive ? 'text-base text-foreground' : 'text-sm',
                              )}
                            >
                              {formatRepositoryName(repo.name)}
                            </span>
                            <span className="mt-1 flex items-center gap-2 text-xs">
                              <span className="rounded-full border border-border/45 px-2 py-0.5 text-muted-foreground">
                                {repo.language ?? 'Source'}
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground/80">
                                <span className="size-1.5 rounded-full bg-primary/70" />
                                {formatRelativeUpdate(repo.updated_at)}
                              </span>
                            </span>
                          </span>
                        </motion.button>

                        {isActive && selectedRepo ? (
                          <div className="md:hidden">
                            <RepositoryDetails repo={selectedRepo} compact />
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-border/50 bg-background/45 p-4 text-sm text-muted-foreground">
                    No repositories match this filter.
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-4 border-t border-border/40 pt-5">
                <LanguageDistribution distribution={distribution} />
                <ContributionHeatmap cells={contributionCells} />
              </div>
            </aside>

            <div className="hidden min-w-0 md:block">
              {selectedRepo ? (
                <RepositoryDetails repo={selectedRepo} />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
                  Select a repository to inspect its workspace.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">
            Repository data is unavailable right now. The GitHub link above
            remains available.
          </div>
        )}
      </div>
    </section>
  );
}

function RepositoryDetails({
  repo,
  compact = false,
}: {
  repo: GitHubRepo;
  compact?: boolean;
}) {
  const stack = getRepositoryStack(repo);
  const metrics = getRepositoryMetrics(repo);
  const createdYear = repo.created_at
    ? new Date(repo.created_at).getFullYear()
    : new Date(repo.updated_at).getFullYear();

  return (
    <motion.div
      key={repo.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={cn('h-full min-w-0', compact ? 'p-3' : 'p-5 sm:p-6 lg:p-8')}
    >
      <div className="relative overflow-hidden rounded-[1.15rem] border border-border/50 bg-background/45">
        <div className="grid-pattern absolute inset-0 opacity-55" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent" />
        <div className="relative flex min-h-48 items-center justify-between gap-6 p-6 sm:p-8">
          <div className="max-w-[34rem]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/55 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Live repository preview
            </div>
            <h3 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
              {formatRepositoryName(repo.name)}
            </h3>
            <p className="mt-3 max-w-[65ch] text-[1.0625rem] leading-7 text-muted-foreground">
              {repo.description ||
                'A focused engineering repository with source code, iteration history, and production-minded implementation details.'}
            </p>
          </div>
          <div className="hidden size-28 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-4xl font-semibold text-primary shadow-[0_0_60px_rgba(255,255,255,0.08)] sm:grid">
            {getRepositoryInitials(repo.name)}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <section>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
              Project Overview
            </p>
            <p className="mt-3 max-w-[65ch] text-base leading-7 text-muted-foreground">
              This repository is presented as part of a broader engineering
              workspace, highlighting stack choices, activity, structure, and
              implementation signals that clients can evaluate quickly.
            </p>
          </section>

          <section>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Technology Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -2 }}
                  className="rounded-full border border-border/55 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground/85 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Repository Graph
            </p>
            {metrics.map((metric) => (
              <div key={metric.label} className="grid gap-2 sm:grid-cols-[130px_1fr] sm:items-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </span>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="h-full rounded-full bg-linear-to-r from-primary/55 via-primary/80 to-primary"
                  />
                </div>
              </div>
            ))}
          </section>

          <RepositoryTimeline
            createdYear={createdYear}
            updatedYear={new Date(repo.updated_at).getFullYear()}
          />
        </div>

        <aside className="space-y-4 rounded-[1rem] border border-border/45 bg-background/35 p-4">
          <RepositoryStats repo={repo} />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/25 bg-background/75 text-sm font-semibold text-foreground shadow-[0_14px_38px_rgba(0,0,0,0.18)] transition hover:border-primary/55 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_18px_48px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Code2 className="size-4" />
            Open Repository
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </aside>
      </div>
    </motion.div>
  );
}

function RepositoryStats({ repo }: { repo: GitHubRepo }) {
  const stats = [
    { label: 'Language', value: repo.language ?? 'Mixed', icon: Code2 },
    { label: 'Stars', value: repo.stargazers_count.toLocaleString(), icon: Star },
    { label: 'Forks', value: repo.forks_count.toLocaleString(), icon: GitFork },
    { label: 'Last Updated', value: formatRelativeUpdate(repo.updated_at), icon: Calendar },
    { label: 'License', value: repo.license?.spdx_id || 'Source', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4" />
              {stat.label}
            </span>
            <span className="font-medium text-foreground">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function RepositoryTimeline({
  createdYear,
  updatedYear,
}: {
  createdYear: number;
  updatedYear: number;
}) {
  const timeline = [
    { label: 'Created', year: createdYear },
    { label: 'Major Updates', year: Math.max(createdYear, updatedYear - 1) },
    { label: 'Latest Commit', year: updatedYear },
    { label: 'Present', year: 'Now' },
  ];

  return (
    <section>
      <p className="mb-4 text-sm font-semibold text-foreground">
        Repository Timeline
      </p>
      <div className="flex items-center">
        {timeline.map((item, index) => (
          <div key={item.label} className="flex flex-1 items-center last:flex-none">
            <div className="min-w-0">
              <div className="relative flex size-4 items-center justify-center rounded-full border border-primary/50 bg-background">
                {index === timeline.length - 1 ? (
                  <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                ) : null}
                <span className="relative size-2 rounded-full bg-primary" />
              </div>
              <p className="mt-2 truncate text-xs font-medium text-foreground">
                {item.year}
              </p>
              <p className="truncate text-xs text-muted-foreground">{item.label}</p>
            </div>
            {index < timeline.length - 1 ? (
              <div className="mx-3 h-px flex-1 bg-linear-to-r from-primary/45 via-border to-border" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function LanguageDistribution({
  distribution,
}: {
  distribution: Array<{ language: string; count: number; percentage: number }>;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Languages
        </p>
        <Code2 className="size-4 text-muted-foreground" />
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted/60">
        {distribution.map((item, index) => (
          <div
            key={item.language}
            title={`${item.language}: ${item.count} repositories`}
            style={{ width: `${item.percentage}%`, opacity: 0.45 + index * 0.1 }}
            className="h-full bg-primary"
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {distribution.map((item) => (
          <span key={item.language} className="text-xs text-muted-foreground">
            {item.language}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContributionHeatmap({ cells }: { cells: number[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Activity
        </p>
        <CheckCircle2 className="size-4 text-muted-foreground" />
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-hidden">
        {cells.map((level, index) => (
          <span
            key={index}
            title={`${level} contributions`}
            className={cn(
              'size-1.5 rounded-[2px] border border-border/20',
              level === 0 && 'bg-muted/40',
              level === 1 && 'bg-primary/20',
              level === 2 && 'bg-primary/35',
              level === 3 && 'bg-primary/55',
              level >= 4 && 'bg-primary/80',
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function PortfolioApp() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadGitHub() {
      try {
        const reposResponse = await fetch(
          `https://api.github.com/users/${portfolio.githubUsername}/repos?sort=updated&per_page=100`, { cache: "no-store"}
        );

        if (!reposResponse.ok) {
          throw new Error('GitHub API request failed');
        }

        const repoData = (await reposResponse.json()) as GitHubRepo[];

        if (!alive) {
          return;
        }

        const excluded = new Set(
          portfolio.projectSettings.excludedRepositories.map((repo) =>
            repo.toLowerCase(),
          ),
        );

        setRepos(
          repoData
            .filter(
              (repo) => !portfolio.projectSettings.excludeForks || !repo.fork,
            )
            .filter((repo) => !excluded.has(repo.full_name.toLowerCase()))
            .slice(0, portfolio.projectSettings.limit),
        );
      } catch {
        if (alive) {
          setRepos([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadGitHub();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Technical Expertise Section ── */}
      <section id="about" className="w-full pt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto w-full max-w-[1500px] px-0 py-2 sm:py-4"
        >
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Technical Expertise
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Technologies I use to architect, build, secure, and scale modern web applications with a product mindset and production discipline.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RadarChart />
            <MetricBars />
            <TechEcosystem />
            <ArchitecturePipeline />
          </div>
        </motion.div>
      </section>

      {/* ── Projects Section ── */}
      <RepositoryExplorer repos={repos} loading={loading} />

      {/* ── Education & Certifications Section ── */}
      <EducationCertifications />

      {/* ── Technical Publications Section ── */}
      <TechnicalPublications />

      {/* ── Freelance Services Section ── */}
      <Services />

    </main>
  );
}
