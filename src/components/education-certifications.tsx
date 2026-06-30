'use client';

import { motion, type Variants } from 'framer-motion';
import {
  Shield,
  BadgeCheck,
  Target,
  Bug,
  Lock,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { portfolio } from '@/config/portfolio';

type IconKey = 'shield' | 'badgecheck' | 'target' | 'bug' | 'lock' | 'award';

const certificationIconMap: Record<IconKey, typeof Shield> = {
  shield: Shield,
  badgecheck: BadgeCheck,
  target: Target,
  bug: Bug,
  lock: Lock,
  award: Award,
};

const getCertificationIcon = (name: string): typeof Shield => {
  const lowerName = name.toLowerCase();

  if (
    lowerName.includes('penetration') ||
    lowerName.includes('pentest') ||
    lowerName.includes('hacking')
  ) {
    return certificationIconMap.target;
  }
  if (lowerName.includes('threat')) {
    return certificationIconMap.bug;
  }
  if (lowerName.includes('cybersecurity') || lowerName.includes('security')) {
    return certificationIconMap.lock;
  }
  if (lowerName.includes('react') || lowerName.includes('python')) {
    return certificationIconMap.award;
  }
  return certificationIconMap.badgecheck;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const shimmerVariants: Variants = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export function EducationCertifications() {
  return (
    <section id="education-certifications" className="w-full py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="mx-auto max-w-375 px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Education & Certifications
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Academic foundation combined with industry-recognized cybersecurity
              and software engineering credentials.
            </p>
          </motion.div>
        </div>

        {/* Main Timeline Grid */}
        <div className="mx-auto w-full max-w-375 px-0">
          {/* Desktop: Two Column Layout */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:gap-12 lg:gap-16">
            {/* Left Column: Education Timeline */}
            <motion.div
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-0"
            >
              <div className="relative space-y-10 pl-8">
                {/* Vertical Timeline Line */}
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary to-transparent"
                />

                {/* Education Items */}
                {portfolio.education.map((edu, index) => (
                  <motion.div
                    key={`${edu.title}-${edu.from}`}
                    variants={itemVariants}
                    className="group relative"
                  >
                    {/* Timeline Node */}
                    <motion.div
                      className="absolute -left-8 top-1.5 flex size-5 items-center justify-center"
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="relative">
                        {index === 0 && (
                          <motion.div
                            variants={pulseVariants}
                            initial="initial"
                            animate="animate"
                            className="absolute inset-0 rounded-full bg-primary/30"
                          />
                        )}
                        <div className="relative size-5 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-lg shadow-primary/20">
                          <motion.div
                            className="size-2.5 rounded-full bg-primary"
                            whileHover={{ scale: 1.2 }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      className="rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-all group-hover:border-primary/40 group-hover:bg-card/80"
                      whileHover={{ y: -2 }}
                    >
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground text-base">
                          {edu.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {edu.subtitle}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-primary/70 font-medium">
                        <span>
                          {edu.from}
                          {edu.to ? ` — ${edu.to}` : ''}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Certifications Timeline */}
            <motion.div
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-0"
            >
              <div className="relative space-y-6 pl-8">
                {/* Vertical Timeline Line */}
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute left-2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary/50 via-primary/30 to-transparent"
                />

                {/* Certifications Items */}
                {portfolio.certifications.map((cert) => {
                  const IconComponent = getCertificationIcon(cert.name);

                  return (
                    <motion.div
                      key={`${cert.name}-${cert.year}`}
                      variants={itemVariants}
                      className="group relative"
                    >
                      {/* Timeline Node */}
                      <motion.div
                        className="absolute -left-8 top-1 flex size-4 items-center justify-center"
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <div className="relative size-4 rounded-full border border-primary/50 bg-background/80 flex items-center justify-center shadow-md shadow-primary/10">
                          <motion.div
                            className="size-1.5 rounded-full bg-primary"
                            whileHover={{ scale: 1.3 }}
                          />
                        </div>
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        className="rounded-lg border border-border/40 bg-background/40 p-3.5 backdrop-blur-sm transition-all group-hover:border-primary/50 group-hover:bg-background/70"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <motion.div
                            className="mt-0.5 shrink-0"
                            whileHover={{ rotate: 6 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <IconComponent className="size-5 text-primary stroke-[1.5]" />
                          </motion.div>

                          {/* Text Content */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm leading-5">
                              {cert.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {cert.issuer} • {cert.year}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-muted-foreground/80">
                              {cert.summary}
                            </p>

                            {/* Credential Link */}
                            <motion.a
                              href={cert.href}
                              target="_blank"
                              rel="noreferrer"
                              className="group/link mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 transition-colors hover:text-primary"
                              whileHover={{ x: 2 }}
                            >
                              <span>Verify Credential</span>
                              <motion.span
                                className="inline-block"
                                whileHover={{ x: 2 }}
                              >
                                <ArrowUpRight className="size-3" />
                              </motion.span>
                            </motion.a>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Tablet: Stacked Layout */}
          <div className="hidden sm:block md:hidden">
            <div className="space-y-12">
              {/* Education Section */}
              <motion.div
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="mb-6 text-xl font-semibold text-foreground">
                  Education
                </h3>
                <div className="space-y-6 pl-8 relative">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary to-transparent"
                  />

                  {portfolio.education.map((edu) => (
                    <motion.div
                      key={`${edu.title}-${edu.from}`}
                      variants={itemVariants}
                      className="group relative"
                    >
                      <motion.div
                        className="absolute -left-8 top-1.5 flex size-5 items-center justify-center"
                        whileHover={{ scale: 1.3 }}
                      >
                        <div className="relative size-5 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-lg shadow-primary/20">
                          <motion.div
                            className="size-2.5 rounded-full bg-primary"
                            whileHover={{ scale: 1.2 }}
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        className="rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-all group-hover:border-primary/40 group-hover:bg-card/80"
                        whileHover={{ y: -2 }}
                      >
                        <h4 className="font-semibold text-foreground">{edu.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {edu.subtitle}
                        </p>
                        <p className="mt-3 text-xs text-primary/70 font-medium">
                          {edu.from}
                          {edu.to ? ` — ${edu.to}` : ''}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications Section */}
              <motion.div
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="mb-6 text-xl font-semibold text-foreground">
                  Certifications
                </h3>
                <div className="space-y-4 pl-8 relative">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute left-2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary/50 via-primary/30 to-transparent"
                  />

                  {portfolio.certifications.map((cert) => {
                    const IconComponent = getCertificationIcon(cert.name);

                    return (
                      <motion.div
                        key={`${cert.name}-${cert.year}`}
                        variants={itemVariants}
                        className="group relative"
                      >
                        <motion.div
                          className="absolute -left-8 top-1 flex size-4 items-center justify-center"
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="relative size-4 rounded-full border border-primary/50 bg-background/80 flex items-center justify-center shadow-md shadow-primary/10">
                            <motion.div
                              className="size-1.5 rounded-full bg-primary"
                              whileHover={{ scale: 1.3 }}
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          className="rounded-lg border border-border/40 bg-background/40 p-3.5 backdrop-blur-sm transition-all group-hover:border-primary/50 group-hover:bg-background/70"
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-start gap-3">
                            <motion.div
                              className="mt-0.5 shrink-0"
                              whileHover={{ rotate: 6 }}
                            >
                              <IconComponent className="size-5 text-primary stroke-[1.5]" />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-foreground text-sm">
                                {cert.name}
                              </h4>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {cert.issuer} • {cert.year}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-muted-foreground/80">
                                {cert.summary}
                              </p>
                              <motion.a
                                href={cert.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group/link mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 transition-colors hover:text-primary"
                                whileHover={{ x: 2 }}
                              >
                                <span>Verify Credential</span>
                                <motion.span whileHover={{ x: 2 }}>
                                  <ArrowUpRight className="size-3" />
                                </motion.span>
                              </motion.a>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Mobile: Single Column Centered */}
          <div className="sm:hidden">
            <div className="space-y-12">
              {/* Education */}
              <motion.div
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="mb-6 text-lg font-semibold text-foreground">
                  Education
                </h3>
                <div className="space-y-6 pl-8 relative">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary to-transparent"
                  />

                  {portfolio.education.map((edu) => (
                    <motion.div
                      key={`${edu.title}-${edu.from}`}
                      variants={itemVariants}
                      className="group relative"
                    >
                      <motion.div
                        className="absolute -left-8 top-1.5 flex size-5 items-center justify-center"
                        whileHover={{ scale: 1.3 }}
                      >
                        <div className="relative size-5 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-lg shadow-primary/20">
                          <motion.div className="size-2.5 rounded-full bg-primary" />
                        </div>
                      </motion.div>

                      <motion.div
                        className="rounded-lg border border-border/40 bg-card/50 p-3 backdrop-blur-sm"
                        whileHover={{ y: -2 }}
                      >
                        <h4 className="font-semibold text-foreground text-sm">
                          {edu.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.subtitle}
                        </p>
                        <p className="mt-2 text-xs text-primary/70 font-medium">
                          {edu.from}
                          {edu.to ? ` — ${edu.to}` : ''}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="mb-6 text-lg font-semibold text-foreground">
                  Certifications
                </h3>
                <div className="space-y-4 pl-8 relative">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute left-2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary/50 via-primary/30 to-transparent"
                  />

                  {portfolio.certifications.map((cert) => {
                    const IconComponent = getCertificationIcon(cert.name);

                    return (
                      <motion.div
                        key={`${cert.name}-${cert.year}`}
                        variants={itemVariants}
                        className="group relative"
                      >
                        <motion.div className="absolute -left-8 top-1 flex size-4 items-center justify-center">
                          <div className="relative size-4 rounded-full border border-primary/50 bg-background/80 flex items-center justify-center shadow-md shadow-primary/10">
                            <motion.div className="size-1.5 rounded-full bg-primary" />
                          </div>
                        </motion.div>

                        <motion.div
                          className="rounded-lg border border-border/40 bg-background/40 p-3 backdrop-blur-sm"
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-start gap-2">
                            <motion.div className="mt-0.5 shrink-0">
                              <IconComponent className="size-4 text-primary stroke-[1.5]" />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-foreground text-xs leading-4">
                                {cert.name}
                              </h4>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {cert.issuer} • {cert.year}
                              </p>
                              <p className="mt-1.5 text-xs leading-4 text-muted-foreground/80">
                                {cert.summary}
                              </p>
                              <motion.a
                                href={cert.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group/link mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary/80 transition-colors hover:text-primary"
                                whileHover={{ x: 1 }}
                              >
                                <span>Verify</span>
                                <ArrowUpRight className="size-2.5" />
                              </motion.a>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
