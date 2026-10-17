# Product Photography Asset Guide — Say By Saniya

To replace the illustrated slider tin placeholders with real photography **without modifying any code**, simply place your product image files into this directory matching the exact folder names and filenames below.

## Directory & File Structure

```text
public/products/
├── strawberry-jam/
│   ├── hero.webp       # Front / hero shot on cream background (flat lay with strawberry)
│   └── open.webp       # Open slider tin showing balm well
├── honey-butter/
│   ├── hero.webp       # Front / hero shot on cream background (flat lay with honeycomb)
│   └── open.webp       # Open slider tin showing balm well
├── vanilla-silk/
│   ├── hero.webp       # Front / hero shot on cream background (flat lay with vanilla pods)
│   └── open.webp       # Open slider tin showing balm well
└── blood-water-tint/
    └── hero.webp       # Seasonal drop hero shot
```

## Recommended Image Specifications

- **Format:** `.webp` (recommended for fastest mobile load times) or `.jpg` / `.png`.
- **Dimensions:** Square 1:1 ratio, minimum `800 × 800 px`, ideally `1200 × 1200 px`.
- **Background:** Warm cream (`#F6F1E7` or `#FBF8F2`) as defined in `DESIGN.md`.
- **Lighting:** Soft, even, flat-lay overhead lighting with 1 prop per flavor.
- **Automatic Fallback:** If any image file is missing, the site automatically renders the vector tin illustration with no broken image icon or layout shift.
