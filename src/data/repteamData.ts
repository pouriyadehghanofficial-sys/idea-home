export interface ClientLogo {
  id: string;
  name: string;
  subtitle: string;
}

export interface FeatureItem {
  id: string;
  iconName: 'Award' | 'Zap' | 'Target' | 'Cpu' | 'Layers' | 'BarChart3';
  title: string;
  description: string;
  tag: string;
}

export interface SolutionItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  metrics: string;
  deliverables: string[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  companyLogoText: string;
  quote: string;
  metric: string;
  metricLabel: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: '1', name: 'DATAVUE', subtitle: 'Analytics' },
  { id: '2', name: 'CLOUDSTREAM', subtitle: 'Infrastructure' },
  { id: '3', name: 'NEXUSOPS', subtitle: 'DevOps' },
  { id: '4', name: 'APEXSECURE', subtitle: 'Cybersecurity' },
  { id: '5', name: 'HYPERION', subtitle: 'FinTech' },
  { id: '6', name: 'SYNAPSE AI', subtitle: 'Enterprise AI' },
  { id: '7', name: 'VELOCITY', subtitle: 'SaaS GTM' },
  { id: '8', name: 'PULSE CRM', subtitle: 'Customer Cloud' },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'f1',
    iconName: 'Award',
    title: 'Pre-Vetted Top 1% Talent',
    description: 'We rigorously interview and vet hundreds of candidates to handpick elite SDRs and AEs with verified track records in high-growth B2B tech.',
    tag: 'Elite Talent',
  },
  {
    id: 'f2',
    iconName: 'Zap',
    title: '14-Day Rapid Deployment',
    description: 'Eliminate 3 to 6-month recruiting lag. Your dedicated reps are trained on your ICP, positioning, and sales playbooks ready to launch in 14 days.',
    tag: 'Instant Speed',
  },
  {
    id: 'f3',
    iconName: 'Target',
    title: 'Multi-Touch Outbound Engines',
    description: 'Coordinated multichannel sequences across personalized email, LinkedIn engagement, phone prospecting, and intent data trigger events.',
    tag: 'Full Coverage',
  },
  {
    id: 'f4',
    iconName: 'Cpu',
    title: 'AI-Augmented Buyer Research',
    description: 'Proprietary intelligence stack providing real-time account enrichment, buying intent alerts, custom objection handling, and executive dossiers.',
    tag: 'Modern Tech',
  },
  {
    id: 'f5',
    iconName: 'Layers',
    title: 'Bespoke CRM & Stack Sync',
    description: 'Seamless integration with Salesforce, HubSpot, Salesloft, Outreach, Gong, and Slack. Zero friction, unified pipeline visibility.',
    tag: 'Seamless Sync',
  },
  {
    id: 'f6',
    iconName: 'BarChart3',
    title: 'Dedicated Sales Leadership',
    description: 'Every squad includes an experienced Sales Director conducting daily standups, live call reviews, KPI tracking, and weekly strategy syncs.',
    tag: 'Managed Ops',
  },
];

export const SOLUTIONS_DATA: SolutionItem[] = [
  {
    id: 's1',
    tag: 'Outbound Sourcing',
    title: 'Dedicated Outbound SDR Squads',
    description: 'Fuel your pipeline with highly targeted, outbound sales development reps focused purely on booking qualified meetings with tier-1 decision makers.',
    metrics: '+280% Qualified Meetings',
    deliverables: ['Custom ICP Account Mapping', 'Personalized Cold Outreach', 'Verified Contact Intelligence', 'Discovery Booking Handoff'],
  },
  {
    id: 's2',
    tag: 'Deal Closing',
    title: 'Full-Cycle Account Executives',
    description: 'High-caliber closers who take qualified opportunities across the finish line with consultative discovery, demo execution, and contract negotiation.',
    metrics: '84% Win-Rate Attainment',
    deliverables: ['Product Demo Mastery', 'Enterprise RFP Handling', 'Multi-Stakeholder Consensus', 'Procurement & Closing'],
  },
  {
    id: 's3',
    tag: 'Lead Capture',
    title: 'Inbound Speed-to-Lead Engines',
    description: 'Never let a warm demo request sit idle. Our reps respond to inbound leads within 5 minutes, vetting intent and scheduling same-week calls.',
    metrics: '< 4 Min Average Response',
    deliverables: ['Instant Lead Routing', 'Qualification Frameworks (BANT/MEDDIC)', 'Calendar Coordination', 'CRM Auto-Enrichment'],
  },
  {
    id: 's4',
    tag: 'Growth Strategy',
    title: 'Market Expansion & GTM Testing',
    description: 'Spin up dedicated squads to test new geographical regions, vertical industry segments, or newly launched SaaS product tiers with zero overhead.',
    metrics: '60% Faster Time-to-Market',
    deliverables: ['Regional Market Validation', 'Messaging A/B Testing', 'Persona Benchmarking', 'Competitive Win-Loss Audits'],
  },
  {
    id: 's5',
    tag: 'Technical Sales',
    title: 'Technical Sales Engineering',
    description: 'Bridging the gap between software capability and executive ROI. Specialists equipped to answer technical architecture questions and manage POCs.',
    metrics: '3.2x POC Conversion',
    deliverables: ['Security Questionnaire Defense', 'Architecture Deep-Dives', 'Hands-on POC Management', 'API & Integration Advisory'],
  },
  {
    id: 's6',
    tag: 'Infrastructure',
    title: 'RevOps & Playbook Optimization',
    description: 'We build, audit, and continually tune your sales infrastructure, cadence templates, CRM hygiene, and analytics dashboards for peak efficiency.',
    metrics: '100% Attribution Accuracy',
    deliverables: ['Cadence & Copy Tuning', 'Pipeline Stage Hygiene', 'KPI & Quota Modeling', 'Weekly Executive Scorecards'],
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't1',
    clientName: 'Marcus Vance',
    role: 'VP of Global Sales',
    company: 'CloudStream Infrastructure',
    companyLogoText: 'CLOUDSTREAM',
    quote: 'RepTeam scaled our outbound pipeline by 320% in the first quarter alone. The reps felt like an organic extension of our core team from day one, mastering our developer product effortlessly.',
    metric: '+320%',
    metricLabel: 'Pipeline Growth in Q1',
  },
  {
    id: 't2',
    clientName: 'Sarah Lin',
    role: 'Chief Commercial Officer',
    company: 'Datavue Analytics',
    companyLogoText: 'DATAVUE',
    quote: 'We avoided five months of painful recruiter searches and onboarding lag. RepTeam provided two senior AEs who closed their first enterprise contracts within week three.',
    metric: '14-Day',
    metricLabel: 'Ramp-to-Close Speed',
  },
  {
    id: 't3',
    clientName: 'Jeremy Ross',
    role: 'Founder & CEO',
    company: 'ApexSecure Technologies',
    companyLogoText: 'APEXSECURE',
    quote: 'The multi-channel outbound playbooks and AI enrichment unlocked accounts we had been chasing for years. The ROI on our dedicated squad has been over 3.4x.',
    metric: '3.4x',
    metricLabel: 'Verified Net ROI',
  },
  {
    id: 't4',
    clientName: 'Elena Rostova',
    role: 'Head of Growth',
    company: 'NexusOps Platform',
    companyLogoText: 'NEXUSOPS',
    quote: 'Their dedicated Sales Director conducted rigorous weekly call coaching that elevated our entire team. Inbound demo show-rates surged from 62% to 89%.',
    metric: '89%',
    metricLabel: 'Demo Show-Rate',
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: '۱. شرکت ایده در چه زمینه‌ای فعالیت می‌کند؟',
    answer: 'شرکت ایده در زمینه تولید لوازم آشپزخانه فعالیت می‌کند و محصولات متنوعی را با تمرکز بر کیفیت و کاربردی بودن تولید و عرضه می‌کند.',
  },
  {
    question: '۲. آیا شرکت ایده فروش عمده دارد؟',
    answer: 'بله، شرکت ایده امکان همکاری و تأمین سفارش‌های عمده را برای فروشگاه‌ها، توزیع‌کنندگان و مجموعه‌های تجاری فراهم کرده است.',
  },
  {
    question: '۳. چگونه می‌توانم قیمت محصولات را دریافت کنم؟',
    answer: 'برای دریافت قیمت، می‌توانید محصول موردنظر و تعداد موردنیاز خود را از طریق راه‌های ارتباطی سایت برای واحد فروش شرکت ایده ارسال کنید.',
  },
  {
    question: '۴. آیا شرکت ایده با فروشگاه‌ها و نمایندگان همکاری می‌کند؟',
    answer: 'بله، شرکت ایده آماده همکاری با فروشگاه‌ها، نمایندگان فروش و مجموعه‌های تجاری است.',
  },
  {
    question: '۵. محصولات شرکت ایده چگونه کنترل می‌شوند؟',
    answer: 'محصولات در مراحل مختلف تولید مورد بررسی و کنترل قرار می‌گیرند تا کیفیت محصول نهایی مطابق با استانداردهای تولید شرکت باشد.',
  },
  {
    question: '۶. زمان آماده‌سازی سفارش چقدر است؟',
    answer: 'زمان آماده‌سازی سفارش با توجه به نوع محصول و حجم سفارش متفاوت است و هنگام ثبت سفارش توسط واحد فروش اعلام می‌شود.',
  },
  {
    question: '۷. چگونه می‌توانم با شرکت ایده تماس بگیرم؟',
    answer: 'برای ارتباط با شرکت ایده می‌توانید از فرم تماس، شماره تلفن یا سایر راه‌های ارتباطی درج‌شده در سایت استفاده کنید.',
  },
];