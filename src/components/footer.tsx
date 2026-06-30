'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { portfolio } from '@/config/portfolio';
import { cn } from '@/lib/utils';

const sectionLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
];

const footerSocials = portfolio.socials.filter((social) =>
  ['github', 'linkedin', 'email', 'resume', 'fiverr', 'upwork'].includes(social.kind),
);

// pure black & white — every icon shares the same invert-on-hover
// treatment instead of brand colors, so nothing breaks the palette
const socialIconMap = {
  github: 'fi-brands-github',
  linkedin: 'fi-brands-linkedin',
  email: 'fi-rr-envelope',
  resume: 'fi-rr-document',
  fiverr: 'fiverr-svg',
  upwork: 'upwork-svg',
} as const;

const emailSocial = portfolio.socials.find((social) => social.kind === 'email');

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(footerRef, { once: true, margin: '-10% 0px' });

  const handleBackToTop = () => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative mt-16 overflow-hidden border-t border-border/40 bg-background"
    >
      {/* ambient drifting glow — pure grayscale, two soft foreground blobs at different weights for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-foreground/10 blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, 40, -10, 0], y: [0, -20, 20, 0] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-foreground/[0.06] blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, -30, 10, 0], y: [0, 20, -15, 0] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          >

          {/* signature interaction: each letter lifts in a wave on hover — motion is the accent, not color */}
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="block h-px w-100 origin-left bg-gradient-to-r from-foreground to-transparent"
          />
          <h1 className="group/name mt-4 w-full cursor-default select-none font-serif text-[clamp(4rem,9vw,13.2rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-foreground">
            {portfolio.name.split('').map((char, i) => (
              <span
                key={i}
                style={{ transitionDelay: `${i * 16}ms` }}
                className="inline-block transition-transform duration-300 ease-out group-hover/name:-translate-y-4"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {portfolio.role}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {emailSocial ? (
              <a
                href={emailSocial.href}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white dark:bg-white dark:text-black dark:focus-visible:outline-white"
              >
                {/* Animated Shine Effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <i
                  className="fi dark:text-black text-white fi-rr-envelope relative z-10"
                  aria-hidden
                />
                <span className="relative z-10 text-white dark:text-black">
                  {emailSocial.value}
                </span>
              </a>
            ) : null}

            <a
              href={portfolio.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-black bg-transparent px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white dark:hover:text-black dark:focus-visible:outline-white"
            >
              <i
                className="fi fi-rr-document relative z-10 transition-colors duration-300 group-hover:text-white"
                aria-hidden
              />
              <span className="relative z-10 hover:text-white">Resume</span>
            </a>
          </div>

          <motion.nav
            aria-label="Footer navigation"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.15,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 flex flex-wrap items-center gap-2"
          >
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative overflow-hidden rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-border/70 hover:bg-accent/80 hover:text-foreground hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {/* soft glow layer */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* moving shine effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </motion.nav>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 h-px w-full origin-left bg-border/50"
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="relative grid size-10 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-card/60">
              <Image
                src="/my-picture.png"
                alt={`${portfolio.name} portrait`}
                fill
                sizes="40px"
                className="object-cover object-top"
              />
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                {portfolio.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {portfolio.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {footerSocials.map((social) => (
              <a
                key={social.kind}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="group relative grid size-10 place-items-center rounded-full border border-border/60 bg-card/40 text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  {social.label}
                </span>

                {social.kind === 'fiverr' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5 text-foreground transition-colors duration-300 group-hover:text-background" aria-hidden>
                    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.83-.487l1.425.4c-.351.848-1.22 1.364-2.255 1.364-1.748 0-2.549-1.355-2.549-2.515 0-1.14.703-2.505 2.45-2.505 1.856 0 2.471 1.384 2.471 2.408 0 .224-.01.37-.02.477zm-1.562-.945c-.04-.42-.342-.81-.889-.81-.508 0-.81.225-.908.81h1.797zM7.508 15.44h1.416l1.767-4.874h-1.62l-.86 2.837-.878-2.837H5.72l1.787 4.874zm-6.6 0H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z"/>
                  </svg>
                ) : social.kind === 'upwork' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-foreground transition-colors duration-300 group-hover:text-background" aria-hidden>
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                  </svg>
                ) : (
                  <i
                    className={cn(
                      'fi text-base text-foreground transition-colors duration-300 group-hover:text-background',
                      socialIconMap[social.kind as keyof typeof socialIconMap],
                    )}
                    aria-hidden
                  />
                )}
              </a>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={handleBackToTop}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <i className="fi fi-rr-arrow-up" aria-hidden />
            Back to top
          </motion.button>
        </motion.div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
