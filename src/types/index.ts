export type Language = 'pt' | 'en';

export interface Persona {
  id: string;
  role: string;
  badge: string;
  quote: string;
  frustration: string;
  desiredOutcome: string;
  icon: string;
  stats: string;
}

export interface Feature {
  id: string;
  title: string;
  tagline: string;
  description: string;
  benefit: string;
  ctaText: string;
  badgeText: string;
  metric: string;
  metricLabel: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  badge?: string;
  targetUser: string;
  description: string;
  cardName: string;
  cardColor: string;
  features: string[];
  highlight?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'security' | 'banking' | 'investing' | 'cards';
}
