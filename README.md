# Dribbble Clone

A faithful, responsive front-end clone of the [Dribbble](https://dribbble.com) homepage — the leading destination where designers share, grow, and get hired.

Built as a single static page with **HTML + Tailwind CSS (Play CDN)** and vanilla **JavaScript**. No build step required.

## Features

- **Sticky top navigation** with Dribbble logo, hover dropdowns (Explore / Hire a Designer), search, and auth buttons
- **Hero** with headline, functional search, and popular tag chips
- **Shot feed** in a Pinterest-style masonry grid with working filter tabs — *Popular*, *New & Noteworthy*, *Fresh*
  - Hover overlays, like/save actions, author + like/view/comment counts
  - Like buttons toggle and update counts live
  - Search filters shots by title, author, category, and tag
  - "Load more" paginates additional shots
- **Hire CTA** banner and **designer spotlights** rail with follow buttons
- **Sign up / Sign in modal** and dismissible promo bar
- Fully **responsive** with a mobile hamburger menu, plus toast notifications

## Run locally

Any static file server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

> The page pulls Tailwind, the Poppins font, Unsplash images, and pravatar avatars from CDNs, so an internet connection is needed for full styling/assets.

## Files

- `index.html` — the entire site (markup, styles, and scripts)
