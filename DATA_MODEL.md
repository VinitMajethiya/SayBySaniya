# DATA_MODEL.md — Database Schema & Data Layer (Supabase)

## Overview
All dynamic data is stored in **Supabase PostgreSQL** and queried client-side via `@supabase/supabase-js`. `src/data/products.json` is preserved as a fallback seed.

All monetary amounts are stored as **integer paise** internally (e.g. ₹249 = `24900` paise; `0` denotes `[TBD]`).

---

## 1. Tables

### 1.1 `admin_users`
Stores allowlisted email addresses authorized to access the `/admin` portal.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique record ID |
| `email` | `text` | UNIQUE, NOT NULL | Authorized administrator email |
| `created_at` | `timestamptz` | default `now()` | Registration timestamp |

### 1.2 `products`
The core catalogue of homemade organic lip balms and seasonal drops.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Stable product identifier |
| `slug` | `text` | UNIQUE, NOT NULL | Clean URL slug (e.g. `strawberry-jam`) |
| `name` | `text` | NOT NULL | Display name |
| `category` | `text` | NOT NULL | `lip-balm`, `lip-mask`, `lip-tint`, `lip-gloss` |
| `packaging` | `text` | NOT NULL | `tin` (slider), `jar` (gold rim), `bottle` (faceted) |
| `type` | `text` | Optional | Alias for category |
| `flavor` | `text` | NOT NULL | `strawberry`, `honey`, `vanilla`, `blood-water`, etc. |
| `accent` | `text` | NOT NULL | Token accent key for branding |
| `price` | `integer` | NOT NULL | Price in paise (e.g. `29900` = ₹299) |
| `mrp` | `integer` | null | Strike-through MRP in paise |
| `size` | `text` | NOT NULL, default `'[TBD]'` | Net weight / volume |
| `subtitle` | `text` | null | Short card summary |
| `description` | `text` | NOT NULL, default `'[TBD]'` | Long description |
| `flavor_notes` | `text[]` | default `ARRAY[]::text[]` | Array of tasting notes |
| `ingredients` | `text[]` | default `ARRAY['[TBD]']::text[]` | Array of ingredients |
| `claims` | `text[]` | default `ARRAY[]::text[]` | e.g. `["100% Organic & Homemade"]` (balms only) |
| `how_to_use` | `text` | default `''` | Application instructions |
| `images` | `text[]` | default `ARRAY[]::text[]` | Array of Supabase Storage URLs or fallback paths |
| `badge` | `text` | null | e.g. `"Bestseller"` |
| `status` | `text` | NOT NULL | `available`, `sold_out`, `coming_soon`, `limited_drop` |
| `stock` | `integer` | NOT NULL, default `25` | Units in stock |
| `is_featured` | `boolean` | default `false` | Shown in Home The Collection section |
| `sort_order` | `integer` | default `1` | Ordering index |
| `created_at` | `timestamptz` | default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | default `now()` | Last update timestamp |

### 1.3 `deals`
Special promotional offers, bundles, and discount campaigns.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique deal ID |
| `slug` | `text` | UNIQUE, NOT NULL | Unique offer identifier |
| `title` | `text` | NOT NULL | Offer headline (e.g. "Duo Berry Bundle") |
| `description` | `text` | NOT NULL | Promo details |
| `image_url` | `text` | null | Promo banner or tin thumbnail |
| `deal_type` | `text` | NOT NULL | `percent_off`, `flat_off`, `fixed_price`, `bundle` |
| `discount_value` | `integer` | NOT NULL, default `0` | Percent or paise amount |
| `code` | `text` | null | Optional promo code mentioned in WhatsApp/IG |
| `applicable_product_ids` | `text[]` | default `ARRAY[]::text[]` | Applicable products |
| `start_date` | `timestamptz` | default `now()` | Campaign start |
| `end_date` | `timestamptz` | null | Campaign expiration |
| `is_active` | `boolean` | default `true` | Active toggle |
| `created_at` | `timestamptz` | default `now()` | Creation timestamp |

### 1.4 `enquiries`
Captured automatically whenever a shopper clicks "Order on WhatsApp" or "Order on Instagram".
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique enquiry ID |
| `enquiry_number` | `text` | UNIQUE, NOT NULL | e.g. `ENQ-1001` |
| `channel` | `text` | NOT NULL | `'whatsapp'` or `'instagram'` |
| `customer_name` | `text` | null | Customer name if given in note/cart |
| `customer_contact` | `text` | null | Phone or IG handle if provided |
| `items` | `jsonb` | NOT NULL | Snapshot of items (id, name, qty, price_paise) |
| `total_paise` | `integer` | NOT NULL, default `0` | Subtotal in paise |
| `applied_deal_code`| `text` | null | Promo code included |
| `gift_note` | `text` | null | Optional gift note from cart |
| `status` | `text` | NOT NULL, default `'new'` | `'new'`, `'converted'`, `'archived'` |
| `created_at` | `timestamptz` | default `now()` | Timestamp |

### 1.5 `orders`
Created when the owner converts an enquiry into an active order.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique order ID |
| `order_number` | `text` | UNIQUE, NOT NULL | e.g. `SBS-1001` |
| `enquiry_id` | `uuid` | FK to `enquiries.id`, null | Originating enquiry |
| `customer_name` | `text` | NOT NULL | Customer's full name |
| `customer_contact` | `text` | NOT NULL | Phone number or Instagram handle |
| `channel` | `text` | NOT NULL | `'whatsapp'` or `'instagram'` |
| `delivery_address` | `text` | null | Postal delivery address |
| `items` | `jsonb` | NOT NULL | Frozen items snapshot |
| `total_paise` | `integer` | NOT NULL | Total amount confirmed in paise |
| `status` | `text` | NOT NULL, default `'new'` | `'new'`, `'confirmed'`, `'packed'`, `'shipped'`, `'delivered'`, `'cancelled'` |
| `courier_name` | `text` | null | e.g. Delhivery, India Post |
| `tracking_number` | `text` | null | Courier tracking ID |
| `notes` | `text` | null | Admin notes |
| `created_at` | `timestamptz` | default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | default `now()` | Last updated |

### 1.6 `reviews`
Customer reviews submitted from product pages with moderation.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique review ID |
| `product_id` | `text` | FK to `products.id`, null | Product reviewed |
| `author_name` | `text` | NOT NULL | Customer name |
| `rating` | `integer` | NOT NULL, check `rating between 1 and 5` | Star rating (1-5) |
| `review_text` | `text` | NOT NULL | Customer review content |
| `photo_url` | `text` | null | Optional user image upload |
| `status` | `text` | NOT NULL, default `'pending'` | `'pending'`, `'approved'`, `'rejected'` |
| `created_at` | `timestamptz` | default `now()` | Submission timestamp |

### 1.7 `testimonials`
Curated editorial testimonials added by the admin for display on the Home page.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique ID |
| `author_name` | `text` | NOT NULL | Name or pseudonym |
| `instagram_handle`| `text` | null | Optional e.g. `@priya_reads` |
| `content` | `text` | NOT NULL | Testimonial text |
| `photo_url` | `text` | null | Optional customer photo |
| `rating` | `integer` | default `5` | Star count |
| `is_active` | `boolean` | default `true` | Show/hide toggle |
| `sort_order` | `integer` | default `1` | Position index |
| `created_at` | `timestamptz` | default `now()` | Timestamp |

### 1.8 `site_settings`
Global website configuration editable in `/admin`.
| Column | Type | Description |
|---|---|---|
| `key` | `text` PK | Setting identifier (`whatsapp_number`, `instagram_handle`, `banner_text`, `banner_active`, `shipping_note`) |
| `value` | `text` | Setting content |
| `updated_at`| `timestamptz` | Last updated |

---

## 2. Row Level Security (RLS) Policies

All tables have RLS enabled:
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

### Public Access:
- **`products`**: `SELECT` permitted for all visitors.
- **`deals`**: `SELECT` permitted where `is_active = true`.
- **`reviews`**: `SELECT` permitted where `status = 'approved'`.
- **`testimonials`**: `SELECT` permitted where `is_active = true`.
- **`site_settings`**: `SELECT` permitted for all visitors.
- **`enquiries`**: `INSERT` permitted for all visitors (to log chat handoffs).
- **`reviews`**: `INSERT` permitted for all visitors (status is forced to `'pending'`).

### Admin Access:
Full `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on all tables is granted exclusively to authenticated Supabase users whose email exists in `admin_users`.

---

## 3. Storage Bucket
Bucket name: `product-images` (Public).
- **Public**: `SELECT` (read) permitted for all images.
- **Admin**: `INSERT`, `UPDATE`, `DELETE` permitted only for authenticated admin users.
