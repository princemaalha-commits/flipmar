export const categories = [
  'Discover',
  'Animation',
  'Branding',
  'Illustration',
  'Mobile',
  'Print',
  'Product Design',
  'Typography',
  'Web Design',
] as const;
export type Category = (typeof categories)[number];
export type BrowseMode = 'Shots' | 'Designers' | 'Services';
export type Color = 'green' | 'purple' | 'orange' | 'blue' | 'neutral';
export type Sort = 'Popular' | 'New & Noteworthy' | 'Most liked' | 'Most viewed';

export interface Designer {
  id: string;
  name: string;
  avatar: string;
  badge: 'PRO' | 'TEAM';
  location: string;
  specialty: string;
  about: string;
  available: boolean;
  rate: number;
}

export interface Shot {
  id: string;
  title: string;
  image: string;
  designerId: string;
  categories: Category[];
  tags: string[];
  color: Color;
  likes: number;
  views: number;
  daysAgo: number;
  description: string;
}

export const designers: Designer[] = [
  {
    id: 'north',
    name: 'Studio North',
    avatar: '/avatars/north.svg',
    badge: 'TEAM',
    location: 'London, United Kingdom',
    specialty: 'Branding & visual identity',
    about:
      'Independent thinkers. Distinctive brands. We partner with ambitious people to create thoughtful identities that feel right and stand out.',
    available: true,
    rate: 1800,
  },
  {
    id: 'alex',
    name: 'Alex Morgan',
    avatar: '/avatars/alex.webp',
    badge: 'PRO',
    location: 'Brooklyn, New York',
    specialty: 'Web design & digital experiences',
    about:
      'Designing considered digital experiences for people and the planet. A little strategy, a lot of curiosity, and a love of good typography.',
    available: true,
    rate: 1400,
  },
  {
    id: 'anna',
    name: 'Anna Hurley',
    avatar: '/avatars/anna.webp',
    badge: 'PRO',
    location: 'San Francisco, California',
    specialty: 'Illustration & lettering',
    about:
      'Making the everyday a little more colorful through playful illustration, expressive lettering, and warm, human-centered design.',
    available: true,
    rate: 650,
  },
  {
    id: 'milk',
    name: 'Milk inside',
    avatar: '/avatars/milk.svg',
    badge: 'TEAM',
    location: 'San Francisco, California',
    specialty: 'Product design & mobile apps',
    about:
      'A design studio building the next generation of digital products. We turn complex challenges into simple, memorable experiences.',
    available: true,
    rate: 2500,
  },
  {
    id: 'basta',
    name: 'Studio Basta',
    avatar: '/avatars/basta.svg',
    badge: 'TEAM',
    location: 'Amsterdam, Netherlands',
    specialty: 'Branding & packaging',
    about:
      'Bold brands for a better tomorrow. We bring strategy, design, and a healthy dose of personality to every project.',
    available: false,
    rate: 1600,
  },
  {
    id: 'muti',
    name: 'MUTI',
    avatar: '/avatars/muti.svg',
    badge: 'TEAM',
    location: 'Cape Town, South Africa',
    specialty: 'Illustration & typography',
    about:
      'A creative studio with a passion for illustration, lettering, and design. We tell stories through images with character.',
    available: true,
    rate: 900,
  },
  {
    id: 'outcrowd',
    name: 'Outcrowd',
    avatar: '/avatars/outcrowd.svg',
    badge: 'TEAM',
    location: 'Kyiv, Ukraine',
    specialty: 'UI/UX & product design',
    about:
      'We help startups and businesses create remarkable digital experiences through thoughtful branding and user-centered product design.',
    available: true,
    rate: 2000,
  },
  {
    id: 'dan',
    name: 'Dan Page',
    avatar: '/avatars/dan.svg',
    badge: 'PRO',
    location: 'Portland, Oregon',
    specialty: 'Illustration & animation',
    about:
      'Exploring the outdoors, one illustration at a time. Landscapes, little stories, and characters with a sense of adventure.',
    available: true,
    rate: 750,
  },
  {
    id: 'brandgeist',
    name: 'Brandgeist',
    avatar: '/avatars/brandgeist.svg',
    badge: 'TEAM',
    location: 'Berlin, Germany',
    specialty: 'Brand identity & print',
    about:
      'Design with spirit. We create memorable brands and tangible experiences, from the first sketch to the final printed piece.',
    available: true,
    rate: 1200,
  },
  {
    id: 'jordan',
    name: 'Jordan Hughes',
    avatar: '/avatars/jordan.svg',
    badge: 'PRO',
    location: 'Melbourne, Australia',
    specialty: 'Web design & design systems',
    about:
      'Simple, useful, and beautifully made. I design websites and scalable systems that help great ideas find their audience.',
    available: true,
    rate: 1100,
  },
  {
    id: 'unfold',
    name: 'Unfold',
    avatar: '/avatars/unfold.svg',
    badge: 'TEAM',
    location: 'Charleston, South Carolina',
    specialty: 'Branding & digital design',
    about:
      'We build brands and digital experiences that help ambitious businesses unfold their potential.',
    available: false,
    rate: 2200,
  },
  {
    id: 'craftwork',
    name: 'Craftwork',
    avatar: '/avatars/craftwork.svg',
    badge: 'TEAM',
    location: 'Remote, Worldwide',
    specialty: 'UI kits & digital products',
    about:
      'High-quality design resources and crafted digital experiences. We make it easier to turn your ideas into something great.',
    available: true,
    rate: 800,
  },
];

const shot = (
  id: string,
  title: string,
  designerId: string,
  cats: Category[],
  tags: string[],
  color: Color,
  likes: number,
  views: number,
  daysAgo: number,
): Shot => ({
  id,
  title,
  image: `/images/${id}.webp`,
  designerId,
  categories: cats,
  tags,
  color,
  likes,
  views,
  daysAgo,
  description: `A fresh exploration of ${tags.slice(0, 2).join(' and ')}. Thoughtful details, a distinct point of view, and a little room for the unexpected. Take a closer look — we’d love to hear what you think.`,
});

export const shots: Shot[] = [
  shot(
    'green-amigos',
    'Green Amigos — A growing identity',
    'north',
    ['Branding', 'Print'],
    ['brand identity', 'logo design', 'packaging', 'green', 'nature'],
    'green',
    146,
    12800,
    2,
  ),
  shot(
    'monoform',
    'MONOFORM — Architecture studio',
    'alex',
    ['Web Design', 'Product Design'],
    ['landing page', 'architecture', 'minimal', 'portfolio', 'website'],
    'neutral',
    214,
    18200,
    1,
  ),
  shot(
    'its-going-to-be-okay',
    'A little reminder: it’s going to be okay',
    'anna',
    ['Illustration', 'Typography', 'Print'],
    ['poster', 'lettering', 'typography', 'flowers', 'positive'],
    'orange',
    189,
    9400,
    3,
  ),
  shot(
    'vital-banking',
    'Vital — A brighter way to bank',
    'milk',
    ['Mobile', 'Product Design'],
    ['mobile app', 'fintech', 'banking', 'ui ux', 'dashboard'],
    'purple',
    328,
    24600,
    1,
  ),
  shot(
    'sundowner',
    'Sundowner — A taste of sunshine',
    'basta',
    ['Branding', 'Animation'],
    ['soda', 'packaging', '3d', 'motion', 'orange', 'logo design'],
    'orange',
    97,
    6800,
    4,
  ),
  shot(
    'good-vibes',
    'Good vibes, great company',
    'muti',
    ['Illustration', 'Typography'],
    ['colorful', 'lettering', 'characters', 'poster', 'icons'],
    'green',
    256,
    16300,
    2,
  ),
  shot(
    'ai-assistant',
    'Your new everyday AI assistant',
    'outcrowd',
    ['Mobile', 'Product Design'],
    ['mobile app', 'onboarding', 'ai', 'ui ux', 'minimal'],
    'purple',
    174,
    11700,
    5,
  ),
  shot(
    'into-the-wild',
    'Into the wild',
    'dan',
    ['Illustration', 'Animation'],
    ['landscape', 'nature', 'forest', 'vector', 'animation'],
    'blue',
    203,
    14200,
    3,
  ),
  shot(
    'humble',
    'Humble — Naturally different',
    'brandgeist',
    ['Branding', 'Print'],
    ['packaging', 'brand identity', 'natural', 'colorful'],
    'green',
    118,
    7800,
    6,
  ),
  shot(
    'parker-portfolio',
    'Parker — A portfolio with personality',
    'jordan',
    ['Web Design', 'Product Design'],
    ['portfolio', 'landing page', 'minimal', 'web design'],
    'neutral',
    162,
    10900,
    8,
  ),
  shot(
    'orange-boom',
    'Orange Boom — Made to stand out',
    'unfold',
    ['Branding', 'Print'],
    ['packaging', 'orange', 'beverage', 'logo design'],
    'blue',
    84,
    5300,
    7,
  ),
  shot(
    'maputo',
    'Love letters to Maputo',
    'muti',
    ['Illustration', 'Typography', 'Print'],
    ['poster', 'lettering', 'travel', 'retro', 'typography'],
    'green',
    241,
    19100,
    4,
  ),
  shot(
    'gobble',
    'Gobble — Fresh from the kitchen',
    'north',
    ['Branding', 'Print'],
    ['food', 'packaging', 'brand identity', 'e-commerce'],
    'green',
    132,
    8200,
    9,
  ),
  shot(
    'stacks',
    'Stacks — Save. Share. Discover.',
    'outcrowd',
    ['Web Design', 'Product Design'],
    ['landing page', 'saas', 'bookmarks', 'dashboard', 'website'],
    'purple',
    187,
    13700,
    10,
  ),
  shot(
    'summer-camp',
    'A night under the stars',
    'dan',
    ['Illustration', 'Animation'],
    ['camping', 'landscape', 'nature', 'night', 'animation'],
    'blue',
    219,
    16800,
    8,
  ),
  shot(
    'vesilake',
    'Vesilake — Less, but better',
    'jordan',
    ['Web Design', 'Product Design'],
    ['agency', 'portfolio', 'landing page', 'ui ux', 'e-commerce'],
    'neutral',
    92,
    6900,
    11,
  ),
  shot(
    'a-little-thank-you',
    'A little thank you goes a long way',
    'anna',
    ['Print', 'Typography', 'Branding'],
    ['print', 'lettering', 'brand identity', 'thank you'],
    'orange',
    75,
    4200,
    12,
  ),
  shot(
    'quiet-mountains',
    'Somewhere a little quieter',
    'dan',
    ['Illustration'],
    ['landscape', 'mountains', 'pastel', 'nature'],
    'blue',
    156,
    9300,
    7,
  ),
  shot(
    'pesoredee',
    'Pesoredee — Finance made friendly',
    'milk',
    ['Mobile', 'Product Design'],
    ['mobile app', 'fintech', 'dashboard', 'ui ux'],
    'purple',
    284,
    22100,
    13,
  ),
  shot(
    'studio-stationery',
    'Tactile details, lasting impressions',
    'brandgeist',
    ['Branding', 'Print', 'Typography'],
    ['stationery', 'print', 'brand identity', 'minimal'],
    'neutral',
    143,
    10100,
    14,
  ),
  shot(
    'bottled-up',
    'Bottled up — A colorful collection',
    'craftwork',
    ['Illustration', 'Branding'],
    ['icons', 'bottles', 'colorful', 'vector', 'food'],
    'orange',
    106,
    7100,
    15,
  ),
  shot(
    'golf-course',
    'A greener kind of afternoon',
    'dan',
    ['Illustration'],
    ['landscape', 'golf', 'nature', 'texture'],
    'green',
    126,
    8900,
    16,
  ),
  shot(
    'orange-energy',
    'A fresh burst of energy',
    'basta',
    ['Branding', 'Animation'],
    ['3d', 'packaging', 'orange', 'beverage', 'motion'],
    'orange',
    169,
    13200,
    17,
  ),
  shot(
    'parker-editorial',
    'Parker — The editorial edition',
    'alex',
    ['Web Design', 'Typography'],
    ['portfolio', 'minimal', 'web design', 'landing page'],
    'neutral',
    198,
    15600,
    18,
  ),
];

export const getDesigner = (id: string): Designer =>
  id === 'you'
    ? {
        id: 'you',
        name: 'You',
        avatar: '/avatars/craftwork.svg',
        badge: 'PRO',
        location: 'Your creative corner of the world',
        specialty: 'Fresh ideas & creative explorations',
        about:
          'A little collection of what you’ve been making. Your uploaded designs are shown in this session only.',
        available: true,
        rate: 0,
      }
    : (designers.find((d) => d.id === id) ?? designers[0]);
export const formatCount = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(count);
