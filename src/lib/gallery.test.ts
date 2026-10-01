import { describe, expect, it } from 'vitest';
import { categories, formatCount, getDesigner, shots } from '../data';
import { defaultFilters, filterShots } from './gallery';

describe('inspiration gallery', () => {
  it('keeps the curated order for the Popular feed', () => {
    expect(filterShots(shots, defaultFilters).map((shot) => shot.id)).toEqual(
      shots.map((shot) => shot.id),
    );
  });

  it.each(categories.filter((category) => category !== 'Discover'))('filters by %s', (category) => {
    const result = filterShots(shots, { ...defaultFilters, category });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((shot) => shot.categories.includes(category))).toBe(true);
  });

  it('matches search tokens without case sensitivity or extra whitespace', () => {
    const result = filterShots(shots, { ...defaultFilters, query: '  MOBILE   app ' });
    expect(result).toHaveLength(3);
    expect(result.map((shot) => shot.id)).toContain('vital-banking');
  });

  it('returns an empty set for a query with no matches', () => {
    expect(filterShots(shots, { ...defaultFilters, query: 'this-does-not-exist' })).toEqual([]);
  });

  it('combines category, tag, and color filters', () => {
    const result = filterShots(shots, {
      ...defaultFilters,
      category: 'Branding',
      tag: 'packaging',
      color: 'green',
    });
    expect(result.map((shot) => shot.id)).toEqual(['green-amigos', 'humble', 'gobble']);
  });

  it('supports multiple comma-separated tags', () => {
    const result = filterShots(shots, { ...defaultFilters, tag: 'fintech, dashboard' });
    expect(result.map((shot) => shot.id)).toEqual(['vital-banking', 'pesoredee']);
  });

  it('shows only saved inspiration, preserving gallery order', () => {
    expect(
      filterShots(shots, {
        ...defaultFilters,
        savedOnly: true,
        saved: ['maputo', 'green-amigos'],
      }).map((shot) => shot.id),
    ).toEqual(['green-amigos', 'maputo']);
  });

  it('handles an empty saved collection', () => {
    expect(filterShots(shots, { ...defaultFilters, savedOnly: true })).toEqual([]);
  });

  it('limits the timeframe to the past week', () => {
    const result = filterShots(shots, { ...defaultFilters, timeframe: 'week' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(shots.length);
    expect(result.every((shot) => shot.daysAgo <= 7)).toBe(true);
  });

  it.each(['Most liked', 'Most viewed', 'New & Noteworthy'] as const)(
    'sorts by %s without mutating the original feed',
    (sort) => {
      const before = shots.map((shot) => shot.id);
      const result = filterShots(shots, { ...defaultFilters, sort });
      const property =
        sort === 'Most liked' ? 'likes' : sort === 'Most viewed' ? 'views' : 'daysAgo';
      for (let index = 1; index < result.length; index++) {
        if (sort === 'New & Noteworthy')
          expect(result[index][property]).toBeGreaterThanOrEqual(result[index - 1][property]);
        else expect(result[index][property]).toBeLessThanOrEqual(result[index - 1][property]);
      }
      expect(shots.map((shot) => shot.id)).toEqual(before);
    },
  );

  it('provides a local profile for uploaded shots', () => {
    expect(getDesigner('you').name).toBe('You');
  });

  it('gives an unknown designer a safe fallback', () => {
    expect(getDesigner('unknown').id).toBe('north');
  });

  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1k'],
    [12800, '12.8k'],
    [18200, '18.2k'],
  ])('formats %s as %s', (count, expected) => {
    expect(formatCount(Number(count))).toBe(expected);
  });
});
