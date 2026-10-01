import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  Heart,
  LogOut,
  Menu,
  Sparkles,
  Upload,
  UserRound,
  X,
} from 'lucide-react';

export interface DemoUser {
  name: string;
}
interface HeaderProps {
  user: DemoUser | null;
  savedCount: number;
  onHome: () => void;
  onBrowse: (action: 'popular' | 'new' | 'designers' | 'saved') => void;
  onAccount: (mode: 'login' | 'signup') => void;
  onProject: () => void;
  onUpload: () => void;
  onInfo: (topic: string) => void;
  onLogout: () => void;
}

export default function Header({
  user,
  savedCount,
  onHome,
  onBrowse,
  onAccount,
  onProject,
  onUpload,
  onInfo,
  onLogout,
}: HeaderProps) {
  const [menu, setMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setMenu(null);
        setMobile(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(null);
        setMobile(false);
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  const action = (callback: () => void) => {
    setMenu(null);
    setMobile(false);
    callback();
  };

  return (
    <header className="site-header" ref={root}>
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button icon-button"
          aria-label={mobile ? 'Close menu' : 'Open menu'}
          aria-expanded={mobile}
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X size={24} /> : <Menu size={24} />}
        </button>
        <button
          type="button"
          className="wordmark"
          onClick={() => action(onHome)}
          aria-label="Dribbble home"
        >
          dribbble
        </button>
        <nav className={`main-nav ${mobile ? 'mobile-open' : ''}`} aria-label="Main navigation">
          <div className="nav-item">
            <button
              type="button"
              className="nav-link"
              onClick={() => setMenu(menu === 'explore' ? null : 'explore')}
              aria-expanded={menu === 'explore'}
            >
              Explore <ChevronDown size={13} />
            </button>
            {menu === 'explore' && (
              <div className="nav-dropdown">
                <button type="button" onClick={() => action(() => onBrowse('popular'))}>
                  <Compass size={20} />
                  <span>
                    <strong>Explore popular designs</strong>
                    <small>Find your next spark of inspiration</small>
                  </span>
                </button>
                <button type="button" onClick={() => action(() => onBrowse('new'))}>
                  <Sparkles size={20} />
                  <span>
                    <strong>New & noteworthy</strong>
                    <small>Fresh ideas from the community</small>
                  </span>
                </button>
                <button type="button" onClick={() => action(() => onBrowse('designers'))}>
                  <UserRound size={20} />
                  <span>
                    <strong>Discover designers</strong>
                    <small>Meet the minds behind the work</small>
                  </span>
                </button>
                <button type="button" onClick={() => action(() => onBrowse('saved'))}>
                  <Bookmark size={20} />
                  <span>
                    <strong>
                      Saved inspiration <span className="menu-count">{savedCount}</span>
                    </strong>
                    <small>Your own little collection of favorites</small>
                  </span>
                </button>
              </div>
            )}
          </div>
          <div className="nav-item">
            <button
              type="button"
              className="nav-link"
              onClick={() => setMenu(menu === 'designers' ? null : 'designers')}
              aria-expanded={menu === 'designers'}
            >
              For designers <ChevronDown size={13} />
            </button>
            {menu === 'designers' && (
              <div className="nav-dropdown">
                <button type="button" onClick={() => action(onUpload)}>
                  <Upload size={20} />
                  <span>
                    <strong>Share your work</strong>
                    <small>Show the world what you’ve been making</small>
                  </span>
                </button>
                <button type="button" onClick={() => action(() => onInfo('pro'))}>
                  <Sparkles size={20} />
                  <span>
                    <strong>Go Pro</strong>
                    <small>Give your creative career a little boost</small>
                  </span>
                </button>
                <button type="button" onClick={() => action(() => onInfo('jobs'))}>
                  <BriefcaseBusiness size={20} />
                  <span>
                    <strong>Find your next opportunity</strong>
                    <small>Good work starts with a great connection</small>
                  </span>
                </button>
                <button type="button" onClick={() => action(() => onInfo('stories'))}>
                  <Heart size={20} />
                  <span>
                    <strong>Designer stories</strong>
                    <small>A little insight, a lot of inspiration</small>
                  </span>
                </button>
              </div>
            )}
          </div>
          <button type="button" className="nav-link" onClick={() => action(onProject)}>
            Hire talent <ArrowUpRight size={14} />
          </button>
        </nav>
      </div>
      <div className="header-right">
        {user ? (
          <div className="nav-item account-nav">
            <button
              type="button"
              className="user-menu-button"
              onClick={() => setMenu(menu === 'account' ? null : 'account')}
              aria-expanded={menu === 'account'}
              aria-label="Account menu"
            >
              <span>{user.name.charAt(0).toUpperCase()}</span>
              <ChevronDown size={14} />
            </button>
            {menu === 'account' && (
              <div className="nav-dropdown account-dropdown">
                <div className="account-greeting">
                  Hello, {user.name.split(' ')[0]} <span>Let’s make something great.</span>
                </div>
                <button type="button" onClick={() => action(() => onBrowse('saved'))}>
                  <Bookmark size={18} />
                  Saved shots ({savedCount})
                </button>
                <button type="button" onClick={() => action(onUpload)}>
                  <Upload size={18} />
                  Share a shot
                </button>
                <button type="button" onClick={() => action(onLogout)}>
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              className="signup-link"
              onClick={() => action(() => onAccount('signup'))}
            >
              Sign up
            </button>
            <button
              type="button"
              className="button button-dark login-button"
              onClick={() => action(() => onAccount('login'))}
            >
              Log in
            </button>
          </>
        )}
      </div>
    </header>
  );
}
