# TASKS.md — Build Roadmap

Check items off as completed. Work top to bottom.

## Phase 0 — Setup
- [ ] Collect assets and answers from Saniya (see CONTENT.md checklist, PRD §10)
- [ ] Add reference site/image notes to DESIGN.md §14
- [x] Init repo: Vite + React + TS, Tailwind, React Router, Framer Motion, Zustand
- [x] Create `tokens.css` + Tailwind theme from DESIGN.md (including new `--gold`, `--cap-white`, `--jar-mask`)
- [x] Load Google Fonts (Pinyon Script, Playfair Display, DM Sans)

## Phase 1 — Core Storefront (static data)
- [x] `products.json` with 6 live products across 4 product lines with real prices
- [x] Base components: Button, Container, Section, Doodle, Logo, Sticker
- [x] Header, MobileMenu, Footer, Marquee
- [x] Home: Hero, The Collection, Why Choose, Story Teaser, Newsletter
- [x] Shop page: category filters (All, Lip Balm, Lip Mask, Lip Tint, Lip Gloss) + sort
- [x] Product page: packaging-aware gallery, details, accordions, related
- [x] Cart store + CartDrawer + toasts
- [x] WhatsApp order handoff (prefilled message with real ₹ prices)
- [x] About, Our Story, Contact (form via Resend or Formspree)
- [x] Legal pages (shipping, returns, privacy, terms, patch-test note)
- [x] 404 + empty states

## Phase 2 — Polish
- [x] Motion: scroll reveal, floating tin, hearts, add-to-cart heart pop
- [x] Accessibility pass (focus, contrast, alt text, keyboard)
- [x] Image optimization (WebP, sizes, lazy, vector packaging SVG fallback)
- [x] SEO: meta, OG images, JSON-LD with real INR prices, sitemap, robots
- [x] Analytics + Meta Pixel events
- [x] Lighthouse mobile ≥ 90

## Phase 3 — Supabase Backend & Direct Ordering Pipeline
- [x] Stage 1: Schema and Data Layer
  - [x] `supabase/schema.sql` (Postgres tables, triggers, RLS policies, storage bucket, seed products)
  - [x] Supabase client singleton (`src/lib/supabase.ts`) with safe offline/fallback handling
  - [x] TypeScript types (`src/types/supabase.ts`, updated commerce types)
  - [x] `.env.example` and `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - [x] `docs/ADMIN_GUIDE.md` for non-technical owner
- [x] Stage 2: Public Site Reading from Database
  - [x] Products, prices, and photos dynamically fetched from Supabase (with `products.json` fallback)
  - [x] Real-time updates / instant price reflections
  - [x] Responsive testing at 375px & 1280px
- [x] Stage 3: Enquiry Saving & Social Ordering Handoff
  - [x] "Order on WhatsApp" and "Order on Instagram" (@saylipss.co DM) buttons on product page and CartDrawer
  - [x] Cart snapshot, channel, timestamp, and optional customer info saved to `enquiries` table before chat launch
  - [x] Prefilled social messaging with cart items, deal codes, and total in ₹
  - [x] Responsive testing at 375px & 1280px
- [x] **Pre-Stage 4 Milestone: Catalogue & Real Packaging Illustrations Update**
  - [x] Added `category` ("lip-balm" | "lip-mask" | "lip-tint" | "lip-gloss") and `packaging` ("tin" | "jar" | "bottle") to types, fallback JSON, and Supabase schema with ALTER statements
  - [x] 4 product lines live (6 products) at real prices (Balms ₹299 / 29900, Mask ₹199 / 19900, Tint ₹349 / 34900, Gloss ₹349 / 34900)
  - [x] "100% Organic & Homemade" claim restricted strictly to Lip Balms (printed on physical label) until confirmed for mask, tint, gloss
  - [x] `TinIllustration` updated to silver slider tin with top rivet, white rectangular vertical label, real colors, and soft cream balm well
  - [x] `JarIllustration` created with metallic gold rim lid, cream label, and pale blue-grey mask visible in clear glass
  - [x] `BottleIllustration` created with thick-glass base embossed with "SAY By Saniya" in script, white matte faceted cap, liquid fill, and "Cap off" wand state
  - [x] `ProductImage`, `ProductCard`, and gallery pick illustration from `packaging` with real-photo fallback (`public/products/{slug}/hero.webp`)
  - [x] Gallery toggle labels: tin = "Open / Closed", jar = "Lid on / Lid off", bottle = "Capped / Cap off"
  - [x] Shop filter updated to Category (All, Lip Balm, Lip Mask, Lip Tint, Lip Gloss) plus sort
  - [x] Home "Featured Flavors" updated to "The Collection" showing all 6 products; "Future Favorites" hidden unless site setting enables it
  - [x] Admin product form: added category, packaging, price in ₹, and "Apply this price to all products in this category" button
- [x] Stage 4: Admin Portal — Auth, Products & Storage Photos
  - [x] `/admin` hidden route with noindex, Supabase Auth email/password, allowlisted admin check
  - [x] Dashboard counters: enquiries, orders by status, pending reviews, active deals
  - [x] Product CRUD: add, edit, delete, reorder, stock, price, status, badges, category, packaging, batch price apply
  - [x] Photo manager: Supabase Storage upload, multi-image, set-hero, preview, compress/resize, delete
  - [x] Mobile-first admin layout (fully usable on 375px phone)
- [x] Stage 5: Special Deals System
  - [x] Dedicated `/deals` page, deals strip on Home, optional announcement banner
  - [x] Deals manager in Admin: create, edit, schedule (start/end dates), pause, delete
  - [x] Discount types: percent off, flat off, fixed sale price, bundle
  - [x] Strike-through pricing, countdown timer / "ends on" badge, promo code inclusion in social chat
  - [x] Responsive testing at 375px & 1280px
- [ ] Stage 6: Enquiries & Orders Management
  - [ ] Admin enquiry log with status tracking
  - [ ] One-click "Convert Enquiry to Order" with customer handle/phone, items, amount in paise, channel
  - [ ] Order status pipeline: new → confirmed → packed → shipped → delivered / cancelled
  - [ ] Courier / tracking notes, search & filter by date/status, CSV export
  - [ ] Responsive testing at 375px & 1280px
- [ ] Stage 7: Reviews & Testimonials Moderation
  - [ ] Public review submission with honeypot, rate limiting, length checks, optional Turnstile
  - [ ] Admin moderation queue: Pending reviews tab with Approve and Delete
  - [ ] Admin manual testimonial creator with photo and Instagram handle
  - [ ] Public display: approved reviews on product pages, Home testimonial strip with average star rating
  - [ ] Site settings editor (WhatsApp, Instagram, banner text, shipping note)
  - [ ] Responsive testing at 375px & 1280px

---

## Owner Input Checklist (`[TBD]` & `[confirm]` with Saniya)
1. **[confirm] Lip Tint Shade Name:** Confirm if official shade title is "Blood Water" or another name.
2. **[confirm] Strawberry Jam Label Color:** Confirm exact hex / Pantone for Strawberry Jam label accent (currently using pink token `#F0A8BE`).
3. **[confirm] 100% Organic & Homemade Claims:** Confirm if "100% Organic" and "Homemade" claims apply to Over Night Lip Mask, Lip Tint, and Lip Gloss, or strictly Lip Balms.
4. **[confirm] Net Sizes:** Confirm net weight/volume for each line (slider tin: 15g?, round jar: 10g/15g?, faceted bottle: 5ml?).
5. **[confirm] Ingredients:** Provide INCI ingredient lists for all 6 products.
6. **[confirm] Long Product Descriptions:** Provide extended product copy/descriptions for all 6 products.
7. **[confirm] Saniya's Founder Story:** Provide real founder story for Our Story page.
