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

export const ctaLabel = 'Start free trial';

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
    caption: 'Stand out clearly',
    description: 'Add your skills and resume so every application shows a complete profile.',
    href: '/dashboard/student/profile',
    access: 'fullPlan',
    tone: 'sky',
    group: 'student',
  },
  {
    id: 'jobs',
    title: 'Matched jobs',
    caption: 'Roles for your batch',
    description: 'See jobs picked for your batch after your one-time plan is active.',
    href: '/dashboard/student/jobs',
    access: 'fullPlan',
    tone: 'yellow',
    group: 'student',
  },
  {
    id: 'applications',
    title: 'Applications',
    caption: 'Track every step',
    description: 'Follow status, interviews, and offers from one calm applications list.',
    href: '/dashboard/student/applications',
    access: 'fullPlan',
    tone: 'orange',
    group: 'student',
  },
  {
    id: 'classes',
    title: 'Classes',
    caption: 'Learn with your batch',
    description: 'Join batch classes and keep your attendance in the same place.',
    href: '/dashboard/student/classes',
    access: 'fullPlan',
    tone: 'green',
    group: 'student',
  },
  {
    id: 'assessments',
    title: 'Assessments',
    caption: 'Know where you stand',
    description: 'Take batch assessments and see how ready you are for interviews.',
    href: '/dashboard/student/assessments',
    access: 'fullPlan',
    tone: 'blue',
    group: 'student',
  },
  {
    id: 'batch',
    title: 'Batch of 12',
    caption: 'Small on purpose',
    description: 'Subscribe and join a batch of up to 12 with a dedicated coordinator.',
    href: '/subscribe',
    access: 'fullPlan',
    tone: 'sky',
    group: 'explore',
  },
  {
    id: 'support',
    title: 'Support',
    caption: 'We are here',
    description: 'Ask for help anytime. Support stays open even before you subscribe.',
    href: '/support',
    access: 'public',
    tone: 'yellow',
    group: 'explore',
  },
  {
    id: 'plans',
    title: 'Plans',
    caption: 'Simple pricing',
    description: 'View the free trial page, then the one-time plan that unlocks jobs.',
    href: '#plans',
    access: 'public',
    tone: 'orange',
    group: 'explore',
  },
  {
    id: 'faq',
    title: 'FAQ',
    caption: 'Quick answers',
    description: 'See what opens after sign-in and what waits for your subscription.',
    href: '#faq',
    access: 'public',
    tone: 'green',
    group: 'explore',
  },
];

export const exploreNav = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'trial', label: 'Free trial page', href: '/free-trial', access: 'signIn' as const },
  { id: 'plans', label: 'Plans', href: '#plans' },
  { id: 'support', label: 'Support', href: '/support' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

export const studentNav = categories.filter((item) =>
  ['profile', 'jobs', 'applications', 'classes', 'assessments'].includes(item.id),
);

export const howSteps = [
  { id: 'account', title: 'Create account', line: 'Sign up with email. No payment yet.', tip: 'Your account starts here, before any payment.' },
  { id: 'trial', title: 'Open the free trial page', line: 'See the 60-day journey after sign-in.', tip: 'Trainers, class topics, and the journey. No charge.' },
  { id: 'profile', title: 'Build your profile', line: 'Add skills and upload your resume.', tip: 'A complete profile travels with every application.' },
  { id: 'subscribe', title: 'Subscribe once', line: 'Unlock jobs, classes, and your batch.', tip: 'One payment opens the full placement cell.' },
] as const;

export const carousel = [
  { id: 'trial', title: 'Open the free trial page', line: 'See the journey before you pay.', featureId: 'trial', tone: 'blue' as Tone },
  { id: 'profile', title: 'Build your profile', line: 'Skills and resume, ready to send.', featureId: 'profile', tone: 'sky' as Tone },
  { id: 'jobs', title: 'AI-matched jobs', line: 'Roles chosen for your batch.', featureId: 'jobs', tone: 'orange' as Tone },
  { id: 'batch', title: 'Join a batch of 12', line: 'A coordinator stays with your group.', featureId: 'batch', tone: 'green' as Tone },
] as const;

export const trustChips = ['Batch of 12', 'Dedicated coordinator', 'AI-matched jobs'] as const;

export const plans = {
  trial: {
    name: 'Free trial page',
    priceLabel: 'No charge',
    note: 'After you sign in',
    items: ['60-day journey overview', 'Trainers and class topics', 'No payment to view', 'Jobs open with the full plan'],
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
] as const;

export const searchPages = [
  { label: 'Create account', href: '/auth/register', hint: 'Sign up' },
  { label: 'Sign in', href: '/auth/login', hint: 'Students and staff' },
  { label: 'Subscribe', href: '/subscribe', hint: 'One-time plan' },
  { label: 'About', href: '/about', hint: 'Company' },
  { label: 'Contact', href: '/contact', hint: 'Write to us' },
];

export const footerLinks = [
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Support', href: '/support' },
] as const;

export const contactEmail = 'info@hirekarma.in';
export const sidebarStorageKey = 'sl-sidebar-collapsed';
