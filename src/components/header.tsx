'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { useTheme } from '@/components/theme-provider';
import { portfolio } from '@/config/portfolio';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Publications', href: '#publications' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileMenuOpen(false);
    } else {
      setHidden(false);
    }
  });

  // Active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' },
    );

    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean);

    sections.forEach((section) => observer.observe(section!));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <motion.header
      id="site-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.25, 0.4, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3"
    >

      <motion.nav
        className={cn(
          'header-glass-shell mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3',
          isScrolled && 'is-scrolled',
          mobileMenuOpen && 'is-open',
        )}
        animate={{
          y: isScrolled ? 0 : 4,
          scale: isScrolled ? 0.985 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
      >

        <div className="w-full pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem] mx-auto">
          <motion.div
            className="header-sweep"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: ['-100%', '250%'],
                    rotate: 18,
                  }
            }
            transition={{
              duration: 7,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>

        {/* Logo / Name */}
        <motion.a
          href="#home"
          onClick={() => setMobileMenuOpen(false)}
          className="group relative z-10 flex min-w-0 items-center gap-3 rounded-full px-1 py-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="brand-mark relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[1rem] border border-white/30 bg-background/45 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            <motion.span
              className="brand-orbit"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
            <Image
              src="/my-picture.png"
              alt={`${portfolio.name} logo`}
              fill
              sizes="36px"
              className="relative z-10 object-cover object-top"
              priority
            />
          </span>
          <div className="relative min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-[0.95rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.05rem]">
                {portfolio.name.split(' ')[0]}
              </span>
              <span className="font-serif text-[0.95rem] font-normal tracking-[-0.02em] text-foreground/70 sm:text-[1.05rem]">
                {portfolio.name.split(' ').slice(1).join(' ')}
              </span>
            </div>
            <p className="hidden max-w-[13.5rem] truncate text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground/90 sm:block">
              {portfolio.role}
            </p>
          </div>
          <motion.div
            className="absolute -bottom-1 left-14 h-px origin-left bg-gradient-to-r from-foreground/75 via-foreground/25 to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ width: 'calc(100% - 3.5rem)' }}
          />
        </motion.a>

        {/* Desktop Navigation */}
        <div className="relative z-10 hidden items-center gap-2 md:flex">
          <div className="header-nav-track flex items-center gap-1 rounded-full p-1">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.08,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className={cn(
                  'group relative rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring/70',
                  activeSection === link.href.slice(1)
                    ? 'text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-3 bottom-1 h-px scale-x-0 bg-gradient-to-r from-transparent via-foreground/50 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-full border border-white/20 bg-foreground/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_22px_rgba(0,0,0,0.08)]"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="header-icon-button group relative grid size-10 place-items-center overflow-hidden rounded-[1rem] border border-white/20 bg-background/35 shadow-[0_10px_24px_rgba(0,0,0,0.08)] outline-none transition-all duration-300 hover:bg-background/45 focus-visible:ring-2 focus-visible:ring-ring/70"
            whileHover={{ scale: 1.05, rotate: 4 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="size-4 text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -90, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="size-4 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu Controls */}
        <div className="relative z-10 flex items-center gap-2 md:hidden">
          <motion.button
            onClick={toggleTheme}
            className="header-icon-button grid size-10 place-items-center rounded-[1rem] border border-white/20 bg-background/35 shadow-[0_10px_24px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="size-4 text-foreground" />
            ) : (
              <Moon className="size-4 text-foreground" />
            )}
          </motion.button>

          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="header-icon-button grid size-10 place-items-center rounded-[1rem] border border-white/20 bg-background/35 shadow-[0_10px_24px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="size-4 text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="size-4 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="header-mobile-panel mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.35rem] md:hidden"
          >
            <div className="relative z-10 space-y-2 p-3">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'group relative flex items-center justify-between overflow-hidden rounded-[1rem] border border-transparent px-4 py-3 text-base font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring/70',
                    activeSection === link.href.slice(1)
                      ? 'border-white/20 bg-foreground/[0.07] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'text-muted-foreground hover:border-white/15 hover:bg-background/35 hover:text-foreground',
                  )}
                >
                  <span>{link.label}</span>
                  <span className="size-1.5 rounded-full bg-foreground/25 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
