'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import Image from 'next/image';
import { portfolio } from '@/config/portfolio';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Role titles that cycle via morphing text
   ───────────────────────────────────────────── */
const roles = [
  'Full Stack Web Developer',
  'Hobbyist Penetration Tester',
  'Cloud-Native Builder',
];

/* ─────────────────────────────────────────────
   Animated counter for stats
   ───────────────────────────────────────────── */
function AnimatedCounter({
  target,
  duration = 2,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
    const frame = requestAnimationFrame(() => setCount(0));
    return () => cancelAnimationFrame(frame);
  }, [target]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const step = () => {
            const elapsed = (Date.now() - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ─────────────────────────────────────────────
   Floating code snippets
   ───────────────────────────────────────────── */
function TypewriterText({
  texts,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1200,
}: {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < currentText.length) {
          setDisplayed(currentText.slice(0, displayed.length + 1));
          return;
        }
        setIsDeleting(true);
        return;
      }

      if (displayed.length > 0) {
        setDisplayed(currentText.slice(0, displayed.length - 1));
        return;
      }

      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    },
    displayed === currentText && !isDeleting
      ? pause
      : isDeleting
      ? deletingSpeed
      : typingSpeed);

    return () => window.clearTimeout(timeout);
  }, [currentIndex, displayed, isDeleting, pause, typingSpeed, deletingSpeed, texts]);

  return (
    <span className="inline-flex items-center gap-2">
      <span>{displayed}</span>
      <span className="inline-block h-6 w-0.5 rounded-full bg-accent animate-pulse" />
    </span>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [githubStats, setGithubStats] = useState({
    repos: 0,
    followers: 0,
  });

  // Mouse parallax for the portrait
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX - innerWidth / 2) / 40);
      mouseY.set((e.clientY - innerHeight / 2) / 40);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Fetch GitHub stats
  useEffect(() => {
    const githubFallbackStats = {
      repos: portfolio.projectSettings.limit,
      followers: Math.max(portfolio.socials.length - 2, 1),
    };
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    fetch(`https://api.github.com/users/${portfolio.githubUsername}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGithubStats({
          repos: data.public_repos || githubFallbackStats.repos,
          followers: data.followers || githubFallbackStats.followers,
        });
      })
      .catch(() => {
        setGithubStats(githubFallbackStats);
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const statItems = useMemo(
    () => [
      { label: 'Repositories', value: githubStats.repos },
      { label: 'Followers', value: githubStats.followers },
      { label: 'Certifications', value: portfolio.certifications.length },
      { label: 'Skill Areas', value: portfolio.skillGroups.length },
    ],
    [githubStats],
  );

  const socialIconMap = {
    github: 'fi-brands-github',
    linkedin: 'fi-brands-linkedin',
    x: 'fi-brands-twitter-alt',
    youtube: 'fi-brands-youtube',
    medium: 'fi-brands-medium',
    fiverr: 'fiverr-svg',
    upwork: 'upwork-svg',
    email: 'fi-rr-envelope',
    whatsapp: 'fi-brands-whatsapp',
    resume: 'fi-rr-document',
  } as const;

  const socialToneMap = {
    github: 'hero-social-github',
    linkedin: 'hero-social-linkedin',
    x: 'hero-social-x',
    youtube: 'hero-social-youtube',
    medium: 'hero-social-medium',
    fiverr: 'hero-social-fiverr',
    upwork: 'hero-social-upwork',
    email: 'hero-social-email',
    whatsapp: 'hero-social-whatsapp',
    resume: 'hero-social-resume',
  } as const;

  const socialLinks = portfolio.socials.map((social) => ({
    ...social,
    iconClass: socialIconMap[social.kind as keyof typeof socialIconMap] ?? 'fi-rr-up-right-from-square',
    toneClass: socialToneMap[social.kind as keyof typeof socialToneMap] ?? 'hero-social-default',
  }));

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Background Layers ── */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="noise-overlay" />

      {/* Decorative orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.72 0.05 65 / 0.06), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.60 0.04 80 / 0.05), transparent 70%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* ── Main Content ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-24"
      >
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ── LEFT COLUMN: Text Content ── */}
          <motion.div className='space-y-4'>
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-foreground/80">
                  Available for Work
                </span>
              </div>
            </motion.div>

            {/* Name — Character-by-character stagger */}
            <div className="space-y-3">
              <motion.h1
                className="max-w-[12ch] text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold tracking-tight text-foreground leading-[1.02]"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.03 } },
                }}
              >
                {portfolio.name.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 50, rotateX: -90 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        transition: {
                          duration: 0.5,
                          ease: [0.25, 0.4, 0.25, 1],
                        },
                      },
                    }}
                    className="inline-block"
                    style={{
                      display: char === ' ' ? 'inline' : 'inline-block',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Typing Role Text */}
              <div className="h-12 sm:h-14 overflow-hidden">
                <motion.p
                  initial={{ y: 40, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  className="text-lg sm:text-xl font-medium text-accent"
                >
                  <TypewriterText texts={roles} />
                </motion.p>
              </div>
            </div>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground"
            >
              {portfolio.summary}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap gap-4"
            >
              {/* Primary CTA */}
              <motion.a
                href="#projects"
                className="hero-cta hero-cta-primary group px-6 py-3 text-sm"
                whileHover={{ scale: 1.045, y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="hero-cta-shine" />
                <span className="relative z-10 flex items-center gap-2">
                  <i className="fi fi-rr-briefcase hero-fi-icon" />
                  View My Work
                </span>
              </motion.a>

              {/* Secondary CTA */}
              <motion.a
                href={portfolio.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="hero-cta hero-cta-secondary group px-6 py-3 text-sm"
                whileHover={{ scale: 1.045, y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="hero-cta-shine" />
                <span className="relative z-10 flex items-center gap-2">
                  <i className="fi fi-rr-document hero-fi-icon" />
                  Download Resume
                  <i className="fi fi-rr-up-right-from-square text-[0.72rem] opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-wrap items-center gap-3"
            >
              {socialLinks.map((social, index) => {
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn('hero-social-link group size-10 flex items-center justify-center', social.toneClass)}
                    whileHover={{ scale: 1.12, y: -4, rotate: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1.3 + index * 0.08,
                      type: 'spring',
                      stiffness: 360,
                      damping: 22,
                    }}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <span className="hero-social-glow" />
                    {social.kind === 'fiverr' ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="hero-social-icon relative z-10 size-[1.15rem] transition-all duration-300 group-hover:scale-108">
                        <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.83-.487l1.425.4c-.351.848-1.22 1.364-2.255 1.364-1.748 0-2.549-1.355-2.549-2.515 0-1.14.703-2.505 2.45-2.505 1.856 0 2.471 1.384 2.471 2.408 0 .224-.01.37-.02.477zm-1.562-.945c-.04-.42-.342-.81-.889-.81-.508 0-.81.225-.908.81h1.797zM7.508 15.44h1.416l1.767-4.874h-1.62l-.86 2.837-.878-2.837H5.72l1.787 4.874zm-6.6 0H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z"/>
                      </svg>
                    ) : social.kind === 'upwork' ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="hero-social-icon relative z-10 size-[1.1rem] transition-all duration-300 group-hover:scale-108">
                        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                      </svg>
                    ) : (
                      <i
                        className={cn(
                          'fi hero-social-icon relative z-10',
                          social.iconClass,
                        )}
                      />
                    )}
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/50"
            >
              {statItems.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-semibold text-foreground font-mono">
                    <AnimatedCounter target={stat.value} />
                    <span className="text-accent">+</span>
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: Portrait ── */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="relative"
            >
              {/* Glow behind image */}
              <div className="absolute -inset-8 bg-accent/5 rounded-3xl blur-2xl" />
              
              {/* Portrait Container with Organic Curly Blob Frame */}
              <motion.div
                style={{ x: springX, y: springY }}
                animate={{
                  borderRadius: [
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                    '30% 60% 70% 40% / 50% 60% 30% 60%',
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-80 h-[24rem] sm:w-96 sm:h-[28rem] lg:w-[28rem] lg:h-[32rem] overflow-hidden bg-muted shadow-2xl"
              >
                {/* Clip-path reveal animation */}
                <motion.div
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ clipPath: 'inset(0% 0 0 0)' }}
                  transition={{
                    duration: 1.2,
                    delay: 0.6,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/my-picture.png"
                    alt={`${portfolio.name} - Portrait`}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 416px"
                  />

                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
                  
                  {/* Side gradient blend */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          className="hero-scroll-icon"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Scroll to about section"
        >
          <span className="hero-scroll-icon-ring" />
          <span className="hero-scroll-icon-glyph">
            <i className="fi fi-rr-arrow-down" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
