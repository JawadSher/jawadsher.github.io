'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  ImageOff,
  Search,
  Star,
  X,
  ZoomIn,
  GraduationCap,
  Award,
} from 'lucide-react';
import { portfolio, type TimelineItem } from '@/config/portfolio';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// ─────────────────────────────────────────────────────────────────────────
// Certifications data source
// Certificate images + metadata live in a dedicated GitHub repo
// (JawadSher/Certifications) behind a manifest.
// ─────────────────────────────────────────────────────────────────────────
const CERTIFICATIONS_REPO = 'JawadSher/Certifications';
const CERTIFICATIONS_BRANCH = 'main';
const CERTIFICATIONS_BASE = `https://raw.githubusercontent.com/${CERTIFICATIONS_REPO}/${CERTIFICATIONS_BRANCH}`;
const CERTIFICATIONS_MANIFEST_URL = `${CERTIFICATIONS_BASE}/certifications.json`;
const CERTIFICATIONS_REPO_URL = `https://github.com/${CERTIFICATIONS_REPO}`;

type CertificationRecord = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string | null;
  credentialUrl: string | null;
  image: string;
  category: string;
  featured?: boolean;
  description?: string;
  skills?: string[];
};

type Certification = CertificationRecord & {
  imageUrl: string;
  skills: string[];
};

type FetchStatus = 'loading' | 'ready' | 'error';

function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const response = await fetch(CERTIFICATIONS_MANIFEST_URL, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to load certifications manifest');
        }

        const data = (await response.json()) as {
          'certifications-info': CertificationRecord[];
        };

        if (!alive) {
          return;
        }

        const mapped = (data['certifications-info'] ?? [])
          .map((cert) => ({
            ...cert,
            imageUrl: `${CERTIFICATIONS_BASE}/${cert.image}`,
            skills: cert.skills ?? [],
          }))
          .sort(
            (a, b) =>
              new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
          );

        setCertifications(mapped);
        setStatus('ready');
      } catch {
        if (alive) {
          setCertifications([]);
          setStatus('error');
        }
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  return { certifications, status };
}

function formatIssueDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────
// Motion variants
// ─────────────────────────────────────────────────────────────────────────
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const previewVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────
export function EducationCertifications() {
  const { certifications, status } = useCertifications();

  return (
    <div className="w-full space-y-20 py-8">
      {/* Education Module */}
      <EducationSection />

      {/* Certifications Module */}
      <CertificationsSection certifications={certifications} status={status} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Education Section (Separate, Full-Width Responsive Design)
// ─────────────────────────────────────────────────────────────────────────
function EducationSection() {
  return (
    <section id="education" className="relative w-full">
      {/* Glowing atmospheric gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div className="grid-pattern absolute inset-0" />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/4 top-10 h-44 w-44 rounded-full bg-primary/5 blur-3xl"
          animate={{ opacity: [0.2, 0.35, 0.2], y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-0">
        <div className="max-w-3xl mb-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-primary/70">
            Academic Foundation
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Education
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
            My formal computer science training and educational background.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(portfolio.education as TimelineItem[]).map((edu, index) => (
            <motion.div
              key={`${edu.title}-${edu.from}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[1.4rem] border border-border/50 bg-card/45 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-355 hover:border-primary/30 hover:bg-card/70"
            >
              {/* Radial gradient hover glow inside card */}
              <div className="absolute inset-0 -z-10 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10 transition-colors duration-300 group-hover:bg-primary/20 group-hover:text-primary">
                  <GraduationCap className="size-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                      {edu.title}
                    </h3>
                    <span className="shrink-0 w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">
                      {edu.from} — {edu.to || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {edu.subtitle}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Certifications Section (Split layout matching Technical Publications)
// ─────────────────────────────────────────────────────────────────────────
function CertificationsSection({
  certifications,
  status,
}: {
  certifications: Certification[];
  status: FetchStatus;
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(certifications.map((cert) => cert.category)),
    );
    return ['All', ...unique.sort()];
  }, [certifications]);

  const filtered = useMemo(() => {
    let list = certifications;

    if (activeCategory !== 'All') {
      list = list.filter((cert) => cert.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (cert) =>
          cert.title.toLowerCase().includes(q) ||
          cert.issuer.toLowerCase().includes(q) ||
          cert.skills.some((skill) => skill.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [certifications, activeCategory, query]);

  const selectedIdToUse = useMemo(() => {
    if (filtered.length === 0) {
      return null;
    }

    return filtered.some((cert) => cert.id === selectedId)
      ? selectedId
      : filtered[0].id;
  }, [filtered, selectedId]);

  const selected =
    filtered.find((cert) => cert.id === selectedIdToUse) ?? filtered[0] ?? null;

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      if (!filtered.length) {
        return;
      }
      setSelectedId((current) => {
        const currentIndex = filtered.findIndex((cert) => cert.id === current);
        const base = currentIndex === -1 ? 0 : currentIndex;
        const nextIndex =
          (base + direction + filtered.length) % filtered.length;
        return filtered[nextIndex].id;
      });
    },
    [filtered],
  );

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') navigate(1);
      if (event.key === 'ArrowLeft') navigate(-1);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, closeLightbox, navigate]);

  return (
    <section id="certifications" className="relative w-full">
      {/* Ambient background blur */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div className="grid-pattern absolute inset-0" />
        <motion.div
          aria-hidden="true"
          className="absolute right-1/4 top-10 h-44 w-44 rounded-full bg-primary/5 blur-3xl"
          animate={{ opacity: [0.2, 0.35, 0.2], y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-primary/70">
            Verified Credentials
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Certifications
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
            Professional certifications and technical achievements in
            cybersecurity and engineering.
          </p>
        </div>

        <a
          href={CERTIFICATIONS_REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FolderGit2 className="size-4" />
          <span className="bg-linear-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            View Certifications Repo
          </span>
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>

      <div className="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/70 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        {status === 'loading' && <CertificationsSkeleton />}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load certifications right now. You can view them
              directly on{' '}
              <a
                href={CERTIFICATIONS_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        )}

        {status === 'ready' && certifications.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-sm text-muted-foreground">
              New credentials are added directly to the repository — check back
              soon.
            </p>
          </div>
        )}

        {status === 'ready' && certifications.length > 0 && (
          <div className="grid min-h-[800px] lg:h-[600px] lg:grid-cols-[minmax(310px,1.05fr)_minmax(0,1.4fr)]">
            {/* Sidebar Column */}
            <aside className="flex min-h-0 flex-col border-b border-border/50 bg-background/35 p-4 lg:border-b-0 lg:border-r">
              {/* Search Bar */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search certifications..."
                  className="h-11 w-full rounded-full border border-border/60 bg-background/55 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur transition focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {/* Category Filter Tabs */}
              {categories.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        activeCategory === category
                          ? 'border-primary/40 bg-primary/10 text-foreground shadow-[0_0_24px_rgba(255,255,255,0.06)]'
                          : 'border-border/50 bg-background/35 text-muted-foreground hover:border-primary/20 hover:text-foreground',
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {/* Scrollable list */}
              <div className="mt-5 flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto max-h-[320px] lg:max-h-none pr-1 ">
                  {filtered.length === 0 ? (
                    <div className="rounded-xl border border-border/50 bg-background/45 p-4 text-sm text-muted-foreground text-center">
                      No certifications match your query.
                    </div>
                  ) : (
                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-1.5"
                    >
                      {filtered.map((cert) => {
                        const isActive = selected?.id === cert.id;
                        return (
                          <div key={cert.id}>
                            <motion.button
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              onClick={() => setSelectedId(cert.id)}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className={cn(
                                'group relative flex w-full items-start gap-3 border-b border-border/30 px-3 py-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring rounded-lg',
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

                              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/30">
                                <CertificateImage
                                  src={cert.imageUrl}
                                  alt=""
                                  fit="cover"
                                  iconSize="size-4"
                                />
                              </div>

                              <div className="min-w-0 flex-1 space-y-1">
                                <span
                                  className={cn(
                                    'block truncate font-medium transition-all',
                                    isActive
                                      ? 'text-sm text-foreground'
                                      : 'text-xs text-foreground/85',
                                  )}
                                >
                                  {cert.title}
                                </span>
                                <span className="flex items-center justify-between text-[10px] text-muted-foreground/80">
                                  <span className="inline-flex items-center gap-1">
                                    <CalendarDays className="size-3 opacity-75" />
                                    {formatIssueDate(cert.issueDate)}
                                  </span>
                                  <span className="max-w-[100px] truncate text-[8px] font-semibold uppercase tracking-wide text-primary/70">
                                    {cert.category}
                                  </span>
                                </span>
                              </div>
                              {cert.featured && (
                                <Star className="mt-0.5 size-3 shrink-0 fill-primary text-primary" />
                              )}
                            </motion.button>

                            {/* Mobile Inline Drawer */}
                            <AnimatePresence>
                              {isActive && selected && (
                                <MobileCertificationDrawer
                                  cert={selected}
                                  onOpenLightbox={() => setLightboxOpen(true)}
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
            </aside>

            {/* Desktop Preview Panel (Visible on lg screens) */}
            <div className="hidden min-w-0 lg:block bg-background/10">
              <CertificationPreview
                cert={selected}
                onOpenLightbox={() => setLightboxOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox View */}
      <CertificationLightbox
        certification={lightboxOpen ? selected : null}
        hasMultiple={filtered.length > 1}
        onClose={closeLightbox}
        onNavigate={navigate}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Desktop Certification Preview Panel
// ─────────────────────────────────────────────────────────────────────────
type CertificationPreviewProps = {
  cert: Certification | null;
  onOpenLightbox: () => void;
};

function CertificationPreview({
  cert,
  onOpenLightbox,
}: CertificationPreviewProps) {
  return (
    <main
      className="flex min-h-0 flex-col p-6 h-full overflow-y-auto"
      aria-live="polite"
      aria-label="Selected certification preview"
    >
      <AnimatePresence mode="wait">
        {cert ? (
          <motion.article
            key={cert.id}
            variants={previewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex min-h-0 flex-1 flex-col h-full"
          >
            {/* Aspect Video Image Container */}
            <button
              type="button"
              onClick={onOpenLightbox}
              className="group relative block aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <CertificateImage
                src={cert.imageUrl}
                alt={cert.title}
                fit="contain"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition duration-300 group-hover:bg-background/30 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/90 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-sm">
                  <ZoomIn className="size-3.5" />
                  View full size
                </span>
              </span>
              {cert.featured && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background/85 px-2.5 py-0.5 text-[10px] font-medium text-primary backdrop-blur-sm">
                  <Star className="size-3 fill-primary" />
                  Featured
                </span>
              )}
            </button>

            {/* Meta (Date + Category) */}
            <div className="mt-5 flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 opacity-75" />
                {formatIssueDate(cert.issueDate)}
              </span>
              <span aria-hidden="true">•</span>
              <span className="font-semibold uppercase tracking-wide text-primary/80">
                {cert.category}
              </span>
            </div>

            {/* Info */}
            <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
              {cert.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground/80">
              {cert.issuer}
            </p>

            {cert.description && (
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted-foreground/90">
                {cert.description}
              </p>
            )}

            {/* Skill Tags */}
            {cert.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border/40 bg-muted/40 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Credential ID */}
            {cert.credentialId && (
              <p className="mt-4 text-xs text-muted-foreground/75 font-mono">
                Credential ID: {cert.credentialId}
              </p>
            )}

            {/* Verify Button */}
            {cert.credentialUrl && (
              <div className="mt-auto flex justify-end pt-6">
                <motion.a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-black/80 focus-visible:outline focus-visible:outline-2 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BadgeCheck className="size-4 text-white dark:text-black" />
                  <span className="text-white dark:text-black">
                    Verify Credential
                  </span>
                  <ArrowUpRight
                    className="size-4 text-white dark:text-black transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </motion.a>
              </div>
            )}
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
              <Award
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a certification to view details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Mobile Certification Drawer (Inline details)
// ─────────────────────────────────────────────────────────────────────────
type MobileCertificationDrawerProps = {
  cert: Certification;
  onOpenLightbox: () => void;
};

function MobileCertificationDrawer({
  cert,
  onOpenLightbox,
}: MobileCertificationDrawerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden border-b border-border/30 bg-background/20 px-3 py-4 lg:hidden w-full"
    >
      <div className="space-y-4 pt-1">
        {/* Certificate image button */}
        <button
          type="button"
          onClick={onOpenLightbox}
          className="group relative block aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border/40 bg-muted/20 outline-none"
        >
          <CertificateImage
            src={cert.imageUrl}
            alt={cert.title}
            fit="contain"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition group-hover:bg-background/30 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
              <ZoomIn className="size-3.5" />
              View full size
            </span>
          </span>
          {cert.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background/85 px-2 py-0.5 text-[0.6rem] font-medium text-primary backdrop-blur-sm">
              <Star className="size-2.5 fill-primary" />
              Featured
            </span>
          )}
        </button>

        {/* Certificate meta & details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{cert.issuer}</span>
            <span>•</span>
            <span className="font-semibold uppercase text-primary/80">
              {cert.category}
            </span>
          </div>

          {cert.description && (
            <p className="font-sans text-xs font-light leading-relaxed text-muted-foreground/90">
              {cert.description}
            </p>
          )}

          {cert.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {cert.credentialId && (
            <p className="text-[10px] text-muted-foreground/75 font-mono">
              Credential ID: {cert.credentialId}
            </p>
          )}

          {cert.credentialUrl && (
            <div className="pt-2">
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border/50 bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                <BadgeCheck className="size-3.5" />
                Verify Credential
                <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Skeleton loading view
// ─────────────────────────────────────────────────────────────────────────
function CertificationsSkeleton() {
  return (
    <div
      className="grid min-h-[600px] lg:h-[600px] lg:grid-cols-[minmax(310px,1.05fr)_minmax(0,1.4fr)] animate-pulse"
      aria-busy="true"
      aria-label="Loading certifications"
    >
      {/* Sidebar skeleton */}
      <aside className="flex min-h-0 flex-col border-b border-border/50 bg-background/35 p-4 lg:border-b-0 lg:border-r">
        <Skeleton className="h-11 w-full rounded-full" />
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16 rounded-full shrink-0" />
          ))}
        </div>
        <ul
          className="mt-4 flex min-h-0 flex-1 flex-col gap-0"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="flex items-start gap-3 border-b border-border/30 px-2.5 py-3"
            >
              <Skeleton className="size-11 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Preview skeleton */}
      <div className="hidden min-h-0 flex-col p-6 lg:flex">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mt-4 h-7 w-4/5" />
        <Skeleton className="mt-4 h-7 w-3/5" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="mt-auto flex justify-end pt-6">
          <Skeleton className="h-11 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Lazy Certificate Image Loader with Failure Fallback
// ─────────────────────────────────────────────────────────────────────────
function CertificateImage({
  src,
  alt,
  fit = 'cover',
  iconSize = 'size-5',
}: {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
  iconSize?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground/60">
        <ImageOff className={iconSize} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        'h-full w-full transition-transform duration-500',
        fit === 'cover' ? 'object-cover' : 'object-contain',
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Lightbox - Full-size Modal Image View
// ─────────────────────────────────────────────────────────────────────────
function CertificationLightbox({
  certification,
  hasMultiple,
  onClose,
  onNavigate,
}: {
  certification: Certification | null;
  hasMultiple: boolean;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}) {
  return (
    <AnimatePresence>
      {certification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={certification.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-4xl items-center justify-center"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -right-2 -top-2 z-20 inline-flex size-8 items-center justify-center rounded-full border border-border/50 bg-background/90 text-muted-foreground backdrop-blur-sm transition hover:text-foreground hover:scale-105"
            >
              <X className="size-4" />
            </button>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  aria-label="Previous credential"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground backdrop-blur-sm transition hover:text-foreground hover:scale-105"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  aria-label="Next credential"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground backdrop-blur-sm transition hover:text-foreground hover:scale-105"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            <img
              src={certification.imageUrl}
              alt={certification.title}
              className="max-h-[80vh] max-w-full rounded-xl border border-border/40 bg-card object-contain shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
