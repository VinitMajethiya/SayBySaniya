# LAUNCH_CHECKLIST.md — Pending Information from Saniya

This checklist indexes every remaining `[TBD]` placeholder in the codebase. Use this document to collect the required answers from Saniya and replace each entry prior to public launch.

---

## 1. Product Data (`src/data/products.json`)

| Product | Line | Item | Placeholder Value | Saniya's Confirmed Details |
|---|---|---|---|---|
| **Strawberry Jam** | 10 | `price` | `0` (renders as `₹[TBD]`) | [ ] |
| | 11 | `size` | `"[TBD]"` | [ ] |
| | 13 | `description` | `"[TBD] Soft, glossy, lightly tinted. Perfect for everyday shine."` | [ ] |
| | 15 | `ingredients` | `["[TBD from owner]"]` | [ ] |
| **Honey Butter** | 35 | `price` | `0` (renders as `₹[TBD]`) | [ ] |
| | 36 | `size` | `"[TBD]"` | [ ] |
| | 38 | `description` | `"[TBD]"` | [ ] |
| | 40 | `ingredients` | `["[TBD]"]` | [ ] |
| **Vanilla Silk** | 60 | `price` | `0` (renders as `₹[TBD]`) | [ ] |
| | 61 | `size` | `"[TBD]"` | [ ] |
| | 63 | `description` | `"[TBD]"` | [ ] |
| | 65 | `ingredients` | `["[TBD]"]` | [ ] |
| **Blood Water Tint** | 85 | `price` | `0` (renders as `₹[TBD]`) | [ ] |
| | 86 | `size` | `"[TBD]"` | [ ] |
| | 88 | `description` | `"[TBD]"` | [ ] |
| | 90 | `ingredients` | `["[TBD]"]` | [ ] |

---

## 2. Brand Story & Founder Bio

- [ ] **Founder Bio / Kitchen Origin**
  - **File**: `src/pages/OurStory.tsx` — **Lines 49, 52**
  - **File**: `src/components/home/StoryTeaser.tsx` — **Line 47**
  - **Current Text**: `[TBD: Saniya's real founder story — awaiting owner's text]`
  - **Action**: Provide 2–3 paragraphs describing what inspired Saniya to start `@saylipss.co`, how she began making balms, and what makes her craft special.

- [ ] **Brand Philosophy & Sourcing**
  - **File**: `src/pages/About.tsx` — **Line 76**
  - **File**: `src/components/home/WhyChoose.tsx` — **Line 38**
  - **Current Text**: `[TBD: Saniya's brand philosophy and detailed about text — to be provided by owner]` / `[TBD: owner to confirm claims]`
  - **Action**: Confirm organic sourcing, hygiene process, and any brand certifications.

---

## 3. Shipping & Return Policies

- [ ] **Batch Dispatch & Order Processing**
  - **File**: `src/pages/Legal.tsx` — **Line 24**
  - **File**: `src/pages/ProductDetail.tsx` — **Line 103**
  - **Current Text**: `[TBD by owner: Processing days, batch pouring schedule]`
  - **Action**: Specify typical dispatch turnaround (e.g. "Dispatched in 2–3 business days").

- [ ] **Courier Partners & Shipping Fees**
  - **File**: `src/pages/Legal.tsx` — **Line 33**
  - **Current Text**: `[TBD by owner: Standard courier partners, flat rate charges across India, free shipping threshold]`
  - **Action**: Provide courier names (e.g. Delhivery, Bluedart), shipping rate (e.g. ₹50 flat rate), and free delivery threshold (e.g. Free shipping above ₹599).

- [ ] **Cash on Delivery (COD) & UPI Terms**
  - **File**: `src/pages/Legal.tsx` — **Line 42**
  - **Current Text**: `[TBD by owner: COD availability, verification process]`
  - **Action**: Confirm if COD is accepted or if orders are prepaid only via UPI.

- [ ] **Return & Cancellation Windows**
  - **File**: `src/pages/Legal.tsx` — **Lines 60, 78**
  - **Current Text**: `[TBD by owner: Exact return window, hygiene terms]` / `[TBD by owner: Timeframe before parcel dispatch]`
  - **Action**: Confirm cancellation window (e.g. "Before tracking ID is generated") and damage replacement terms.

- [ ] **Privacy & Customer Data Notice**
  - **File**: `src/pages/Legal.tsx` — **Lines 96, 133**
  - **Current Text**: `[TBD by owner]`
  - **Action**: Review and approve standard customer data handling for orders and drop alerts.

---

## 4. Configuration & Contact

- [ ] **WhatsApp Production Phone Number**
  - **File**: `.env` — **Line 5**
  - **File**: `.env.example` — **Line 5**
  - **Current Value**: `919999999999`
  - **Action**: Replace with Saniya's active WhatsApp business/personal number.

- [ ] **Production Domain URL**
  - **File**: `.env` — **Line 2**
  - **File**: `public/sitemap.xml` — **Lines 4, 9, 14, ...**
  - **File**: `public/robots.txt` — **Line 4**
  - **Current Value**: `https://saylipss.co`
  - **Action**: Confirm final custom domain.

- [ ] **Photography Upload**
  - **Directory**: `public/products/`
  - **Guide**: `public/products/README.md`
  - **Action**: Drop real WebP/JPG product photos into `strawberry-jam/`, `honey-butter/`, `vanilla-silk/`, and `blood-water-tint/`.
