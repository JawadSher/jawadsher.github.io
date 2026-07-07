export type SocialLink = {
  label: string;
  value: string;
  href: string;
  kind:
    | 'github'
    | 'linkedin'
    | 'x'
    | 'youtube'
    | 'medium'
    | 'email'
    | 'whatsapp'
    | 'resume'
    | 'fiverr'
    | 'upwork';
};

export type TimelineItem = {
  title: string;
  subtitle: string;
  from: string;
  to?: string;
  href?: string;
  description?: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  href: string;
  summary: string;
};

export const portfolio = {
  githubUsername: 'JawadSher',
  name: 'Jawad Sher',
  role: 'Full Stack Web Developer & Software Engineer',
  location: 'Pakistan',
  availability: 'Open to freelance, product, and security-focused web work',
  summary:
    'I build full-stack web applications with Next.js, TypeScript, GraphQL, Redis, Kafka, AWS, and modern product workflows, with a security mindset shaped by hands-on penetration testing practice.',
  seo: {
    title: 'Jawad Sher | Full Stack Web Developer and Penetration Tester',
    description:
      'Portfolio of Jawad Sher, a full stack web developer and penetration tester focused on Next.js, TypeScript, cloud-native apps, and practical security.',
  },
  resumeUrl:
    'https://drive.google.com/file/d/1-11EEao0hYzGJl7pKFRLogCZFy6yAc3e/view?usp=sharing',
  projectSettings: {
    limit: 12,
    excludeForks: true,
    excludedRepositories: [
      'JawadSher/JawadSher.github.io',
      'JawadSher/JawadSher',
    ],
  },
  socials: [
    {
      label: 'GitHub',
      value: 'JawadSher',
      href: 'https://github.com/JawadSher',
      kind: 'github',
    },
    {
      label: 'LinkedIn',
      value: 'jawadsh3r',
      href: 'https://www.linkedin.com/in/jawadsh3r',
      kind: 'linkedin',
    },
    {
      label: 'X',
      value: 'jawadsh3r',
      href: 'https://x.com/jawadsh3r',
      kind: 'x',
    },
    {
      label: 'YouTube',
      value: 'jawad_sher',
      href: 'https://www.youtube.com/@jawad_sher',
      kind: 'youtube',
    },
    {
      label: 'Medium',
      value: 'jawadsher',
      href: 'https://medium.com/@jawadsher',
      kind: 'medium',
    },
    {
      label: 'Fiverr',
      value: 'jawadsh3r',
      href: 'https://www.fiverr.com/jawadsh3r?public_mode=true',
      kind: 'fiverr',
    },
    {
      label: 'Upwork',
      value: 'Jawad Sher',
      href: 'https://www.upwork.com/freelancers/~01bec04f10ad4f0f13?mp_source=share',
      kind: 'upwork',
    },
    {
      label: 'Email',
      value: 'jawadsher05@gmail.com',
      href: 'mailto:jawadsher05@gmail.com',
      kind: 'email',
    },
    {
      label: 'WhatsApp',
      value: '+923481916077',
      href: 'https://wa.me/923481916077',
      kind: 'whatsapp',
    },
    {
      label: 'Resume',
      value: 'View resume',
      href: 'https://drive.google.com/file/d/1-11EEao0hYzGJl7pKFRLogCZFy6yAc3e/view?usp=sharing',
      kind: 'resume',
    },
  ] satisfies SocialLink[],
  skillGroups: [
    {
      name: 'Frontend',
      skills: [
        'TypeScript',
        'React',
        'Next.js',
        'React Native',
        'Tailwind CSS',
        'shadcn/ui',
        'Radix UI',
      ],
    },
    {
      name: 'Backend',
      skills: [
        'Node.js',
        'Express.js',
        'NestJS',
        'GraphQL',
        'Apollo',
        'REST APIs',
        'JWT',
        'OAuth',
      ],
    },
    {
      name: 'Data and Cloud',
      skills: [
        'PostgreSQL',
        'MongoDB',
        'MySQL',
        'Redis',
        'Kafka',
        'AWS',
        'Docker',
        'Cloudflare',
      ],
    },
    {
      name: 'Security',
      skills: [
        'Penetration Testing',
        'Threat Hunting',
        'Vulnerability Management',
        'TryHackMe Labs',
        'Web Security',
      ],
    },
  ],
  experience: [
    {
      title: 'Full Stack Web Developer',
      subtitle: 'Self Employed',
      from: '2025',
      to: 'Present',
      href: 'https://github.com/JawadSher',
      description:
        'Building production-minded web applications, APIs, dashboards, and portfolio systems with modern React and cloud-native tooling.',
    },
  ] satisfies TimelineItem[],
  education: [
    {
      title: 'BS Software Engineering',
      subtitle: 'Virtual University of Pakistan',
      from: '2026',
      to: 'Present',
    },
    {
      title: 'Intermediate Computer Science',
      subtitle: 'Govt Higher Secondary School, Pakistan',
      from: '2021',
      to: '2023',
    },
  ] satisfies TimelineItem[],
  certifications: [
    {
      name: 'Ethical Hacking and Penetration Testing',
      issuer: 'Udemy',
      year: 'June 2025',
      href: 'https://www.udemy.com',
      summary:
        'Completed a full course on ethical hacking and penetration testing methods.',
    },
    {
      name: 'Jr Penetration Tester',
      issuer: 'TryHackMe',
      year: '2024',
      href: 'https://tryhackme.com/path/outline/jrpenetrationtester',
      summary: 'Certificate ID: THM-3UWACP3VSQ.',
    },
    {
      name: 'CompTIA Pentest+',
      issuer: 'TryHackMe',
      year: '2024',
      href: 'https://tryhackme.com/path/outline/pentestplus',
      summary: 'Certificate ID: THM-AQ5ST9SPZZ.',
    },
    {
      name: 'Red Teaming',
      issuer: 'TryHackMe',
      year: '2024',
      href: 'https://tryhackme.com/path/outline/redteaming',
      summary: 'Certificate ID: THM-OD9LMCG5VF.',
    },
    {
      name: 'Offensive Pentesting',
      issuer: 'TryHackMe',
      year: '2024',
      href: 'https://tryhackme.com/path/outline/pentesting',
      summary: 'Certificate ID: THM-SXEJHJXXIQ.',
    },
    {
      name: 'Complete Beginner',
      issuer: 'TryHackMe',
      year: '2024',
      href: 'https://tryhackme.com/path/outline/beginner',
      summary: 'Certificate ID: THM-INYFQTVEAB.',
    },
    {
      name: 'Web Fundamentals',
      issuer: 'TryHackMe',
      year: '2024',
      href: 'https://tryhackme.com/path/outline/web',
      summary: 'Certificate ID: THM-XACNBF0E0N.',
    },
    {
      name: 'Certified in Cybersecurity Training',
      issuer: 'ISC2',
      year: 'January 2024',
      href: 'https://www.isc2.org/certifications/cc',
      summary: 'Completed the official ISC2 CC online self-paced training.',
    },
    {
      name: 'Ethical Hacking Essentials',
      issuer: 'EC-Council CodeRed',
      year: 'May 2023',
      href: 'https://codered.eccouncil.org',
      summary: 'Certificate of Achievement #222249.',
    },
    {
      name: 'Introduction to Threat Hunting',
      issuer: 'Security Blue Team',
      year: 'May 2023',
      href: 'https://www.securityblue.team',
      summary: 'Certificate #661310153.',
    },
    {
      name: 'Introduction to Vulnerability Management',
      issuer: 'Security Blue Team',
      year: 'May 2023',
      href: 'https://www.securityblue.team',
      summary: 'Certificate #956053373.',
    },
    {
      name: 'React and Redux Certification',
      issuer: 'KG Coding',
      year: '2023',
      href: 'https://www.youtube.com',
      summary: 'Completed React and Redux certification test by Prashant Jain.',
    },
    {
      name: 'Python Basic',
      issuer: 'HackerRank',
      year: 'August 2024',
      href: 'https://www.hackerrank.com/certificates',
      summary: 'Passed the Python Basic assessment.',
    },
  ] satisfies Certification[],
};
