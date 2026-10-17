export interface AboutValueCard {
  id: string;
  doodle: 'heart' | 'bow' | 'sparkle' | 'star';
  title: string;
  description: string;
}

export interface AboutBrandData {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: AboutValueCard[];
  mainBadge: string;
  mainHeading: string;
  mainSubheading: string;
  storyParagraphs: string[];
  footerTagline: string;
  ctaText: string;
  ctaLink: string;
}

export const DEFAULT_ABOUT_BRAND: AboutBrandData = {
  eyebrow: 'OUR VALUES',
  title: 'Homemade, Organic Lip Care for Every Day',
  subtitle: 'Crafted by hand in small batches. Nourish. Tint. Love.',
  cards: [
    {
      id: 'val-1',
      doodle: 'heart',
      title: '100% Organic',
      description: 'Ingredients you can actually pronounce.',
    },
    {
      id: 'val-2',
      doodle: 'bow',
      title: 'Handmade in Small Batches',
      description: 'Every tin is poured by hand.',
    },
    {
      id: 'val-3',
      doodle: 'sparkle',
      title: 'Pocket-Sized',
      description: 'The slim slider tin fits anywhere.',
    },
  ],
  mainBadge: 'ABOUT THE BRAND',
  mainHeading: 'Lip care, made by hand. Made for you.',
  mainSubheading:
    'Nourish. Tint. Love. Slim little tins of balm that live in your pocket and steal your heart.',
  storyParagraphs: [
    "Say By Saniya was born from a simple belief: what touches your lips every day should be as wholesome, pure, and comforting as what's in your home kitchen.",
    "Every batch begins with raw, unrefined organic beeswax, nourishing shea butter, golden cold-pressed plant oils, and natural flavor essences. Hand-poured into our signature pocket slider tins, they glide effortlessly into your pocket, handbag, or nightstand.",
    "No petroleum jelly, no parabens, no artificial preservatives, and zero shortcuts. Just clean hydration, sheer botanical tints, and a whole lot of love poured into every little tin.",
  ],
  footerTagline: 'Nourish. Tint. Love. ♥',
  ctaText: 'Shop the Collection',
  ctaLink: '/shop',
};

export interface InstagramMoodData {
  eyebrow: string;
  headline: string;
  highlightText?: string;
  subtitle: string;
  postUrl: string;
  badgeTitle: string;
  badgeSubtitle: string;
  imageUrl?: string;
  isActive: boolean;
}

export const DEFAULT_INSTAGRAM_MOOD: InstagramMoodData = {
  eyebrow: 'INSTAGRAM MOOD',
  headline: '"Reapply every 10 min? Nahi karenge."',
  highlightText: 'Nahi karenge.',
  subtitle: 'Me & my Say By Saniya lip balm against the world. ♥',
  postUrl: 'https://www.instagram.com/saylipss.co',
  badgeTitle: 'YES SIR.',
  badgeSubtitle: '100% Organic & Homemade',
  imageUrl: '',
  isActive: true,
};
