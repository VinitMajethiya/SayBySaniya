# SEO_AND_ANALYTICS.md

## Goals
Rank for "homemade lip balm India", "organic lip balm", flavor names + brand; look great when shared on Instagram/WhatsApp.

## On-Page
- One `<h1>` per page; descriptive `alt` on all images.
- Unique title ≤ 60 chars, meta description ≤ 155 chars (see `CONTENT.md`).
- Clean URLs: `/shop`, `/product/strawberry-jam`.
- Internal links: product ↔ related flavors, Home → Shop, Story → Shop.
- Canonical tags; `sitemap.xml` and `robots.txt` in `/public`.

## Structured Data (JSON-LD)
- `Organization` (name, logo, `sameAs`: Instagram URL).
- `Product` per product page: name, image, description, brand, `offers` (price, INR, availability), `sku`.
- `BreadcrumbList` on product pages.

## Social Sharing
- Open Graph + Twitter card on every page; default `og-image` 1200×630 on cream with logo + hero tin.
- Per-product OG image uses the product hero shot.

## Performance (affects SEO)
- Targets in `TECH_STACK.md`; prerender key pages (Home, Shop, Products, About, Story).

## Analytics & Tracking
- Plausible or GA4: pageviews, `add_to_cart`, `begin_checkout`, `purchase`, `whatsapp_order_click`, `notify_me_submit`, `contact_submit`.
- Meta Pixel for Instagram ad retargeting (events: ViewContent, AddToCart, InitiateCheckout, Purchase).
- UTM convention for Instagram bio/stories: `?utm_source=instagram&utm_medium=bio|story|reel&utm_campaign=<name>`.
- Cookie/consent banner if required; keep it styled per DESIGN.md.

## Instagram Integration
- Link in bio → `/shop` or a link hub landing.
- Footer + header IG link to `@saylipss.co`.
- Phase 2: embed/curated IG grid (manual image list first; API later).
