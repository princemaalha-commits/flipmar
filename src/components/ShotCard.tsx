import { Bookmark, Eye, Heart, ArrowUpRight, MapPin, Star } from 'lucide-react';
import { formatCount, getDesigner, type Designer, type Shot } from '../data';

interface ShotCardProps {
  shot: Shot;
  liked: boolean;
  saved: boolean;
  onOpen: (shot: Shot) => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDesigner: (designer: Designer) => void;
  priority?: boolean;
}

export default function ShotCard({
  shot,
  liked,
  saved,
  onOpen,
  onLike,
  onSave,
  onDesigner,
  priority = false,
}: ShotCardProps) {
  const designer = getDesigner(shot.designerId);
  return (
    <article className="shot-card">
      <div className="shot-image-wrap">
        <button
          type="button"
          className="shot-open"
          onClick={() => onOpen(shot)}
          aria-label={`View ${shot.title}`}
        >
          <img
            src={shot.image}
            alt={shot.title}
            loading={priority ? 'eager' : 'lazy'}
            width="800"
            height="600"
          />
        </button>
        {saved && (
          <span className="saved-marker" role="img" aria-label="Saved">
            <Bookmark size={15} fill="currentColor" />
          </span>
        )}
        {shot.categories.includes('Animation') && (
          <span className="motion-marker" role="img" aria-label="Animation">
            <span /> <span /> <span />
          </span>
        )}
        <div className="shot-overlay">
          <button type="button" className="shot-title" onClick={() => onOpen(shot)}>
            {shot.title}
          </button>
          <button
            type="button"
            className={`overlay-action ${saved ? 'is-saved' : ''}`}
            onClick={() => onSave(shot.id)}
            aria-label={`${saved ? 'Unsave' : 'Save'} ${shot.title}`}
            aria-pressed={saved}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            className={`overlay-action ${liked ? 'is-liked' : ''}`}
            onClick={() => onLike(shot.id)}
            aria-label={`${liked ? 'Unlike' : 'Like'} ${shot.title}`}
            aria-pressed={liked}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <div className="shot-meta">
        <button
          type="button"
          className="designer-identity"
          onClick={() => onDesigner(designer)}
          aria-label={`View ${designer.name}'s profile`}
        >
          <img src={designer.avatar} alt="" width="24" height="24" />
          <span className="designer-name">{designer.name}</span>
          <span className="pro-badge">{designer.badge}</span>
        </button>
        <div className="shot-stats">
          <button
            type="button"
            className={`like-stat ${liked ? 'is-liked' : ''}`}
            onClick={() => onLike(shot.id)}
            aria-label={`${liked ? 'Unlike' : 'Like'} ${shot.title}`}
            aria-pressed={liked}
          >
            <Heart size={13} fill="currentColor" strokeWidth={0} />
            <span>{formatCount(shot.likes + (liked ? 1 : 0))}</span>
          </button>
          <span className="view-stat" title={`${shot.views.toLocaleString()} views`}>
            <Eye size={14} fill="currentColor" stroke="white" strokeWidth={1.7} />
            <span>{formatCount(shot.views)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

interface DesignerCardProps {
  designer: Designer;
  work: Shot[];
  onOpen: (designer: Designer) => void;
  onContact: (designer: Designer) => void;
}
export function DesignerCard({ designer, work, onOpen, onContact }: DesignerCardProps) {
  return (
    <article className="designer-card">
      <button
        type="button"
        className="designer-work"
        onClick={() => onOpen(designer)}
        aria-label={`View ${designer.name}'s work`}
      >
        {work.slice(0, 3).map((shot) => (
          <img key={shot.id} src={shot.image} alt={shot.title} loading="lazy" />
        ))}
      </button>
      <div className="designer-card-content">
        <div className="designer-card-title">
          <img src={designer.avatar} alt="" width="48" height="48" />
          <div>
            <button type="button" onClick={() => onOpen(designer)}>
              {designer.name} <span className="pro-badge">{designer.badge}</span>
            </button>
            <p>
              <MapPin size={12} />
              {designer.location}
            </p>
          </div>
        </div>
        <p className="designer-specialty">{designer.specialty}</p>
        <div className="designer-card-bottom">
          <span className={`availability ${!designer.available ? 'unavailable' : ''}`}>
            <i />
            {designer.available ? 'Available for work' : 'Let’s plan ahead'}
          </span>
          <button
            type="button"
            className="small-outline-button"
            onClick={() => onContact(designer)}
          >
            Get in touch <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

interface ServiceCardProps {
  shot: Shot;
  onContact: (designer: Designer) => void;
}
export function ServiceCard({ shot, onContact }: ServiceCardProps) {
  const designer = getDesigner(shot.designerId);
  const service = shot.categories.includes('Branding')
    ? 'A distinctive brand, made for you'
    : shot.categories.includes('Web Design')
      ? 'A beautiful website that works'
      : shot.categories.includes('Mobile')
        ? 'An app your customers will love'
        : 'Illustration with a little personality';
  return (
    <article className="service-card">
      <button
        type="button"
        className="service-cover"
        onClick={() => onContact(designer)}
        aria-label={`Enquire about ${service}`}
      >
        <img src={shot.image} alt={shot.title} width="800" height="600" loading="lazy" />
      </button>
      <div className="service-content">
        <div className="service-designer">
          <img src={designer.avatar} alt="" width="22" height="22" />
          <span>{designer.name}</span>
          <span className="service-rating">
            <Star size={12} fill="currentColor" /> 4.9
          </span>
        </div>
        <button type="button" className="service-title" onClick={() => onContact(designer)}>
          {service}
        </button>
        <div className="service-bottom">
          <span>
            From <strong>${designer.rate.toLocaleString()}</strong>
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => onContact(designer)}
            aria-label={`Contact ${designer.name}`}
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
