import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { categories, type Category, type Designer, type Shot } from '../data';
import type { DemoUser } from './Header';

interface AccountFormProps {
  mode: 'login' | 'signup';
  onToggle: () => void;
  onSubmit: (user: DemoUser) => void;
}
export function AccountForm({ mode, onToggle, onSubmit }: AccountFormProps) {
  const [name, setName] = useState('');
  return (
    <div className="account-form modal-content">
      <div className="wordmark modal-wordmark">dribbble</div>
      <span className="eyebrow">YOUR NEXT GREAT IDEA STARTS HERE</span>
      <h2>{mode === 'signup' ? 'A home for your creativity.' : 'Welcome back.'}</h2>
      <p>
        {mode === 'signup'
          ? 'Save what inspires you, share what you create, and make your next connection.'
          : 'A little inspiration is waiting. Step back into your creative community.'}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ name: name.trim() || 'Creative' });
        }}
      >
        <label>
          Your name
          <input
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
            minLength={2}
            maxLength={60}
            required
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <button type="submit" className="button button-dark full-width">
          {mode === 'signup' ? 'Create demo account' : 'Enter the demo'}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="demo-note">
        <ShieldCheck size={15} />
        This is a local demo. No real account is created and no email is sent.
      </p>
      <p className="account-switch">
        {mode === 'signup' ? 'Already have an account?' : 'New around here?'}{' '}
        <button type="button" onClick={onToggle}>
          {mode === 'signup' ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
}

interface ProjectFormProps {
  onBrowse: (category: Category) => void;
}
export function ProjectForm({ onBrowse }: ProjectFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Category>('Branding');
  const [budget, setBudget] = useState('$1,000 – $5,000');
  if (submitted)
    return (
      <div className="modal-content success-panel">
        <div className="success-icon">
          <CheckCircle2 size={32} />
        </div>
        <span className="eyebrow">GOOD IDEAS DESERVE GREAT DESIGN</span>
        <h2>Your project brief is ready.</h2>
        <p>Now let’s find the creative partner who can bring it to life.</p>
        <div className="brief-summary">
          <strong>{title}</strong>
          <span>
            {type} <span>·</span> {budget}
          </span>
        </div>
        <button
          type="button"
          className="button button-dark full-width"
          onClick={() => onBrowse(type)}
        >
          Explore matching designers <ArrowRight size={17} />
        </button>
        <p className="demo-note">
          This demo doesn’t send your brief to Dribbble or to any designer.
        </p>
      </div>
    );
  return (
    <div className="modal-content project-form">
      <span className="eyebrow">LET’S MAKE SOMETHING GREAT</span>
      <h2>
        Big idea?
        <br />
        Meet your perfect designer.
      </h2>
      <p>Tell us a little about your project. We’ll help you find the right creative talent.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <label>
          What are you working on?
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A fresh identity for my coffee brand"
            minLength={3}
            maxLength={100}
            required
          />
        </label>
        <div className="form-two-col">
          <label>
            Design specialty
            <select
              aria-label="Design specialty"
              value={type}
              onChange={(event) => setType(event.target.value as Category)}
            >
              {categories
                .filter((category) => category !== 'Discover')
                .map((category) => (
                  <option key={category}>{category}</option>
                ))}
            </select>
          </label>
          <label>
            Your budget
            <select
              aria-label="Your budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            >
              <option>Under $1,000</option>
              <option>$1,000 – $5,000</option>
              <option>$5,000 – $10,000</option>
              <option>$10,000+</option>
            </select>
          </label>
        </div>
        <label>
          A little more about your idea
          <textarea
            placeholder="Your goals, your vision, and anything a designer should know…"
            rows={3}
            minLength={10}
            maxLength={1500}
            required
          />
        </label>
        <button type="submit" className="button button-dark full-width">
          Create your project brief <Sparkles size={17} />
        </button>
      </form>
      <p className="demo-note">Free to explore. This is a demo; no project is submitted.</p>
    </div>
  );
}

interface ContactFormProps {
  designer: Designer;
  onClose: () => void;
}
export function ContactForm({ designer, onClose }: ContactFormProps) {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="modal-content success-panel">
        <div className="success-icon">
          <CheckCircle2 size={32} />
        </div>
        <h2>A great connection starts here.</h2>
        <p>
          Your inquiry for <strong>{designer.name}</strong> is ready. In a connected app, this is
          where the conversation would begin.
        </p>
        <div className="demo-callout">
          <ShieldCheck size={20} />
          <p>This is a frontend demo. No message or email has actually been sent.</p>
        </div>
        <button type="button" className="button button-dark" onClick={onClose}>
          Keep exploring <ArrowRight size={17} />
        </button>
      </div>
    );
  return (
    <div className="modal-content contact-form">
      <div className="contact-person">
        <img src={designer.avatar} alt="" width="58" height="58" />
        <div>
          <strong>{designer.name}</strong>
          <span className="availability">
            <i />
            {designer.available ? 'Available for work' : 'Open to future projects'}
          </span>
        </div>
      </div>
      <h2>Let’s make it happen.</h2>
      <p>Good things start with a hello. Tell {designer.name} what you have in mind.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div className="form-two-col">
          <label>
            Your name
            <input name="name" autoComplete="name" placeholder="Your name" minLength={2} required />
          </label>
          <label>
            Email address
            <input
              name="email"
              autoComplete="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
        </div>
        <label>
          Your message
          <textarea
            name="message"
            rows={4}
            placeholder="Hi! I love your work. I’m looking for help with…"
            minLength={10}
            maxLength={1500}
            required
          />
        </label>
        <button type="submit" className="button button-dark full-width">
          Preview your inquiry <ArrowUpRight size={17} />
        </button>
      </form>
      <p className="demo-note">Your details aren’t stored or sent to anyone in this demo.</p>
    </div>
  );
}

interface UploadFormProps {
  onUpload: (shot: Shot) => void;
}
export function UploadForm({ onUpload }: UploadFormProps) {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Web Design');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const readImage = (file: File | undefined) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Please choose a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Please choose an image smaller than 5 MB.');
      return;
    }
    setError('');
    setLoading(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setError('That image couldn’t be read. Please try another.');
      setLoading(false);
    };
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        setError('That image couldn’t be opened. Please try another.');
        setLoading(false);
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(1, 1200 / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/webp', 0.85));
        setLoading(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };
  const onFile = (event: ChangeEvent<HTMLInputElement>) => readImage(event.target.files?.[0]);
  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    readImage(event.dataTransfer.files[0]);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!image) {
      setError('Add an image to share your shot.');
      return;
    }
    onUpload({
      id: `user-${Date.now()}`,
      title: title.trim(),
      image,
      designerId: 'you',
      categories: [category],
      tags: [category.toLowerCase(), 'community'],
      color: 'neutral',
      likes: 0,
      views: 1,
      daysAgo: 0,
      description: description.trim() || 'A new design, fresh from the creative community.',
    });
  };
  return (
    <div className="modal-content upload-form">
      <span className="eyebrow">MADE SOMETHING YOU LOVE?</span>
      <h2>Share it with the world.</h2>
      <p>Your next great connection could start with a single shot.</p>
      <form onSubmit={submit}>
        <div
          className={`upload-dropzone ${dragging ? 'is-dragging' : ''} ${image ? 'has-image' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {image ? (
            <>
              <img src={image} alt="Your shot preview" />
              <button
                type="button"
                className="icon-button remove-upload"
                onClick={() => {
                  setImage('');
                  if (fileInput.current) fileInput.current.value = '';
                }}
                aria-label="Remove uploaded image"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="upload-prompt"
              onClick={() => fileInput.current?.click()}
            >
              <ImagePlus size={31} />
              <strong>
                {loading ? 'Getting your image ready…' : 'Drop your design here, or browse'}
              </strong>
              <span>JPG, PNG, WebP, or GIF. Up to 5 MB.</span>
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            tabIndex={-1}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFile}
            className="sr-only"
            aria-label="Upload design image"
          />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label>
          Give your shot a title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Something worth sharing"
            maxLength={100}
            minLength={3}
            required
          />
        </label>
        <label>
          Category
          <select
            aria-label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
          >
            {categories
              .filter((cat) => cat !== 'Discover')
              .map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
          </select>
        </label>
        <label>
          A little context <span className="optional">(optional)</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What’s the story behind your design?"
            rows={2}
            maxLength={1000}
          />
        </label>
        <button type="submit" className="button button-dark full-width" disabled={loading}>
          Publish your shot <Upload size={17} />
        </button>
      </form>
      <p className="demo-note">
        Your shot is shared in this session only, not uploaded to Dribbble.
      </p>
    </div>
  );
}

interface InfoPanelProps {
  topic: string;
  onAccount: () => void;
  onProject: () => void;
  onClose: () => void;
}
export function InfoPanel({ topic, onAccount, onProject, onClose }: InfoPanelProps) {
  if (topic === 'pro')
    return (
      <div className="modal-content pro-panel">
        <span className="pill-label">
          <Sparkles size={14} /> DRIBBBLE PRO
        </span>
        <h2>
          Your creativity.
          <br />A little more possibility.
        </h2>
        <p>Put your best work forward and make it easier for your next great client to find you.</p>
        <div className="pro-price">
          $8 <span>/ month, billed annually</span>
        </div>
        <ul className="check-list">
          {[
            'A portfolio that’s unmistakably you',
            'More visibility in designer searches',
            'A place to showcase your services',
            'An ad-free inspiration feed',
          ].map((text) => (
            <li key={text}>
              <Check size={17} />
              {text}
            </li>
          ))}
        </ul>
        <button type="button" className="button button-dark full-width" onClick={onAccount}>
          Explore a demo account <ArrowRight size={17} />
        </button>
        <p className="demo-note">
          Illustrative pricing. No payment or subscription is available in this demo.
        </p>
      </div>
    );
  if (topic === 'jobs')
    return (
      <div className="modal-content">
        <span className="eyebrow">GREAT WORK. GREAT PEOPLE.</span>
        <h2>Your next chapter starts here.</h2>
        <p>A few sample opportunities from the creative world.</p>
        <div className="job-list">
          {[
            ['Senior Brand Designer', 'A little independent studio', 'Remote · Full-time'],
            ['Product Designer', 'An ambitious fintech startup', 'New York · Contract'],
            ['Illustrator', 'A thoughtful lifestyle brand', 'Anywhere · Freelance'],
          ].map(([role, company, location]) => (
            <button type="button" key={role} onClick={onProject}>
              <div>
                <strong>{role}</strong>
                <span>{company}</span>
                <small>
                  <MapPin size={12} />
                  {location}
                </small>
              </div>
              <ChevronRight size={20} />
            </button>
          ))}
        </div>
        <p className="demo-note">
          Sample listings for this frontend recreation, not real job openings.
        </p>
      </div>
    );
  if (topic === 'stories' || topic === 'resources')
    return (
      <div className="modal-content">
        <span className="eyebrow">A LITTLE INSIGHT. A LOT OF INSPIRATION.</span>
        <h2>From one creative to another.</h2>
        <p>Ideas and perspectives for a more inspired creative practice.</p>
        <div className="story-list">
          {[
            ['01', 'Finding your creative voice', 'Make space for the work that feels like you.'],
            ['02', 'The art of a better portfolio', 'Tell a story, not just a list of projects.'],
            [
              '03',
              'Good design starts with curiosity',
              'A fresh perspective is closer than you think.',
            ],
          ].map(([number, title, description]) => (
            <a key={number} href="https://dribbble.com/stories" target="_blank" rel="noreferrer">
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
              <ArrowUpRight size={19} />
            </a>
          ))}
        </div>
        <p className="demo-note">
          Read more on Dribbble’s actual design blog. Links open in a new tab.
        </p>
      </div>
    );
  const content: Record<string, { title: string; description: string; detail: string }> = {
    hiring: {
      title: 'Good design is good business.',
      description: 'Find the right person to turn your next big idea into something real.',
      detail:
        'Browse work you love, find a designer whose style feels right, and start a conversation. From a new brand to your next digital product, your creative partner is out there.',
    },
    about: {
      title: 'A world of creative possibility.',
      description: 'Dribbble brings together people who love design.',
      detail:
        'This is an independent frontend recreation of the Dribbble experience, made as a design and development demo. It is not affiliated with, endorsed by, or connected to Dribbble.',
    },
    terms: {
      title: 'A few things to know.',
      description: 'This website is an independent frontend demo.',
      detail:
        'No real services, accounts, subscriptions, or payments are provided. Likes and saved shots stay in your browser. Featured imagery is shown for demonstration; original artwork belongs to its respective creators. Please don’t enter sensitive personal information.',
    },
    privacy: {
      title: 'Your creativity. Your privacy.',
      description: 'This demo keeps things local.',
      detail:
        'Your saved shots, likes, and demo display name are stored only in your browser’s local storage. Form details are not sent to a server. Uploaded shots are kept in memory for this session. Clear your browser’s site data to remove saved preferences.',
    },
    cookies: {
      title: 'No tracking, just inspiration.',
      description: 'This demo does not use advertising or tracking cookies.',
      detail:
        'Local browser storage is used to remember your likes, saved shots, and optional demo display name. Nothing is shared with Dribbble, designers, or advertisers.',
    },
  };
  const item = content[topic] ?? content.about;
  return (
    <div className="modal-content info-panel">
      <span className="eyebrow">THE DETAILS, SIMPLY PUT</span>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <div className="info-detail">{item.detail}</div>
      <button
        type="button"
        className="button button-dark"
        onClick={topic === 'hiring' ? onProject : onClose}
      >
        {topic === 'hiring' ? 'Start your project brief' : 'Back to inspiration'}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
