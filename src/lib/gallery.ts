import type { Category, Color, Shot, Sort } from '../data';

export interface GalleryFilters {
  category: Category;
  query: string;
  tag: string;
  color: Color | '';
  timeframe: 'all' | 'week' | 'month';
  savedOnly: boolean;
  saved: string[];
  sort: Sort;
}

export const defaultFilters: GalleryFilters = {
  category: 'Discover',
  query: '',
  tag: '',
  color: '',
  timeframe: 'all',
  savedOnly: false,
  saved: [],
  sort: 'Popular',
};

export function filterShots(shots: Shot[], filters: GalleryFilters): Shot[] {
  const tokens = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const tagTokens = filters.tag
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(Boolean);
  const result = shots.filter((shot) => {
    const haystack = [shot.title, ...shot.tags, ...shot.categories].join(' ').toLowerCase();
    return (
      (filters.category === 'Discover' || shot.categories.includes(filters.category)) &&
      tokens.every((token) => haystack.includes(token)) &&
      tagTokens.every((token) => haystack.includes(token)) &&
      (!filters.color || shot.color === filters.color) &&
      (filters.timeframe !== 'week' || shot.daysAgo <= 7) &&
      (filters.timeframe !== 'month' || shot.daysAgo <= 30) &&
      (!filters.savedOnly || filters.saved.includes(shot.id))
    );
  });
  if (filters.sort === 'Most liked') result.sort((a, b) => b.likes - a.likes);
  if (filters.sort === 'Most viewed') result.sort((a, b) => b.views - a.views);
  if (filters.sort === 'New & Noteworthy') result.sort((a, b) => a.daysAgo - b.daysAgo);
  return result;
}
