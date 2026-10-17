# TECH_STACK.md — Architecture & Tooling

## Architecture Recommendation

| Layer | Choice | Why |
|---|---|---|
| **Frontend Framework** | **React 18 + Vite + TypeScript** | High performance, instant HMR, modern typed storefront |
| **Routing** | **React Router v6** | Client-side routing with Vercel SPA rewrites (`vercel.json`) |
| **Styling** | **Tailwind CSS + CSS variables** | Tokens from `DESIGN.md` in `tokens.css`; zero hardcoded hex |
| **Animation** | **Framer Motion** | Opening tin intro, scroll-reveal fade-ups, add-to-cart heart pop |
| **State Management** | **Zustand** with `localStorage` persistence | Cart store (`sbs_cart_v1`) |
| **Backend & Database** | **Supabase (Managed PostgreSQL)** | Relational data, instant API via `@supabase/supabase-js` |
| **Authentication** | **Supabase Auth (GoTrue)** | Secure email/password login for admin portal at `/admin` |
| **File / Media Storage** | **Supabase Storage** | S3-compatible bucket (`product-images`) for high-res product photos |
| **Security** | **Row Level Security (RLS)** | Database-enforced permissions on every table; admin allowlist |
| **Ordering Channels** | **WhatsApp & Instagram DM** | Zero-friction ordering, enquiry snapshots saved before launch |
| **Hosting** | **Vercel** | Global edge network with SPA routing |
| **Icons** | **Custom SVG Doodles + Lucide** | Brand hand-drawn SVGs (bow, heart, star, squiggle) |
| **Fonts** | **Google Fonts** (display=swap, non-blocking) | Pinyon Script, Playfair Display, DM Sans, Archivo Black |

---

## Folder Structure

```text
sayby-saniya/
├── docs/                     # PRD, DATA_MODEL, LAUNCH_CHECKLIST, ADMIN_GUIDE
├── public/
│   ├── products/             # Optional local fallback product images
│   ├── favicon.svg           # Brand bow favicon
│   ├── og-image.png          # 1200x630 social preview card
│   ├── robots.txt            # Crawl instructions
│   └── sitemap.xml           # XML sitemap
├── supabase/
│   └── schema.sql            # Complete DB schema, RLS policies, Storage buckets, and seed data
├── src/
│   ├── assets/               # Doodles and visual assets
│   ├── components/
│   │   ├── admin/            # Admin dashboard, product form, deals, orders, reviews moderation
│   │   ├── brand/            # Logo, Doodle, Sticker, MemeBlock, FloatingHearts
│   │   ├── commerce/         # ProductCard, ProductGrid, ProductImage, CartDrawer, PriceTag, Deals
│   │   ├── common/           # SEO, ScrollReveal, ErrorBoundary
│   │   ├── home/             # Hero, TinIntroAnimation, FeaturedFlavors, WhyChoose, StoryTeaser, Newsletter
│   │   └── layout/           # Header, MobileMenu, Footer, Marquee, Container, Section
│   ├── data/
│   │   └── products.json     # Static seed and offline fallback
│   ├── hooks/                # useProducts, useDeals, useReviews, useAdminAuth
│   ├── lib/                  # supabase.ts, whatsapp.ts, instagram.ts, analytics.ts, site.ts
│   ├── pages/                # Home, Shop, ProductDetail, Deals, About, OurStory, Contact, Legal, NotFound, Admin
│   ├── store/                # cart.ts (Zustand cart with enquiry snapshots)
│   ├── styles/               # tokens.css, index.css
│   └── types/                # product.ts, deal.ts, order.ts, review.ts, supabase.ts
├── .env.example
├── tailwind.config.ts
├── vercel.json
└── vite.config.ts
```

---

## Environment Variables

```env
# Website URL
VITE_SITE_URL=https://saylipss.co

# WhatsApp Order Phone Number
VITE_WHATSAPP_NUMBER=919999999999

# Instagram Handle
VITE_INSTAGRAM_HANDLE=saylipss.co

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Cloudflare Turnstile for Review Spam Protection
VITE_TURNSTILE_SITE_KEY=

# Optional Analytics
VITE_PLAUSIBLE_DOMAIN=
VITE_GA_ID=
VITE_META_PIXEL_ID=
```
