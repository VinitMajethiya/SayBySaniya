# Say By Saniya — Website & Storefront

Official storefront and brand website for **Say By Saniya** (`@saylipss.co`) — homemade, 100% organic lip care sold in slim pocket slider tins.

Built with **React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Zustand**.

---

## 1. Quick Start (Running Locally)

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### Installation & Development
```bash
# 1. Clone or open the repository
cd "SayBy Saniya"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build & Preview
```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview
```

---

## 2. Environment Variables

Create or edit your `.env` file in the root directory:

```env
# Production or Staging Website URL (used for sitemaps, canonical tags, and OG previews)
VITE_SITE_URL=https://saylipss.co

# WhatsApp Order Phone Number (international format without + or spaces)
VITE_WHATSAPP_NUMBER=919999999999

# Optional Analytics (leave empty for no-op)
VITE_PLAUSIBLE_DOMAIN=
VITE_GA_ID=
VITE_META_PIXEL_ID=
```

---

## 3. How to Change the WhatsApp Number

Orders from the Cart Drawer and Product Detail pages automatically generate a prefilled WhatsApp order message sent directly to Saniya.

To change the receiving phone number:
1. Open `.env` (or set environment variables in your Vercel project settings).
2. Change `VITE_WHATSAPP_NUMBER` to your phone number in international format **without `+`, hyphens, or spaces**:
   - Example for India: `VITE_WHATSAPP_NUMBER=919876543210`
3. Restart your dev server or trigger a Vercel redeployment. All WhatsApp links site-wide update automatically.

---

## 4. How to Swap in Real Product Photos (Zero-Code)

You don't need to change any React code to swap out the illustrated slider tin placeholders!

Simply drop your photography into the `public/products/` directory matching the product slugs:

```text
public/products/
├── strawberry-jam/
│   ├── hero.webp       # Front flat-lay shot on cream background
│   └── open.webp       # Open slider tin view showing the balm
├── honey-butter/
│   ├── hero.webp
│   └── open.webp
├── vanilla-silk/
│   ├── hero.webp
│   └── open.webp
└── blood-water-tint/
    └── hero.webp       # Seasonal drop hero shot
```

- **Format:** WebP recommended (`.webp`), or `.jpg` / `.png`.
- **Dimensions:** Square 1:1 ratio (min `800 × 800 px`, ideally `1200 × 1200 px`).
- **Background:** Warm cream (`#F6F1E7` or `#FBF8F2`).
- **Automatic Fallback:** If an image is not found, the website automatically falls back to the custom vector slider tin illustration.

---

## 5. How to Edit Products (`src/data/products.json`)

The product catalogue lives in `src/data/products.json`. You can update pricing, add new shades, or adjust stock without writing code:

```json
{
  "id": "sbs-001",
  "slug": "strawberry-jam",
  "name": "Strawberry Jam",
  "type": "lip-balm",
  "flavor": "strawberry",
  "accent": "strawberry",
  "price": 0,
  "currency": "INR",
  "size": "[TBD]",
  "shortDescription": "A sweet, jammy pink balm with a sheer strawberry tint.",
  "description": "[TBD] Soft, glossy, lightly tinted. Perfect for everyday shine.",
  "flavorNotes": ["strawberry", "sweet berry jam"],
  "ingredients": ["[TBD from owner]"],
  "howToUse": "Swipe on lips whenever they need love. Reapply as needed.",
  "images": [
    "/products/strawberry-jam/hero.webp",
    "/products/strawberry-jam/open.webp"
  ],
  "badges": ["Best Seller"],
  "status": "available",
  "stock": 10,
  "featured": true,
  "sortOrder": 1
}
```

### Important Fields:
- **`price`**: Stored as internal paise. For ₹249, set `"price": 24900`. If `0`, the UI automatically displays `₹[TBD]`.
- **`status`**: Set to `"available"`, `"coming-soon"`, or `"sold-out"`. Coming-soon items automatically render a "Notify Me" drop alert modal.
- **`badges`**: Array of strings like `["Best Seller"]`, `["New"]`, or `["Limited Drop"]`.

---

## 6. How to Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your repository.
4. Keep the default settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. In **Environment Variables**, add:
   - `VITE_SITE_URL` = your live production domain (e.g. `https://saylipss.co`)
   - `VITE_WHATSAPP_NUMBER` = Saniya's WhatsApp number (e.g. `919876543210`)
6. Click **Deploy**. Vercel will build and deploy your site with SPA deep-linking configured via `vercel.json`.
