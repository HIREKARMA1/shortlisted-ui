/** Public home copy, navigation, and access labels. Rules match the server: no day countdown. */

export const homeTokens = {
  blue: '#1b52a4',
  sky: '#00a2e5',
  yellow: '#fec40d',
  orange: '#f58020',
  red: '#d64246',
  green: '#098855',
  bg: '#F7F9FC',
  surface: '#FFFFFF',
  ink: '#0B1B33',
  muted: '#5B6B82',
  border: '#E5EAF2',
} as const;

export const homeTokenVars: Record<string, string> = {
  '--brand-blue': homeTokens.blue,
  '--brand-sky': homeTokens.sky,
  '--brand-yellow': homeTokens.yellow,
  '--brand-orange': homeTokens.orange,
  '--brand-red': homeTokens.red,
  '--brand-green': homeTokens.green,
  '--bg': homeTokens.bg,
  '--surface': homeTokens.surface,
  '--ink': homeTokens.ink,
  '--muted': homeTokens.muted,
  '--border': homeTokens.border,
};

export type FeatureAccess = 'signIn' | 'fullPlan' | 'public';
export type Tone = 'blue' | 'sky' | 'yellow' | 'orange' | 'green';

export type HomeFeature = {
  id: string;
  title: string;
  caption: string;
  description: string;
  href: string;
  access: FeatureAccess;
  tone: Tone;
  group: 'explore' | 'student' | 'both';
};

export const ctaLabel = 'Try for Free';

/**
 * Seasonal Diwali Hero Window (IST / Asia/Kolkata timezone)
 * Start: 2026-11-02T00:00:00+05:30
 * End: 2026-11-12T23:59:59+05:30 (Diwali 2026 is on 8 November)
 */
export const DIWALI_THEME_START = '2026-11-02T00:00:00+05:30';
export const DIWALI_THEME_END = '2026-11-12T23:59:59+05:30';

export const seasonalHero = {
  id: 'diwali-2026',
  enabled: true, // Master switch: set to false to disable Diwali hero and show normal hero
  startDate: '2026-11-02',
  endDate: '2026-11-12',
  startIso: DIWALI_THEME_START,
  endIso: DIWALI_THEME_END,
};

/** Local-calendar date check used by the Diwali offer popup. */
export function isSeasonalHeroLocalDateActive(date = new Date()): boolean {
  const localDate = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  return seasonalHero.enabled && localDate >= seasonalHero.startDate && localDate <= seasonalHero.endDate;
}

/**
 * Checks whether the Diwali seasonal hero should be rendered.
 * Evaluates against the exact ISO timestamp in IST (+05:30).
 * Supports QA query override: ?theme=diwali or ?theme=default (or ?theme=normal).
 */
export function isSeasonalHeroActive(queryTheme?: string | null): boolean {
  if (queryTheme === 'diwali') return true;
  if (queryTheme === 'default' || queryTheme === 'normal') return false;

  if (!seasonalHero.enabled) return false;

  const nowMs = Date.now();
  const startMs = Date.parse(DIWALI_THEME_START);
  const endMs = Date.parse(DIWALI_THEME_END);
  return nowMs >= startMs && nowMs <= endMs;
}

export const categories: HomeFeature[] = [
  {
    id: 'trial',
    title: 'Free trial page',
    caption: 'Look around first',
    description: 'Sign in and walk through the 60-day journey, trainers, and class topics.',
    href: '/free-trial',
    access: 'signIn',
    tone: 'blue',
    group: 'both',
  },
  {
    id: 'profile',
    title: 'Profile & resume',
    caption: 'Step 1 of the journey',
    description: 'Build an industry-ready profile and resume with guidance from your coordinator.',
    href: '/free-trial',
    access: 'signIn',
    tone: 'sky',
    group: 'student',
  },
  {
    id: 'jobs',
    title: 'Matched jobs',
    caption: 'Step 2 of the journey',
    description: 'See live jobs matched to your skill profile once your batch opens them.',
    href: '/subscribe',
    access: 'fullPlan',
    tone: 'yellow',
    group: 'student',
  },
  {
    id: 'applications',
    title: 'Applications',
    caption: 'Step 3 of the journey',
    description: 'Track shortlists, interview rounds, and offers in one shared pipeline.',
    href: '/subscribe',
    access: 'fullPlan',
    tone: 'orange',
    group: 'student',
  },
  {
    id: 'classes',
    title: 'Classes',
    caption: 'Step 4 of the journey',
    description: 'Join live cohort sessions with experienced mentors who answer your questions.',
    href: '/subscribe',
    access: 'fullPlan',
    tone: 'blue',
    group: 'student',
  },
  {
    id: 'assessments',
    title: 'Assessments',
    caption: 'Step 5 of the journey',
    description: 'Practice skill checks and receive written feedback before real interviews.',
    href: '/subscribe',
    access: 'fullPlan',
    tone: 'green',
    group: 'student',
  },
];

export type Trainer = {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: string;
  studentsGuided: string;
  focus: string[];
  photo: string;
};

export const trainers: Trainer[] = [
  {
    id: 'ashish',
    name: 'Ashish Gupta',
    role: 'Ex-Cognizant Tech Lead',
    experience: '12+ yrs exp',
    rating: '4.9/5',
    studentsGuided: '4,200+ students',
    focus: ['System design', 'Full-stack development', 'Interview readiness'],
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rahul',
    name: 'Rahul Sen',
    role: 'Ex-Amazon Senior SDE',
    experience: '10+ yrs exp',
    rating: '4.95/5',
    studentsGuided: '3,800+ students',
    focus: ['Algorithms & DSA', 'Backend scale', 'Competitive coding'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ankita',
    name: 'Ankita Saxena',
    role: 'Senior Product Specialist',
    experience: '8+ yrs exp',
    rating: '4.85/5',
    studentsGuided: '2,900+ students',
    focus: ['Behavioral prep', 'Resume precision', 'Executive presence'],
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  },
];

export const journeyStages = [
  {
    step: 1,
    title: 'Onboarding & Profile',
    shortTitle: 'Profile',
    outcome: 'Structured profile + coordinator orientation',
    description: 'Set up your placement profile and connect directly with your dedicated coordinator.',
  },
  {
    step: 2,
    title: 'Skill Assessment',
    shortTitle: 'Assess',
    outcome: 'Baseline scores across coding and communication',
    description: 'Take targeted baseline assessments to identify exact readiness gaps.',
  },
  {
    step: 3,
    title: 'Mentor Sessions',
    shortTitle: 'Learn',
    outcome: 'Cohort classes, system design, mock interviews',
    description: 'Attend focused live cohort sessions with senior industry engineering mentors.',
  },
  {
    step: 4,
    title: 'Job Matching',
    shortTitle: 'Match',
    outcome: 'Curated roles matching your verified skills',
    description: 'Access curated openings matched directly to your profile and assessment strengths.',
  },
  {
    step: 5,
    title: 'Interview Drives',
    shortTitle: 'Interview',
    outcome: 'Scheduled interviews with tracking desk support',
    description: 'Participate in company interview rounds with end-to-end coordinator support.',
  },
  {
    step: 6,
    title: 'Offer & Onboarding',
    shortTitle: 'Offer',
    outcome: 'Offer negotiation and corporate onboarding guidance',
    description: 'Receive offer guidance and structured corporate transition assistance.',
  },
] as const;

export const plans = {
  trial: {
    eyebrow: 'START YOUR PLACEMENT JOURNEY',
    name: 'Your first step to getting hired, free',
    priceLabel: 'No charge',
    note: 'for 7 days',
    items: [
      'Apply to a real job and get noticed by recruiters',
      'Take an assessment and discover your strengths',
      'Practise a mock interview and build real confidence',
      'Join a live class and learn from the experts',
    ],
    description: 'Try one of each and see how Shortlisted gets you interview-ready. No payment needed during your free trial.',
    cta: 'Start My Free Trial',
  },
  full: {
    name: 'AI Virtual Placement Cell',
    note: 'One-time',
    ribbon: 'Unlocks jobs',
    items: ['AI-matched jobs', 'Application tracking', 'Classes and assessments', 'Batch of up to 12', 'Dedicated coordinator'],
  },
} as const;

export const faqs = [
  {
    id: 'what',
    q: 'What is Shortlisted?',
    a: 'A placement cell for students. You join a small batch, then use jobs, classes, and a coordinator.',
  },
  {
    id: 'before',
    q: 'What can I use before I pay?',
    a: 'Sign in and open the free trial page at no charge. It is a 60-day journey, not a countdown.',
  },
  {
    id: 'jobs',
    q: 'When do jobs unlock?',
    a: 'After the one-time subscription. Until then, jobs, classes, and the dashboard stay closed.',
  },
  {
    id: 'batch',
    q: 'How does a batch work?',
    a: 'Each batch holds up to 12 students and includes a coordinator focused on that group.',
  },
  {
    id: 'refund',
    q: 'Can I get a refund?',
    a: 'Terms are shown at checkout. Write to support before you pay if you want them explained.',
  },
  {
    id: 'support',
    q: 'How do I get help?',
    a: 'Reach our team anytime via the support page or email. We assist before and after you subscribe.',
  },
] as const;

export const searchPages = [
  { label: 'Create account', href: '/auth/register', hint: 'Sign up' },
  { label: 'Sign in', href: '/auth/login', hint: 'Students and staff' },
  { label: 'Subscribe', href: '/subscribe', hint: 'One-time plan' },
  { label: 'About', href: '/about', hint: 'Company' },
  { label: 'Contact', href: '/contact', hint: 'Write to us' },
];

export const footerLinks = [
  { label: 'Free trial page', href: '/free-trial' },
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Support', href: '/support' },
] as const;

export const contactEmail = 'info@hirekarma.in';
