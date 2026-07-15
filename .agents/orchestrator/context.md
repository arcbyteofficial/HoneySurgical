# Context: Category details page redesign

This file maps the current active state, file paths, and subagent reference directories.

## Active Files
- **Category Details page**: `app/(site)/categories/[slug]/page.tsx`
- **Product Card component**: `components/catalog/product-card.tsx`
- **Compare Toggle component**: `components/catalog/compare-toggle.tsx`
- **Project Index**: `PROJECT.md` at root

## Active Variables & Data Sources
- **Category list**: `getAllCategories()` fetches all category models.
- **Product list**: `searchProducts({ category, sort })` fetches active product models.
- **Site URL**: `siteConfig.url` (used for absolute SEO canonical references).
- **Theme colors**:
  - `bg-medical-deep` / `text-medical-deep` (dark blue-gray: `#1A3A5C`) - Primary high contrast color (contrast 11.5:1 on white).
  - `bg-primary` / `text-primary` (green: `HSL 122 52% 47%`) - Used for primary accents.

## Subagent Reference Directories
- **Explorer 1**: `c:\Users\hatim\Desktop\honey surgical\.agents\teamwork_preview_explorer_redesign_1\`
  - Report: `analysis.md`, `handoff.md`
- **Explorer 2**: `c:\Users\hatim\Desktop\honey surgical\.agents\teamwork_preview_explorer_redesign_2\`
  - Report: `analysis.md`, `handoff.md`
- **Explorer 3**: `c:\Users\hatim\Desktop\honey surgical\.agents\teamwork_preview_explorer_redesign_3\`
  - Report: `analysis.md`, `handoff.md`
