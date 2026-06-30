'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  Brain,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { portfolio } from '@/config/portfolio';
import { cn } from '@/lib/utils';

const servicesList = [
  {
    title: 'Full-Stack Web Development',
    tagline: 'Next.js & React Engineering',
    description: 'Developing responsive, high-performance web applications using modern, interactive layouts that look stunning while remaining optimized for SEO, speed, and cross-device usage.',
    icon: Code2,
    bulletPoints: [
      'Next.js 16 App Router & Client/Server architectures',
      'TypeScript codebase implementation',
      'Tailwind CSS & custom styled design systems',
      'Fluid Framer Motion micro-animations',
      'Responsive, accessible, and fast layouts',
    ],
    badge: 'Popular',
    accentColor: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20',
    borderColor: 'group-hover:border-blue-500/30',
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    title: 'Backend & API Architecture',
    tagline: 'Scalable Services & Realtime Systems',
    description: 'Engineering resilient, scalable, and low-latency API networks, database designs, and event-driven backends designed to support product workflows.',
    icon: Server,
    bulletPoints: [
      'Node.js, NestJS, and clean REST/GraphQL APIs',
      'Redis cache layers and system speed-ups',
      'Kafka asynchronous messaging and pipeline flows',
      'PostgreSQL, MongoDB, and MySQL structured models',
      'Containerization (Docker) and Cloudflare setups',
    ],
    badge: 'Scalable',
    accentColor: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20',
    borderColor: 'group-hover:border-purple-500/30',
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    title: 'AI Integration & Automation',
    tagline: 'Intelligent Features & Workflows',
    description: 'Integrating large language models (LLMs), semantic search, intelligent chatbots, and automated workflows directly into your web applications.',
    icon: Brain,
    bulletPoints: [
      'OpenAI, Anthropic, and Gemini API setups',
      'RAG (Retrieval-Augmented Generation) & Vector DBs',
      'Vercel AI SDK and AI-assisted chat screens',
      'Autonomous agents and automated workflow jobs',
      'Structured LLM outputs and schema validations',
    ],
    badge: 'Cutting-edge',
    accentColor: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
    borderColor: 'group-hover:border-emerald-500/30',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

export function Services() {
  const fiverrLink = portfolio.socials.find((s) => s.kind === 'fiverr')?.href || 'https://www.fiverr.com/jawadsh3r?public_mode=true';
  const upworkLink = portfolio.socials.find((s) => s.kind === 'upwork')?.href || 'https://www.upwork.com/freelancers/~01bec04f10ad4f0f13?mp_source=share';

  return (
    <section id="services" className="relative overflow-hidden py-10 border-t border-border/20">
      {/* ── Background Glow Effects ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="grid-pattern absolute inset-0" />
        <motion.div
          aria-hidden="true"
          className="absolute right-10 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute left-10 bottom-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl"
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1.1, 0.95, 1.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="w-full">
        {/* ── Section Header ── */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary font-semibold mb-3">
            <Sparkles className="size-3.5" />
            <span>Available for Hire</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Freelance & Engineering Services
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            I offer production-grade full-stack engineering, API design, and web security testing services. Hire me directly via secure contract platforms.
          </p>
        </div>

        {/* ── Services Grid ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={cn(
                  'group relative flex flex-col justify-between overflow-hidden rounded-[1.4rem] border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300',
                  service.borderColor
                )}
              >
                {/* Accent Background Glow */}
                <div className={cn('absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100', service.accentColor)} />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn('flex size-11 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110', service.iconColor)}>
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full bg-border/45 border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {service.badge}
                    </span>
                  </div>

                  {/* Service Metadata */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">
                      {service.tagline}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground mt-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bullet Points */}
                <ul className="mt-6 space-y-2.5 border-t border-border/30 pt-5 text-xs text-muted-foreground font-sans">
                  {service.bulletPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-primary/70 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* ── Advertising & Re-branding CTA area ── */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[1.8rem] border border-border/60 bg-gradient-to-r from-card/90 via-background/40 to-card/90 p-8 sm:p-10 lg:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-md"
          >
            {/* Ambient background decoration */}
            <div className="absolute inset-0 -z-10 grid-pattern opacity-40" />
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <span className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-primary/80">
                  Ready to collaborate?
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  Let's bring your software idea to life.
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-[55ch]">
                  Whether you require a complete SaaS dashboard, secure API development, database optimizations, or intelligent AI features, you can hire me through contract platforms with escrow protection.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-sans text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Milestone Escrow Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Clear Contract Agreements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>Scalable Code Quality</span>
                  </div>
                </div>
              </div>

              {/* Freelancing Portals Banners */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Fiverr Banner Card */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col justify-between rounded-[1.3rem] border border-emerald-500/25 bg-emerald-500/5 p-5 shadow-lg backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Fiverr Gig
                      </span>
                      {/* Custom Fiverr SVG */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 text-emerald-400">
                        <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.83-.487l1.425.4c-.351.848-1.22 1.364-2.255 1.364-1.748 0-2.549-1.355-2.549-2.515 0-1.14.703-2.505 2.45-2.505 1.856 0 2.471 1.384 2.471 2.408 0 .224-.01.37-.02.477zm-1.562-.945c-.04-.42-.342-.81-.889-.81-.508 0-.81.225-.908.81h1.797zM7.508 15.44h1.416l1.767-4.874h-1.62l-.86 2.837-.878-2.837H5.72l1.787 4.874zm-6.6 0H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z"/>
                      </svg>
                    </div>
                    <h4 className="text-base font-semibold text-foreground">
                      Order Defined Gigs
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Best for fast-turnaround single-page apps, bug fixes, or discrete feature upgrades.
                    </p>
                  </div>

                  <a
                    href={fiverrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-950/20 hover:bg-emerald-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    <span>Hire on Fiverr</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </motion.div>

                {/* Upwork Banner Card */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col justify-between rounded-[1.3rem] border border-lime-500/25 bg-lime-500/5 p-5 shadow-lg backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded">
                        Upwork Contract
                      </span>
                      {/* Custom Upwork SVG */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lime-400">
                        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                      </svg>
                    </div>
                    <h4 className="text-base font-semibold text-foreground">
                      Hourly or Fixed Projects
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Best for complex web architectures, backend setup, database design, and ongoing development.
                    </p>
                  </div>

                  <a
                    href={upworkLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-lime-500 text-xs font-bold text-white shadow-md shadow-lime-950/20 hover:bg-lime-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
                  >
                    <span>Hire on Upwork</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
