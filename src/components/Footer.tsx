import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Dribbble, Instagram, Twitter } from 'lucide-react';
import { type Category } from '../data';

interface FooterProps {
  onProject: () => void;
  onInfo: (topic: string) => void;
  onSignup: () => void;
  onCategory: (category: Category) => void;
  onBrowseDesigners: () => void;
  onHome: () => void;
}

const decks: { title: Category; image: string; color: string }[] = [
  { title: 'Branding', image: 'green-amigos', color: '#ecddd4' },
  { title: 'Web Design', image: 'monoform', color: '#dae4db' },
  { title: 'Illustration', image: 'into-the-wild', color: '#d9e4f0' },
  { title: 'Product Design', image: 'vital-banking', color: '#eee2f2' },
  { title: 'Typography', image: 'its-going-to-be-okay', color: '#f5e5ca' },
  { title: 'Animation', image: 'summer-camp', color: '#d3e8e7' },
];

export default function Footer({
  onProject,
  onInfo,
  onSignup,
  onCategory,
  onBrowseDesigners,
  onHome,
}: FooterProps) {
  return (
    <>
      <section className="hire-banner" aria-labelledby="hire-title">
        <span className="pill-label">GOOD PEOPLE. GREAT DESIGN.</span>
        <h2 id="hire-title">
          Find your next
          <br />
          creative partner.
        </h2>
        <p>
          Bring your next big idea to life with the world’s most talented
          <br className="desktop-break" /> independent designers and creative studios.
        </p>
        <div className="hire-actions">
          <button type="button" className="button button-dark" onClick={onProject}>
            Get started now <ArrowUpRight size={16} />
          </button>
          <button type="button" className="button button-white" onClick={() => onInfo('hiring')}>
            Learn about hiring
          </button>
        </div>
        <div className="designer-invitation">
          Are you a designer?{' '}
          <button type="button" onClick={onSignup}>
            Join Dribbble <ArrowRight size={14} />
          </button>
        </div>
        <span className="banner-spark spark-one" aria-hidden="true">
          ✳
        </span>
        <span className="banner-spark spark-two" aria-hidden="true">
          ✳
        </span>
      </section>
      <section className="category-decks" aria-label="More creative inspiration">
        <div className="category-deck-track">
          {decks.map((deck) => (
            <button
              type="button"
              key={deck.title}
              className="category-deck"
              onClick={() => onCategory(deck.title)}
            >
              <div className="deck-image" style={{ '--deck-color': deck.color } as CSSProperties}>
                <img
                  src={`/images/${deck.image}.webp`}
                  alt=""
                  width="400"
                  height="300"
                  loading="lazy"
                />
              </div>
              <span>
                {deck.title}
                <ArrowUpRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-main">
          <button type="button" className="wordmark" onClick={onHome} aria-label="Dribbble home">
            dribbble
          </button>
          <nav aria-label="Footer navigation">
            <button type="button" onClick={onSignup}>
              For designers
            </button>
            <button type="button" onClick={onProject}>
              Hire talent
            </button>
            <button type="button" onClick={() => onCategory('Discover')}>
              Inspiration
            </button>
            <button type="button" onClick={() => onInfo('stories')}>
              Blog
            </button>
            <button type="button" onClick={() => onInfo('about')}>
              About
            </button>
            <button type="button" onClick={() => onInfo('jobs')}>
              Careers
            </button>
            <button type="button" onClick={() => onInfo('about')}>
              Support
            </button>
          </nav>
          <div className="social-links">
            <a
              href="https://x.com/dribbble"
              target="_blank"
              rel="noreferrer"
              aria-label="Dribbble on X"
            >
              <Twitter size={19} fill="currentColor" strokeWidth={1.3} />
            </a>
            <a
              href="https://www.instagram.com/dribbble/"
              target="_blank"
              rel="noreferrer"
              aria-label="Dribbble on Instagram"
            >
              <Instagram size={19} />
            </a>
            <a
              href="https://dribbble.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit the original Dribbble"
            >
              <Dribbble size={19} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© 2026 Dribbble</span>
            <button type="button" onClick={() => onInfo('terms')}>
              Terms
            </button>
            <button type="button" onClick={() => onInfo('privacy')}>
              Privacy
            </button>
            <button type="button" onClick={() => onInfo('cookies')}>
              Cookies
            </button>
          </div>
          <div className="footer-extra">
            <button type="button" onClick={() => onInfo('jobs')}>
              Jobs
            </button>
            <button type="button" onClick={onBrowseDesigners}>
              Designers
            </button>
            <button type="button" onClick={onBrowseDesigners}>
              Freelancers
            </button>
            <button type="button" onClick={() => onCategory('Discover')}>
              Tags
            </button>
            <button type="button" onClick={() => onInfo('resources')}>
              Resources
            </button>
          </div>
        </div>
        <p className="footer-disclaimer">
          Independent frontend demo. Not affiliated with Dribbble. Artwork belongs to its original
          creators.
        </p>
      </footer>
    </>
  );
}
