# DESIGN.md — Say By Saniya (@saylipss.co)

> Source of truth for how the website looks and feels. Derived from the brand's Instagram grid (screenshot) and the existing storefront preview visible in it. If a reference site/image is added later, update the "Reference Notes" section at the bottom and adjust tokens accordingly.

---

## 1. Brand Essence

- **Brand name:** Say By Saniya (Instagram: `@saylipss.co`)
- **What it is:** Homemade, 100% organic lip care sold in slim metal slider tins.
- **Tagline:** *Nourish. Tint. Love.*
- **Sub-line:** *Homemade, organic lip care for every day.*
- **Personality:** Soft, handmade, a little cheeky. Feels like a boutique stationery brand that also posts memes. Elegant on the surface, playful underneath.
- **Three words to design by:** **Soft. Editorial. Playful.**

### What the grid is telling us
| Observation | Design decision |
|---|---|
| Product posts use warm cream backgrounds with one hero tin and one flavor prop (strawberry, honeycomb, vanilla pods) | Cream canvas, single hero product per card, one "ingredient prop" per product |
| Thin black frame/border lines around posts | Use hairline borders as a signature framing device |
| Script "Say" with a black ribbon bow on cream | Script wordmark + bow motif as logo and decorative accent |
| Tiny, widely-spaced caps: "100% ORGANIC & HOMEMADE" | Eyebrow/label style in uppercase tracking-wide small text |
| Hearts everywhere (doodled hearts, heart on pocket, ♥ under each product) | Hearts are the brand's icon language |
| Meme-style, Hinglish copy ("Reapply her 10 min? Nahi karenge", "Me & my lip balm against the world") | Humor is part of voice; leave room for cheeky microcopy |
| "blood water tint" dark red drip post | Seasonal/limited-drop theme can break the palette (see §10) |

---

## 2. Color Tokens

Use CSS variables / Tailwind theme extensions. Never hardcode hex values in components.

### Core palette
| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F6F1E7` | Primary page background |
| `--ivory` | `#FBF8F2` | Cards, header, elevated surfaces |
| `--ink` | `#1A1A1A` | Body text, borders, logo |
| `--ink-soft` | `#5B5651` | Secondary text, captions |
| `--hairline` | `#1A1A1A` @ 85% | 1px frame borders (matches IG post frames) |

### Flavor accents (each product owns one)
| Token | Hex | Product |
|---|---|---|
| `--strawberry` | `#F0A8BE` | Strawberry Jam (balm color in tin) |
| `--honey` | `#E8C58A` | Honey Butter |
| `--vanilla` | `#F3E7C9` | Vanilla Silk |
| `--future` | `#E9B7C9` | "Coming soon" tints & balms (blush) |

### Support colors
| Token | Hex | Use |
|---|---|---|
| `--heart` | `#EE6C8E` | Hearts, hover accents, small highlights |
| `--tin` | `#C9CACB` | Metallic tin illustration/edges, dividers |
| `--denim` | `#BFD3E6` | Optional playful section background (from pocket post) |
| `--blood` | `#8B1A1A` | Seasonal "blood water tint" drop only |
| `--success` | `#4F7A5A` | Form success |
| `--error` | `#B3261E` | Form errors |

### Rules
- Background is **always cream or ivory** — no pure white, no dark mode in v1.
- Text on cream uses `--ink`; contrast must be ≥ 4.5:1.
- One flavor color per product card/section. Do not mix flavor colors in one block.
- Pink (`--heart`) is an accent, never a large fill.

---

## 3. Typography

| Role | Font (Google Fonts) | Notes |
|---|---|---|
| **Script / Logo** | `Pinyon Script` (fallback `Great Vibes`) | "Say" and "By Saniya" wordmark, section flourishes. Use sparingly: one script moment per screen. |
| **Display / Headlines** | `Playfair Display` (400/600, italic available) | H1/H2, product names in feature areas |
| **Body / UI** | `DM Sans` (400/500/700) | Paragraphs, buttons, nav, forms |
| **Label / Eyebrow** | `DM Sans` 500, uppercase, `letter-spacing: 0.22em`, 11–12px | e.g. "100% ORGANIC & HOMEMADE" |
| **Meme / Playful callouts** | `Archivo Black` or `Bowlby One` (optional) | Only inside "meme" blocks/stickers, never body text |

### Scale (desktop → mobile)
| Style | Desktop | Mobile | Weight |
|---|---|---|---|
| H1 | 64px / 1.05 | 40px | Playfair 600 |
| H2 | 44px / 1.1 | 30px | Playfair 600 |
| H3 | 28px / 1.2 | 22px | Playfair 400 |
| Body | 17px / 1.65 | 16px | DM Sans 400 |
| Small | 14px / 1.5 | 13px | DM Sans 400 |
| Eyebrow | 12px | 11px | DM Sans 500 caps |

---

## 4. Logo & Brand Marks

- **Primary logo:** Large script **S** with "AY" in a serif, "By Saniya" in script beneath, black ribbon bow above. Black on cream.
- **Compact logo (header):** Script "Say By Saniya" single line + small bow.
- **Favicon:** Bow or script "S" on cream circle.
- **Clear space:** Minimum equals height of the bow on all sides.
- **Never:** recolor logo to pink, place on busy photos without cream backing, stretch.
- Logo files go in `/public/brand/` (user supplies originals from Instagram highlights/profile).

---

## 5. Layout & Spacing

- **Grid:** 12-col desktop, 4-col mobile. Max content width `1200px`; text blocks max `62ch`.
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 72, 112.
- **Section padding:** 112px vertical desktop, 64px mobile.
- **Radius:** `4px` on cards and images (the IG posts are near-square with slight rounding), `999px` on pills/buttons.
- **Borders:** `1px solid var(--ink)` hairline frames on product cards and feature images — signature look. Optional double-frame (outer + inner 6px inset) for hero product shots.
- **Shadows:** almost none. Prefer borders over shadows. If needed: `0 8px 24px rgba(26,26,26,0.06)`.

---

## 6. Imagery & Illustration Style

### Product photography / renders
- Top-down, flat-lay, soft even light, cream backdrop.
- Tin shown **open** with balm visible, closed tin beside it optional.
- **One prop per flavor:** strawberry (Strawberry Jam), honeycomb (Honey Butter), vanilla pods + flowers (Vanilla Silk).
- Label always legible: "SAY BY SANIYA / FLAVOR / LIP BALM / NOURISH. TINT. LOVE. / @saylipss.co".
- Tiny ♥ centered below the product, "100% ORGANIC & HOMEMADE" caption at bottom.

### Lifestyle / UGC
- Real people, candid, slightly imperfect, warm tones. Allow polaroid/sticker treatment.
- Doodled hearts (hand-drawn, wobbly, `--heart`) overlaid on photos as stickers.

### Icons
- Line icons, 1.5px stroke, rounded caps (Lucide works). Heart is the primary icon.

### Doodles
- Hand-drawn hearts, small stars, ribbon bow, squiggles. SVGs live in `/src/assets/doodles/`.

---

## 7. Components (visual spec)

Full component list and props live in `COMPONENTS.md`. Visual rules:

### Buttons
- **Primary:** `--ink` fill, `--cream` text, pill, 14px uppercase tracking 0.12em. Hover: fill → `--heart`, text stays cream, 200ms.
- **Secondary:** transparent, 1px `--ink` border, ink text. Hover: fill `--ink`, text cream.
- **Tertiary / link:** underline offset 4px, ink; hover color `--heart`.
- Min tap target 44×44px.

### Product Card
- Ivory background, 1px ink border, 4px radius.
- Image area square (1:1), flavor-tinted subtle background wash (flavor color at 12% opacity).
- Below image: eyebrow ("LIP BALM"), product name (Playfair 22px), price (DM Sans 500), "Add to Cart" small secondary button.
- Corner ♥ icon toggles wishlist.
- Hover: image slightly scales 1.03, border stays, "Quick view" label fades in.

### Header
- Ivory, bottom hairline. Left: nav (Shop All, About Us, Our Story, Contact). Center: script logo. Right: search, cart with count badge.
- Mobile: hamburger left, logo center, cart right.
- Sticky, shrinks on scroll.

### Footer
- Cream with top hairline. Script logo, tagline, link columns, Instagram link (`@saylipss.co`), newsletter field, "Made with ♥ by hand" line.

### Badges / Stickers
- Pill with tiny caps text: "NEW", "BEST SELLER", "COMING SOON", "LIMITED DROP". Sticker rotation −4° to +4° allowed.

### Forms
- Underline-only inputs (1px ink bottom border), floating caps labels, heart icon on submit success.

### Meme Block (brand flavor)
- Cutout photo of a person on cream, speech bubble in `Archivo Black`, doodled hearts. Use maximum **once per page**.

---

## 8. Motion & Interaction

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`; durations 200–400ms.
- Page load: fade-up on sections (translateY 16px → 0), staggered 60ms.
- Hero: tin gently floats (±6px, 6s loop); hearts drift upward slowly and fade.
- Add-to-cart: small heart "pops" from button into the cart icon.
- Scroll: marquee strip of "NOURISH. TINT. LOVE. ♥" scrolling slowly between sections.
- Respect `prefers-reduced-motion`: disable float, drift, marquee.

---

## 9. Voice & Microcopy (design-facing)

- Friendly, short, lightly cheeky. Hinglish allowed in playful spots, never in policy/checkout text.
- Examples: "Reapply her 10 min? Nahi karenge." / "Me & my lip balm against the world." / "Made by hand. Meant for you."
- Buttons: "Add to Cart", "Shop the Collection", "Notify Me", "Tell Saniya ♥".
- Empty states always include a heart doodle and one warm line.
- Full copy bank in `CONTENT.md`.

---

## 10. Seasonal / Limited Drops

- Seasonal drops (e.g. **Blood Water Tint** for Halloween) may override the palette using a **drop theme**: swap background to `--blood` tint, headline in a distressed/horror display font, drip SVG dividers.
- Implement as a theme class on the section (`.theme-drop-blood`), never as a global change, and always return to the core palette outside the drop section.

---

## 11. Accessibility

- Contrast ≥ 4.5:1 for text; flavor colors are never used for text.
- Focus states: 2px `--ink` outline + 2px cream offset ring.
- All images have alt text describing flavor + prop (e.g. "Strawberry Jam lip balm tin, open, with a fresh strawberry").
- Don't convey info with color alone (badges also carry text).
- Keyboard navigable cart drawer, menu, and quick view.

---

## 12. Responsive Breakpoints

| Name | Min width |
|---|---|
| sm | 480px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

Product grid: 2 cols (mobile) → 3 (md) → 4 (lg+). Mobile-first; most traffic will come from Instagram on phones.

---

## 13. Do / Don't

**Do:** cream backgrounds, hairline frames, one hero tin, tiny caps labels, hand-drawn hearts, lots of whitespace, warm photography.
**Don't:** pure white or black backgrounds, heavy drop shadows, neon colors, stock-photo models, more than one script font, crowded layouts, emojis in headings.

---

## 14. Reference Notes (update when reference arrives)

- [ ] Reference URL/image: _pending — user said they'll add one_
- [ ] Layout ideas to adopt from reference:
- [ ] Elements to avoid copying:
- [ ] Token changes after reference review:
