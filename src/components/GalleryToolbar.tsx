import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { categories, type Category, type Color, type Sort } from '../data';
import type { GalleryFilters } from '../lib/gallery';

interface GalleryToolbarProps {
  filters: GalleryFilters;
  onFilter: (updates: Partial<GalleryFilters>) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  onReset: () => void;
}

export default function GalleryToolbar({
  filters,
  onFilter,
  filtersOpen,
  onToggleFilters,
  onReset,
}: GalleryToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortMenu = useRef<HTMLDivElement>(null);
  const tagId = useId();
  const timeId = useId();
  const activeCount =
    Number(Boolean(filters.tag)) +
    Number(Boolean(filters.color)) +
    Number(filters.timeframe !== 'all');
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!sortMenu.current?.contains(event.target as Node)) setSortOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSortOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  const colors: { name: Color; hex: string }[] = [
    { name: 'green', hex: '#78a38d' },
    { name: 'purple', hex: '#b5a0d4' },
    { name: 'orange', hex: '#eea074' },
    { name: 'blue', hex: '#83b4d2' },
    { name: 'neutral', hex: '#d6d4cf' },
  ];
  return (
    <div className="gallery-controls">
      <div className="gallery-toolbar">
        <div className="sort-control" ref={sortMenu}>
          <button
            type="button"
            className="sort-button"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen(!sortOpen)}
          >
            {filters.sort}
            <ChevronDown size={13} />
          </button>
          {sortOpen && (
            <div className="sort-menu">
              {(['Popular', 'New & Noteworthy', 'Most liked', 'Most viewed'] as Sort[]).map(
                (option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      onFilter({ sort: option });
                      setSortOpen(false);
                    }}
                  >
                    {option}
                    {filters.sort === option && <Check size={14} />}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
        <nav className="category-nav" aria-label="Design categories">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={filters.category === category ? 'active' : ''}
              aria-pressed={filters.category === category}
              onClick={() => onFilter({ category: category as Category })}
            >
              {category}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className={`filters-button ${filtersOpen ? 'active' : ''}`}
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls="gallery-filters"
        >
          <SlidersHorizontal size={15} />
          Filters{activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        </button>
      </div>
      {filtersOpen && (
        <div id="gallery-filters" className="filter-panel">
          <div className="filter-field">
            <label htmlFor={tagId}>Tags</label>
            <div className="filter-input-wrap">
              <input
                id={tagId}
                value={filters.tag}
                onChange={(event) => onFilter({ tag: event.target.value })}
                placeholder="e.g. minimal, branding"
              />
              {filters.tag && (
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Clear tags"
                  onClick={() => onFilter({ tag: '' })}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <fieldset className="filter-field color-field">
            <legend>Color</legend>
            <div className="color-options">
              <button
                type="button"
                className={`color-swatch any-color ${!filters.color ? 'selected' : ''}`}
                aria-label="Any color"
                aria-pressed={!filters.color}
                onClick={() => onFilter({ color: '' })}
              >
                {!filters.color && <Check size={15} />}
              </button>
              {colors.map((color) => (
                <button
                  type="button"
                  key={color.name}
                  className={`color-swatch ${filters.color === color.name ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Filter by ${color.name}`}
                  aria-pressed={filters.color === color.name}
                  onClick={() =>
                    onFilter({ color: filters.color === color.name ? '' : color.name })
                  }
                >
                  {filters.color === color.name && <Check size={15} />}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="filter-field">
            <label htmlFor={timeId}>Timeframe</label>
            <select
              id={timeId}
              value={filters.timeframe}
              onChange={(event) =>
                onFilter({ timeframe: event.target.value as GalleryFilters['timeframe'] })
              }
            >
              <option value="all">All time</option>
              <option value="week">This past week</option>
              <option value="month">This past month</option>
            </select>
          </div>
          <button type="button" className="reset-filters" onClick={onReset}>
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
