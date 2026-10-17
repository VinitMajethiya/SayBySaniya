# PRD.md — Say By Saniya Website

## 1. Overview
A boutique brand + storefront website for **Say By Saniya** (`@saylipss.co`), a homemade, 100% organic lip care brand sold in slim metal slider tins. The site showcases products, shares the brand story, and allows customers to easily order by messaging via **WhatsApp** or **Instagram DM**. Primary traffic source: Instagram (mobile).

## 2. Goals
1. Showcase every product beautifully (flavor, ingredients, price, availability).
2. Convert Instagram visitors into direct conversations and orders via WhatsApp and Instagram DM with zero payment friction.
3. Track and capture customer enquiries in real time upon chat clicks.
4. Allow the owner (Saniya) to manage products, pricing, stock, special deals, customer orders, and reviews via a phone-friendly `/admin` portal without code.
5. Highlight special offers, limited bundles, and customer reviews with spam protection and admin moderation.

## 3. Non-Goals (Scope Adjustment)
- Multi-vendor marketplace, user customer accounts/passwords, online payment gateways (Razorpay dropped in favor of direct WhatsApp/UPI and Instagram order coordination), third-party fulfillment integrations.

## 4. Target Users
- **Shopper (primary):** 16–30, Instagram-native, mobile-first, buys beauty items impulsively and prefers direct chat / UPI.
- **Gifter:** looking for cute bundles and customized notes.
- **Owner (Saniya):** manages products, deals, photo gallery, orders, and reviews from her phone or laptop.

## 5. Current Product Catalogue (4 Product Lines, 6 Products)
| Product Line | Product Name | Packaging | Price (₹ / paise) | Prop / Color Accent | Claims |
|---|---|---|---|---|---|
| Lip Balm | Strawberry Jam | Slider Tin ("tin") | ₹299 (29900) | Strawberry / `#F0A8BE` [confirm] | 100% Organic & Homemade |
| Lip Balm | Honey Butter | Slider Tin ("tin") | ₹299 (29900) | Honey pot / `#E9B76A` | 100% Organic & Homemade |
| Lip Balm | Vanilla Silk | Slider Tin ("tin") | ₹299 (29900) | Vanilla pods / `#D6D4EE` | 100% Organic & Homemade |
| Over Night Lip Mask | Over Night Lip Mask | Round Jar ("jar") | ₹199 (19900) | Pale blue-grey mask / `--jar-mask` | [confirm with owner] |
| Lip Tint | Lip Tint (Shade: Blood Water `[confirm]`) | Faceted Bottle ("bottle") | ₹349 (34900) | Deep wine-red / `--blood` | [confirm with owner] |
| Lip Gloss | Lip Gloss | Faceted Bottle ("bottle") | ₹349 (34900) | High-shine clear gloss / `--future` | [confirm with owner] |

All four lines are live. Prices are stored internally in paise and displayed in ₹. Sizes, ingredients, and long descriptions are marked `[TBD]`. "100% Organic & Homemade" claim is shown on balms only until confirmed for mask, tint, gloss.

## 6. Pages & Requirements

### 6.1 Home (`/`)
- Hero with opening-tin intro animation (once per session, skippable, respects reduced motion).
- Marquee strip: `"NOURISH · TINT · LOVE · 100% ORGANIC ♥"`.
- Active Deals announcement strip / banner (when deals are scheduled).
- The Collection (shows all 6 products; "Future Favorites" card hidden unless enabled in site settings).
- Why Choose Say By Saniya (core promises; balm-specific organic claims highlighted).
- Story Teaser + link to Our Story.
- Customer Testimonials & Approved Reviews strip with average rating.
- Playful Meme Block.
- Newsletter / Drop Alert capture.
- Signature Footer.

### 6.2 Shop All (`/shop`)
- Full product grid, category filters (All, Lip Balm, Lip Mask, Lip Tint, Lip Gloss) plus sort (featured, name, price).
- Badges: New, Best Seller, Limited Drop, Sold Out.
- Active deal sale pricing with original prices struck through.
- Real packaging illustrations picking tin, jar, or bottle SVG with real-photo fallback (`public/products/{slug}/hero.webp`).

### 6.3 Product Detail (`/product/:slug`)
- Interactive image gallery (toggle between open tin and closed slider views).
- Live pricing, deal badge, size, flavor profile notes.
- Quantity selector.
- Primary actions: **"Order on WhatsApp"** and **"Order on Instagram"** (each saves an enquiry snapshot, then launches chat with prefilled message).
- "Add to Cart" button with heart-pop animation.
- Collapsible accordions: Ingredients, How to Use, Shipping & Returns, Skin Patch Test Disclaimer.
- Approved customer reviews list + "Leave a Review" form.
- "You May Also Like" related flavors row.

### 6.4 Special Deals (`/deals`)
- Dedicated offers showcase: percent off, flat discount, fixed sale price, or bundles.
- Deal countdown or end date, applicable products list, and promo code customer mentions in WhatsApp/Instagram chat.

### 6.5 Brand Story & Contact (`/about`, `/our-story`, `/contact`)
- **About Us**: 100% organic, small-batch, pocket-sized philosophy.
- **Our Story**: Founder kitchen origin story.
- **Contact**: Direct WhatsApp message link, Instagram link, and underline contact form.

### 6.6 Cart & Ordering Drawer
- Slide-in cart drawer with item counter, quantity controls, gift note.
- Two direct ordering channels: **"Order on WhatsApp"** and **"Order on Instagram"**.
- Saves an enquiry record (items snapshot, subtotal, channel) to Supabase before redirecting.

### 6.7 Admin Portal (`/admin`)
- Hidden from navigation, protected by Supabase Auth (email/password) and strict Row Level Security.
- Allowlisted admin emails only.
- Responsive and fully usable on a mobile phone.
- **Dashboard**: Counts of new enquiries, orders by status, pending reviews, active deals.
- **Products**: Full CRUD, reordering, status toggles, instant price updates.
- **Photo Manager**: Upload to Supabase Storage, preview, set hero image, delete.
- **Deals**: Create, schedule, pause, and delete promotional deals.
- **Enquiries & Orders**: View customer chats, 1-click convert enquiry to order, tracking pipeline (`new` → `confirmed` → `packed` → `shipped` → `delivered` → `cancelled`), courier notes, CSV export.
- **Reviews Moderation**: Approve/reject customer reviews; manual testimonials manager.
- **Settings**: Update WhatsApp number, Instagram handle, banner text, and shipping notices.

## 7. Tech Architecture
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand.
- **Backend / Database / Storage / Auth:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage).
- **Security:** Strict PostgreSQL Row Level Security (RLS) on all tables and storage buckets. Public access is strictly read-only for active/approved data and insert-only for enquiries/reviews.
