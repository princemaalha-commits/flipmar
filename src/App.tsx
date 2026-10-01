import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  Eye,
  Heart,
  MapPin,
  Search,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  designers,
  formatCount,
  getDesigner,
  shots,
  type BrowseMode,
  type Category,
  type Designer,
  type Shot,
} from './data';
import { defaultFilters, filterShots, type GalleryFilters } from './lib/gallery';
import { isStringArray, useLocalStorage } from './hooks/useLocalStorage';
import Header, { type DemoUser } from './components/Header';
import SearchHero from './components/SearchHero';
import GalleryToolbar from './components/GalleryToolbar';
import ShotCard, { DesignerCard, ServiceCard } from './components/ShotCard';
import Modal from './components/Modal';
import { AccountForm, ContactForm, InfoPanel, ProjectForm, UploadForm } from './components/Forms';
import Footer from './components/Footer';

type ActiveModal =
  | { type: 'shot'; shot: Shot }
  | { type: 'profile'; designer: Designer }
  | { type: 'contact'; designer: Designer }
  | { type: 'account'; mode: 'login' | 'signup' }
  | { type: 'project' }
  | { type: 'upload' }
  | { type: 'info'; topic: string };
const validUser = (value: unknown): value is DemoUser | null =>
  value === null ||
  (typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0);
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
const scrollToGallery = () =>
  document
    .getElementById('gallery')
    ?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });

export default function App() {
  const [saved, setSaved] = useLocalStorage<string[]>('dribbble-demo-saved', [], isStringArray);
  const [liked, setLiked] = useLocalStorage<string[]>('dribbble-demo-liked', [], isStringArray);
  const [user, setUser] = useLocalStorage<DemoUser | null>('dribbble-demo-user', null, validUser);
  const [mode, setMode] = useState<BrowseMode>('Shots');
  const [filters, setFilters] = useState<GalleryFilters>({ ...defaultFilters });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [limit, setLimit] = useState(12);
  const [uploaded, setUploaded] = useState<Shot[]>([]);
  const [modal, setModal] = useState<ActiveModal | null>(() => {
    const id = new URLSearchParams(window.location.search).get('shot');
    const found = shots.find((shot) => shot.id === id);
    return found ? { type: 'shot', shot: found } : null;
  });
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const allShots = useMemo(() => [...uploaded, ...shots], [uploaded]);
  const filteredShots = useMemo(
    () => filterShots(allShots, { ...filters, saved }),
    [allShots, filters, saved],
  );
  const filteredDesigners = useMemo(() => {
    const matchingWork = filterShots(allShots, { ...filters, query: '', saved });
    const tokens = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return designers.filter((designer) => {
      const work = matchingWork.filter((shot) => shot.designerId === designer.id);
      const text = [
        designer.name,
        designer.specialty,
        designer.location,
        ...work.flatMap((shot) => [shot.title, ...shot.tags, ...shot.categories]),
      ]
        .join(' ')
        .toLowerCase();
      return work.length > 0 && tokens.every((token) => text.includes(token));
    });
  }, [allShots, filters, saved]);
  const total = mode === 'Designers' ? filteredDesigners.length : filteredShots.length;
  const hasFilters = Boolean(
    filters.query ||
    filters.tag ||
    filters.color ||
    filters.category !== 'Discover' ||
    filters.timeframe !== 'all' ||
    filters.savedOnly,
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (modal?.type === 'shot' && !modal.shot.id.startsWith('user-'))
      url.searchParams.set('shot', modal.shot.id);
    else url.searchParams.delete('shot');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [modal]);

  const notify = (message: string) => setToast({ message, id: Date.now() });
  const updateFilters = (updates: Partial<GalleryFilters>) => {
    setFilters((current) => ({ ...current, ...updates }));
    setLimit(12);
  };
  const resetFilters = () => {
    setFilters({ ...defaultFilters });
    setLimit(12);
  };
  const home = () => {
    resetFilters();
    setMode('Shots');
    setFiltersOpen(false);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };
  const browse = (action: 'popular' | 'new' | 'designers' | 'saved') => {
    setMode(action === 'designers' ? 'Designers' : 'Shots');
    setFilters({
      ...defaultFilters,
      sort: action === 'new' ? 'New & Noteworthy' : 'Popular',
      savedOnly: action === 'saved',
    });
    setLimit(12);
    setFiltersOpen(false);
    scrollToGallery();
  };
  const chooseCategory = (category: Category) => {
    setMode('Shots');
    setFilters({ ...defaultFilters, category });
    setLimit(12);
    scrollToGallery();
  };
  const search = (query: string) => {
    updateFilters({ query, category: 'Discover', savedOnly: false });
    scrollToGallery();
  };
  const changeMode = (next: BrowseMode) => {
    setMode(next);
    setLimit(12);
    updateFilters({ savedOnly: false });
  };
  const toggleLike = (id: string) => {
    setLiked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };
  const toggleSave = (id: string) => {
    const alreadySaved = saved.includes(id);
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    notify(
      alreadySaved
        ? 'Removed from your saved inspiration.'
        : 'Saved! A little inspiration for later.',
    );
  };
  const share = async (shot: Shot) => {
    if (shot.id.startsWith('user-')) {
      notify('Uploaded shots are only available in this session.');
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('shot', shot.id);
    url.hash = '';
    try {
      await navigator.clipboard.writeText(url.toString());
      notify('Link copied. Share a little inspiration.');
    } catch {
      notify('Copy the link from your browser’s address bar to share this shot.');
    }
  };
  const uploadShot = (shot: Shot) => {
    setUploaded((current) => [shot, ...current]);
    setMode('Shots');
    setFilters({ ...defaultFilters, sort: 'New & Noteworthy' });
    setLimit(12);
    setModal(null);
    notify('Your shot is live in this demo. Looking good!');
    scrollToGallery();
  };
  const resultTitle = filters.savedOnly
    ? 'Your saved inspiration'
    : filters.query
      ? `Results for “${filters.query}”`
      : mode === 'Designers'
        ? 'Meet your next creative partner'
        : mode === 'Services'
          ? 'Great design, a little closer'
          : `${filters.category === 'Discover' ? 'Curated' : filters.category} inspiration`;

  return (
    <>
      <a className="skip-link" href="#gallery">
        Skip to inspiration
      </a>
      <Header
        user={user}
        savedCount={saved.length}
        onHome={home}
        onBrowse={browse}
        onAccount={(accountMode) => setModal({ type: 'account', mode: accountMode })}
        onProject={() => setModal({ type: 'project' })}
        onUpload={() => setModal({ type: 'upload' })}
        onInfo={(topic) => setModal({ type: 'info', topic })}
        onLogout={() => {
          setUser(null);
          notify('You’re logged out of the demo. See you soon!');
        }}
      />
      <main>
        <SearchHero mode={mode} onMode={changeMode} onSearch={search} query={filters.query} />
        <section
          className="gallery-section page-container"
          id="gallery"
          aria-label="Design inspiration"
        >
          <GalleryToolbar
            filters={filters}
            onFilter={updateFilters}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen(!filtersOpen)}
            onReset={resetFilters}
          />
          {(hasFilters || mode !== 'Shots') && (
            <div className="gallery-result-heading">
              <div>
                <h2>{resultTitle}</h2>
                <p>
                  {total}{' '}
                  {mode === 'Designers'
                    ? 'creative partners'
                    : mode === 'Services'
                      ? 'creative services'
                      : total === 1
                        ? 'inspiring shot'
                        : 'inspiring shots'}{' '}
                  to explore
                </p>
              </div>
              {hasFilters && (
                <button type="button" className="clear-results" onClick={resetFilters}>
                  Clear filters <X size={14} />
                </button>
              )}
            </div>
          )}
          {total === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {filters.savedOnly ? <Bookmark size={29} /> : <Search size={29} />}
              </div>
              <h2>{filters.savedOnly ? 'Collect the work you love.' : 'A little too specific?'}</h2>
              <p>
                {filters.savedOnly
                  ? 'Tap the bookmark on any design to keep your inspiration close.'
                  : 'Try a different search or loosen your filters. Your next great idea is out there.'}
              </p>
              <button
                type="button"
                className="button button-dark"
                onClick={() => {
                  resetFilters();
                  setMode('Shots');
                }}
              >
                Explore inspiration <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className={`design-grid ${mode === 'Designers' ? 'designer-grid' : ''}`}>
                {mode === 'Shots' &&
                  filteredShots
                    .slice(0, limit)
                    .map((shot, index) => (
                      <ShotCard
                        key={shot.id}
                        shot={shot}
                        liked={liked.includes(shot.id)}
                        saved={saved.includes(shot.id)}
                        onOpen={(shot) => setModal({ type: 'shot', shot })}
                        onLike={toggleLike}
                        onSave={toggleSave}
                        onDesigner={(designer) => setModal({ type: 'profile', designer })}
                        priority={index < 8}
                      />
                    ))}
                {mode === 'Designers' &&
                  filteredDesigners
                    .slice(0, limit)
                    .map((designer) => (
                      <DesignerCard
                        key={designer.id}
                        designer={designer}
                        work={allShots.filter((shot) => shot.designerId === designer.id)}
                        onOpen={(designer) => setModal({ type: 'profile', designer })}
                        onContact={(designer) => setModal({ type: 'contact', designer })}
                      />
                    ))}
                {mode === 'Services' &&
                  filteredShots
                    .slice(0, limit)
                    .map((shot) => (
                      <ServiceCard
                        key={shot.id}
                        shot={shot}
                        onContact={(designer) => setModal({ type: 'contact', designer })}
                      />
                    ))}
              </div>
              <div className="gallery-pagination">
                {total > limit ? (
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => setLimit((current) => current + 8)}
                  >
                    Load more inspiration <ChevronDown size={16} />
                  </button>
                ) : (
                  <p className="end-of-feed">
                    <Sparkles size={15} />
                    You’re all caught up. Great ideas never stop.
                  </p>
                )}
                <p className="gallery-join">
                  There’s more where that came from.{' '}
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'account', mode: 'signup' })}
                  >
                    Join the community <ArrowRight size={13} />
                  </button>
                </p>
              </div>
            </>
          )}
        </section>
        <Footer
          onProject={() => setModal({ type: 'project' })}
          onInfo={(topic) => setModal({ type: 'info', topic })}
          onSignup={() => setModal({ type: 'account', mode: 'signup' })}
          onCategory={chooseCategory}
          onBrowseDesigners={() => browse('designers')}
          onHome={home}
        />
      </main>
      {modal && (
        <Modal
          key={modal.type === 'account' ? `account-${modal.mode}` : modal.type}
          title={
            modal.type === 'shot'
              ? modal.shot.title
              : modal.type === 'profile'
                ? modal.designer.name
                : modal.type === 'contact'
                  ? `Contact ${modal.designer.name}`
                  : modal.type === 'account'
                    ? modal.mode === 'signup'
                      ? 'Create a demo account'
                      : 'Log in to the demo'
                    : modal.type === 'project'
                      ? 'Create your project brief'
                      : modal.type === 'upload'
                        ? 'Share your work'
                        : 'More information'
          }
          onClose={() => setModal(null)}
          wide={modal.type === 'shot' || modal.type === 'profile'}
          className={modal.type === 'shot' ? 'shot-dialog' : ''}
        >
          {modal.type === 'account' && (
            <AccountForm
              mode={modal.mode}
              onToggle={() =>
                setModal({ type: 'account', mode: modal.mode === 'signup' ? 'login' : 'signup' })
              }
              onSubmit={(account) => {
                setUser(account);
                setModal(null);
                notify(`Welcome, ${account.name.split(' ')[0]}! Make yourself at home.`);
              }}
            />
          )}
          {modal.type === 'project' && (
            <ProjectForm
              onBrowse={(category) => {
                setModal(null);
                setMode('Designers');
                setFilters({ ...defaultFilters, category });
                setLimit(12);
                scrollToGallery();
              }}
            />
          )}
          {modal.type === 'contact' && (
            <ContactForm
              key={modal.designer.id}
              designer={modal.designer}
              onClose={() => setModal(null)}
            />
          )}
          {modal.type === 'upload' && <UploadForm onUpload={uploadShot} />}
          {modal.type === 'info' && (
            <InfoPanel
              topic={modal.topic}
              onAccount={() => setModal({ type: 'account', mode: 'signup' })}
              onProject={() => setModal({ type: 'project' })}
              onClose={() => setModal(null)}
            />
          )}
          {modal.type === 'profile' && (
            <div className="profile-panel">
              <div className="profile-header">
                <img src={modal.designer.avatar} alt="" width="88" height="88" />
                <span className="pill-label">
                  {modal.designer.badge === 'TEAM'
                    ? 'INDEPENDENT CREATIVE STUDIO'
                    : 'INDEPENDENT DESIGNER'}
                </span>
                <h2>{modal.designer.name}</h2>
                <p className="profile-specialty">{modal.designer.specialty}</p>
                <span className="profile-location">
                  <MapPin size={14} />
                  {modal.designer.location}
                </span>
                <p className="profile-about">{modal.designer.about}</p>
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => setModal({ type: 'contact', designer: modal.designer })}
                >
                  Get in touch <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="profile-work">
                <h3>A little of what we’ve been making</h3>
                <div>
                  {allShots
                    .filter((shot) => shot.designerId === modal.designer.id)
                    .map((shot) => (
                      <button
                        type="button"
                        key={shot.id}
                        onClick={() => setModal({ type: 'shot', shot })}
                      >
                        <img src={shot.image} alt={shot.title} width="400" height="300" />
                        <span>{shot.title}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
          {modal.type === 'shot' && (
            <div className="shot-detail">
              <div className="shot-detail-header">
                <h2>{modal.shot.title}</h2>
                <div className="shot-detail-designer">
                  <button
                    type="button"
                    className="detail-designer-button"
                    onClick={() =>
                      setModal({ type: 'profile', designer: getDesigner(modal.shot.designerId) })
                    }
                  >
                    <img
                      src={getDesigner(modal.shot.designerId).avatar}
                      alt=""
                      width="42"
                      height="42"
                    />
                    <span>
                      <strong>{getDesigner(modal.shot.designerId).name}</strong>
                      <span className="availability">
                        <i />
                        {getDesigner(modal.shot.designerId).available
                          ? 'Available for work'
                          : 'Open to future projects'}
                      </span>
                    </span>
                  </button>
                  <div className="detail-header-actions">
                    <button
                      type="button"
                      className={`icon-button detail-save ${saved.includes(modal.shot.id) ? 'is-saved' : ''}`}
                      onClick={() => toggleSave(modal.shot.id)}
                      aria-label={saved.includes(modal.shot.id) ? 'Unsave shot' : 'Save shot'}
                      aria-pressed={saved.includes(modal.shot.id)}
                    >
                      <Bookmark
                        size={18}
                        fill={saved.includes(modal.shot.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={() =>
                        setModal({ type: 'contact', designer: getDesigner(modal.shot.designerId) })
                      }
                    >
                      Get in touch <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <img
                className="shot-detail-image"
                src={modal.shot.image}
                alt={modal.shot.title}
                width="800"
                height="600"
              />
              <div className="shot-detail-info">
                <div className="detail-description">
                  <p>{modal.shot.description}</p>
                  <div className="detail-tags">
                    {modal.shot.tags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          setModal(null);
                          search(tag);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="detail-actions">
                  <button
                    type="button"
                    className={`button button-outline ${liked.includes(modal.shot.id) ? 'is-liked' : ''}`}
                    onClick={() => toggleLike(modal.shot.id)}
                    aria-pressed={liked.includes(modal.shot.id)}
                  >
                    <Heart
                      size={17}
                      fill={liked.includes(modal.shot.id) ? 'currentColor' : 'none'}
                    />
                    {formatCount(modal.shot.likes + (liked.includes(modal.shot.id) ? 1 : 0))}
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => share(modal.shot)}
                    aria-label="Share shot"
                  >
                    <Share2 size={19} />
                  </button>
                  <span className="detail-views">
                    <Eye size={15} />
                    {formatCount(modal.shot.views)} views
                  </span>
                </div>
              </div>
              <div className="shot-detail-footer">
                <span>
                  A little inspiration from{' '}
                  <strong>{getDesigner(modal.shot.designerId).name}</strong>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setModal({ type: 'profile', designer: getDesigner(modal.shot.designerId) })
                  }
                >
                  View profile <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
      {toast && (
        <div className="toast" key={toast.id} role="status">
          <span className="toast-check">
            <Check size={15} />
          </span>
          {toast.message}
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">
            <X size={16} />
          </button>
        </div>
      )}
      <div className="sr-only" aria-live="polite">
        {hasFilters ? `${total} ${mode.toLowerCase()} found.` : ''}
      </div>
    </>
  );
}
