-- ==============================================================================
-- SAY BY SANIYA (@saylipss.co) — Supabase PostgreSQL Schema
-- Homemade Organic Lip Care
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. ADMIN USERS (ALLOWLIST FOR PORTAL ACCESS)
-- ==============================================================================
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role text default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz default now()
);

-- Security helper function to check if the caller is an allowlisted admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ==============================================================================
-- 3. PRODUCTS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- ALTER STATEMENTS (Run these in the Supabase SQL Editor for existing databases):
-- ------------------------------------------------------------------------------
-- alter table public.products 
--   add column if not exists category text not null default 'lip-balm' 
--   check (category in ('lip-balm', 'lip-mask', 'lip-tint', 'lip-gloss'));
--
-- alter table public.products 
--   add column if not exists packaging text not null default 'tin' 
--   check (packaging in ('tin', 'jar', 'bottle'));
--
-- -- Update existing records with correct category, packaging, and real prices:
-- update public.products set category = 'lip-balm', packaging = 'tin', price = 29900 where slug in ('strawberry-jam', 'honey-butter', 'vanilla-silk');
-- update public.products set category = 'lip-mask', packaging = 'jar', price = 19900 where slug = 'over-night-lip-mask';
-- update public.products set category = 'lip-tint', packaging = 'bottle', price = 34900, status = 'available' where slug in ('blood-water-tint', 'lip-tint');
-- update public.products set category = 'lip-gloss', packaging = 'bottle', price = 34900, status = 'available' where slug = 'lip-gloss';
-- ------------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text not null default 'lip-balm' check (category in ('lip-balm', 'lip-mask', 'lip-tint', 'lip-gloss')),
  packaging text not null default 'tin' check (packaging in ('tin', 'jar', 'bottle')),
  subtitle text,
  description text not null,
  flavor_notes text[] default '{}',
  price integer not null,           -- stored in paise (e.g. 29900 = ₹299)
  mrp integer,                      -- stored in paise
  size text default '[TBD]',
  badge text,
  status text default 'available' check (status in ('available', 'sold_out', 'coming_soon', 'limited_drop')),
  is_featured boolean default false,
  stock integer default 25,
  images text[] default '{}',
  ingredients text[] default '{}',
  claims text[] default '{}',
  how_to_use text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================================================================
-- 4. SPECIAL DEALS & PROMOTIONS
-- ==============================================================================
create table if not exists public.deals (
  id uuid primary key default uuid_generate_v4(),
  code text unique,                -- Optional coupon/promo code (e.g. FIRSTLIP)
  title text not null,
  description text,
  image_url text,
  deal_type text not null check (deal_type in ('percent_off', 'flat_off', 'fixed_sale_price', 'bundle')),
  discount_value integer not null, -- % off (e.g. 15) or paise off (e.g. 5000 for ₹50)
  applicable_product_ids uuid[] default '{}', -- empty = applies storewide
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true,
  show_in_banner boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================================================================
-- 5. CUSTOMER ENQUIRIES (SOCIAL CHECKOUT CLICKS)
-- ==============================================================================
create table if not exists public.enquiries (
  id uuid primary key default uuid_generate_v4(),
  channel text not null check (channel in ('whatsapp', 'instagram')),
  customer_name text,
  customer_phone text,
  customer_handle text,
  cart_snapshot jsonb not null,
  total_paise integer not null,
  deal_code text,
  status text default 'new' check (status in ('new', 'converted', 'archived')),
  notes text,
  created_at timestamptz default now()
);

-- ==============================================================================
-- 6. ORDERS (ADMIN CONVERTED / TRACKED)
-- ==============================================================================
create sequence if not exists order_number_seq start with 1001;

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  enquiry_id uuid references public.enquiries(id) on delete set null,
  order_number text unique not null default ('SBS-' || nextval('order_number_seq')),
  customer_name text not null,
  customer_phone text,
  customer_handle text,
  channel text not null check (channel in ('whatsapp', 'instagram', 'direct')),
  items jsonb not null,
  total_paise integer not null,
  status text default 'new' check (status in ('new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  courier_name text,
  tracking_number text,
  tracking_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================================================================
-- 7. REVIEWS (MODERATED CUSTOMER FEEDBACK)
-- ==============================================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete set null,
  product_slug text,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text not null,
  photo_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- ==============================================================================
-- 8. TESTIMONIALS (CURATED FOR HOME STRIP)
-- ==============================================================================
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  instagram_handle text,
  quote text not null,
  photo_url text,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ==============================================================================
-- 9. SITE SETTINGS
-- ==============================================================================
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean default true,
  updated_at timestamptz default now()
);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.deals enable row level security;
alter table public.enquiries enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

-- Admin Users Policies
create policy "Admins can view admin list" on public.admin_users
  for select using (public.is_admin());

-- Products Policies
create policy "Public can view all products" on public.products
  for select using (true);

create policy "Admins have full product access" on public.products
  for all using (public.is_admin());

-- Deals Policies
create policy "Public can view active deals" on public.deals
  for select using (
    is_active = true and
    (starts_at is null or starts_at <= now()) and
    (ends_at is null or ends_at >= now())
  );

create policy "Admins have full deals access" on public.deals
  for all using (public.is_admin());

-- Enquiries Policies
create policy "Public can submit enquiries" on public.enquiries
  for insert with check (true);

create policy "Admins have full enquiries access" on public.enquiries
  for all using (public.is_admin());

-- Orders Policies
create policy "Admins have full orders access" on public.orders
  for all using (public.is_admin());

-- Reviews Policies
create policy "Public can view approved reviews" on public.reviews
  for select using (status = 'approved');

create policy "Public can submit pending reviews" on public.reviews
  for insert with check (status = 'pending');

create policy "Admins have full reviews access" on public.reviews
  for all using (public.is_admin());

-- Testimonials Policies
create policy "Public can view active testimonials" on public.testimonials
  for select using (is_active = true);

create policy "Admins have full testimonials access" on public.testimonials
  for all using (public.is_admin());

-- Site Settings Policies
create policy "Public can read public site settings" on public.site_settings
  for select using (is_public = true);

create policy "Admins have full site settings access" on public.site_settings
  for all using (public.is_admin());

-- ==============================================================================
-- 11. STORAGE BUCKET (PRODUCT-IMAGES)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admins can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and public.is_admin()
  );

create policy "Admins can update product images" on storage.objects
  for update using (
    bucket_id = 'product-images' and public.is_admin()
  );

create policy "Admins can delete product images" on storage.objects
  for delete using (
    bucket_id = 'product-images' and public.is_admin()
  );

-- ==============================================================================
-- 12. SEED INITIAL DATA
-- ==============================================================================

-- Products Seed (matching src/data/products.json)
insert into public.products (slug, name, category, packaging, subtitle, description, flavor_notes, price, mrp, size, badge, status, is_featured, stock, images, ingredients, claims, how_to_use, sort_order)
values
(
  'strawberry-jam',
  'Strawberry Jam',
  'lip-balm',
  'tin',
  'Summer berries in sweet organic beeswax',
  'Our signature organic lip balm packed with pure, raw ingredients. Melts like real strawberry preserve on warm toast, giving lips an ultra-glossy hydrated glaze without stickiness.',
  array['Ripe field strawberries', 'Warm sugar glaze', 'Sunlit garden berry'],
  29900,
  null,
  '[TBD]',
  'Bestseller',
  'available',
  true,
  25,
  array['/products/strawberry-jam/hero.webp', '/products/strawberry-jam/open.webp'],
  array['[TBD]'],
  array['100% Organic & Homemade', 'Nourish. Tint. Love.', 'Pocket-Sized Slider Tin'],
  'Slide the tin open with your thumb. Dab a small amount onto your lips with clean fingertips. Layer generously before sleep as an overnight lip glaze mask.',
  1
),
(
  'honey-butter',
  'Honey Butter',
  'lip-balm',
  'tin',
  'Golden raw honey whipped with velvety shea',
  'Whipped pure golden goodness. Nourishes dry and flaky lips with deep, soothing richness. Infused with natural raw honey notes and rich unrefined butter.',
  array['Golden honeycomb', 'Salted cream butter', 'Warm vanilla bean'],
  29900,
  null,
  '[TBD]',
  null,
  'available',
  true,
  25,
  array['/products/honey-butter/hero.webp', '/products/honey-butter/open.webp'],
  array['[TBD]'],
  array['100% Organic & Homemade', 'Nourish. Tint. Love.', 'Pocket-Sized Slider Tin'],
  'Gently glide onto lips whenever they feel parched or before stepping out into windy air.',
  2
),
(
  'vanilla-silk',
  'Vanilla Silk',
  'lip-balm',
  'tin',
  'Pure Madagascan vanilla bean & sweet almond oil',
  'A classic whisper of pure Madagascan vanilla swirled in silky sweet almond oil. Leaves lips pillow-soft, weightlessly cushioned, and smelling like fresh baked pastry.',
  array['Madagascan vanilla bean', 'Soft bakery warmth', 'Sweet spun sugar'],
  29900,
  null,
  '[TBD]',
  null,
  'available',
  true,
  25,
  array['/products/vanilla-silk/hero.webp', '/products/vanilla-silk/open.webp'],
  array['[TBD]'],
  array['100% Organic & Homemade', 'Nourish. Tint. Love.', 'Pocket-Sized Slider Tin'],
  'Smooth over clean lips. Wear alone for a velvety natural sheen or layer over lip stain for soft luster.',
  3
),
(
  'over-night-lip-mask',
  'Over Night Lip Mask',
  'lip-mask',
  'jar',
  'Deep overnight lip cushion in a clear round jar with gold rim',
  'A deeply restorative overnight lip mask in a shallow clear jar with gold rim lid. Seals in moisture while you sleep so you wake up to revived, pillowy-soft lips.',
  array['Soft botanical cushion [TBD]'],
  19900,
  null,
  '[TBD]',
  null,
  'available',
  true,
  25,
  array['/products/over-night-lip-mask/hero.webp', '/products/over-night-lip-mask/open.webp'],
  array['[TBD]'],
  array[]::text[],
  'Smooth a generous layer over clean lips before sleep. Wake up to pillow-soft, revived lips.',
  4
),
(
  'blood-water-tint',
  'Lip Tint',
  'lip-tint',
  'bottle',
  'Deep wine-red lip tint. Shade: Blood Water [confirm with owner]',
  'A velvety liquid lip tint in a short faceted glass bottle. Delivers a dramatic deep wine-red wash with lightweight, non-drying cushion.',
  array['Crushed berry [TBD]'],
  34900,
  null,
  '[TBD]',
  null,
  'available',
  true,
  25,
  array['/products/blood-water-tint/hero.webp', '/products/blood-water-tint/open.webp'],
  array['[TBD]'],
  array[]::text[],
  'Apply directly to lips using the plush doe-foot wand. Blend outward for a soft stain or build for dramatic wine-red depth.',
  5
),
(
  'lip-gloss',
  'Lip Gloss',
  'lip-gloss',
  'bottle',
  'High-shine clear glossy finish with radiant glass luster',
  'Luminous, glass-like shine in a short clear bottle with white faceted cap. Non-sticky formula cushions lips with brilliant mirror reflection.',
  array['Crystal sheen [TBD]'],
  34900,
  null,
  '[TBD]',
  null,
  'available',
  true,
  25,
  array['/products/lip-gloss/hero.webp', '/products/lip-gloss/open.webp'],
  array['[TBD]'],
  array[]::text[],
  'Glide the plush wand over bare lips for crystal glass shine or layer over lip tint for ultra-reflective dimension.',
  6
)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  packaging = excluded.packaging,
  price = excluded.price,
  status = excluded.status,
  is_featured = excluded.is_featured;

-- Initial Site Settings
insert into public.site_settings (key, value)
values
(
  'general',
  '{
    "whatsapp_number": "919999999999",
    "instagram_handle": "saylipss.co",
    "announcement_banner": "🌸 Handcrafted organic lip balms in pocket slider tins • Order directly on WhatsApp & Instagram",
    "shipping_note": "Handmade in small batches in India. Orders typically dispatch within 24-48 hours via standard courier."
  }'::jsonb
)
on conflict (key) do nothing;

-- Sample Testimonial Seed
insert into public.testimonials (author_name, instagram_handle, quote, rating, is_active, sort_order)
values
('Ananya M.', '@ananyaloves', 'The slider tin is so chic in my pocket and Strawberry Jam smells like actual fresh strawberries. Never buying chemical balms again!', 5, true, 1),
('Riya S.', '@riyabeauty', 'Honey Butter saved my chapped lips overnight. Knowing it is 100% homemade and organic makes it a permanent favorite.', 5, true, 2),
('Meera K.', '@meerapov', 'The texture is like velvet silk. Ordering on WhatsApp was so fast and personal. Saniya packaged it with so much love.', 5, true, 3);
