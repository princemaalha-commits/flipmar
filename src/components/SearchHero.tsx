import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import type { BrowseMode } from '../data';

interface SearchHeroProps {
  mode: BrowseMode;
  onMode: (mode: BrowseMode) => void;
  onSearch: (query: string) => void;
  query: string;
}

const trending = [
  'landing page',
  'e-commerce',
  'mobile app',
  'logo design',
  'dashboard',
  'illustration',
];
export default function SearchHero({ mode, onMode, onSearch, query }: SearchHeroProps) {
  const [text, setText] = useState(query);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setText(query);
  }, [query]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  const search = (event: FormEvent) => {
    event.preventDefault();
    onSearch(text.trim());
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">
        Discover the world’s
        <br />
        top designers.
      </h1>
      <p className="hero-description">
        Explore inspiring designs from the best designers around the world.
      </p>
      <form className="hero-search" onSubmit={search} role="search">
        <div className="search-mode" ref={menu}>
          <button
            type="button"
            className="search-mode-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {mode}
            <ChevronDown size={14} />
          </button>
          {open && (
            <div className="search-mode-menu">
              {(['Shots', 'Designers', 'Services'] as BrowseMode[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onMode(option);
                    setOpen(false);
                  }}
                >
                  {option}
                  {mode === option && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="search-divider" />
        <input
          type="search"
          name="q"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={
            mode === 'Designers'
              ? 'Find your next creative partner…'
              : mode === 'Services'
                ? 'What can we help you create?'
                : 'What are you looking for?'
          }
          aria-label={`Search ${mode.toLowerCase()}`}
          autoComplete="off"
        />
        {text && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              setText('');
              if (query) onSearch('');
            }}
          >
            <X size={16} />
          </button>
        )}
        <button type="submit" className="search-submit" aria-label="Search">
          <Search size={21} strokeWidth={2.3} />
        </button>
      </form>
      <div className="trending-searches">
        <span>Trending searches</span>
        {trending.map((term) => (
          <button
            type="button"
            key={term}
            onClick={() => {
              setText(term);
              onSearch(term);
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  );
}
