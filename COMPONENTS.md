# COMPONENTS.md — UI Component Inventory

Visual rules live in `DESIGN.md` §7. This file defines structure and props.

## Layout
| Component | Purpose | Key props |
|---|---|---|
| `Header` | Sticky nav, logo, search, cart | `cartCount` |
| `MobileMenu` | Slide-down nav | `open`, `onClose` |
| `Footer` | Links, IG, newsletter | — |
| `Marquee` | Scrolling "NOURISH. TINT. LOVE. ♥" strip | `items`, `speed` |
| `Section` | Standard padded wrapper w/ eyebrow + title | `eyebrow`, `title`, `bg` |
| `Container` | Max-width wrapper | — |

## Brand
| Component | Purpose |
|---|---|
| `Logo` | Script wordmark + bow (`variant: 'full' \| 'compact'`) |
| `Doodle` | Hand-drawn SVGs (`name: 'heart' \| 'bow' \| 'star' \| 'squiggle'`) |
| `FloatingHearts` | Ambient drifting hearts (respects reduced motion) |
| `Sticker` | Rotated badge/label (`NEW`, `COMING SOON`) |
| `MemeBlock` | Cutout photo + speech bubble (max once/page) |

## Commerce
| Component | Props | Notes |
|---|---|---|
| `ProductCard` | `product` | Hairline frame, flavor wash, quick add |
| `ProductGrid` | `products`, `columns` | 2/3/4 responsive |
| `ProductGallery` | `images` | Thumbnails + swipe on mobile |
| `FlavorBadge` | `flavor` | Colored dot + name |
| `QuantitySelector` | `value`, `onChange` | Min 1, max stock |
| `AddToCartButton` | `product`, `qty` | Heart-pop animation |
| `CartDrawer` | — | Items, subtotal, gift note, checkout CTA |
| `CartItem` | `item` | Image, name, qty, remove |
| `CheckoutForm` | — | Name, phone, address, notes |
| `WhatsAppOrderButton` | `cart` or `product` | Builds prefilled message |
| `PriceTag` | `amount` | Formats `₹` |
| `Filters` | `value`, `onChange` | Type + flavor + sort |
| `ComingSoonCard` | `title` | "Future Favorites" with Notify Me |

## Content
| Component | Purpose |
|---|---|
| `Hero` | Home hero with script logo moment, tin image, CTAs |
| `WhyChoose` | 4 value props with doodle icons |
| `StoryTeaser` | Image + short story + CTA |
| `Accordion` | Ingredients, How to use, Shipping |
| `TestimonialStrip` | Customer quotes / UGC photos |
| `InstagramGrid` | Static grid linking to IG posts (embed later) |
| `Newsletter` | Email capture |
| `ContactForm` | Name, email, message |

## Feedback & Utility
| Component | Purpose |
|---|---|
| `Button` | `variant: primary \| secondary \| link`, `size` |
| `Input` / `Textarea` | Underline style, floating caps label |
| `Toast` | "In your cart ♥" |
| `EmptyState` | Heart doodle + warm line |
| `SEO` | Title, meta, OG per page |
| `ScrollReveal` | Fade-up wrapper |
| `ThemeDrop` | Wrapper for seasonal themes (`blood`) |

## Behavior Notes
- Cart persists in `localStorage` (`sbs_cart_v1`).
- WhatsApp message format:
  ```
  Hi Saniya! I'd like to order:
  • Strawberry Jam x2 — ₹[price]
  Total: ₹[total]
  Name: …  Address: …
  ```
- All interactive components keyboard accessible; visible focus ring per DESIGN.md §11.
