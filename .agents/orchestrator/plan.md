# Redesign Plan: Category Details Page & Product Card

This plan synthesizes findings from all three Explorer subagents and outlines the steps to implement a premium, modern, grid-based, responsive, and WCAG AA compliant Category Details page.

## 1. Synthesized Findings & Consensus

### R1. Category Header & Pills
- **Visual Breadcrumbs**: Currently missing. We will render a visual breadcrumb trail above the header (e.g. `Home / Categories / [Parent Category (if applicable)] / [Current Category]`) that matches the BreadcrumbsJsonLd metadata schema.
- **Header Aesthetics**: Refactor the header into a rounded card styled with subtle gradients (`bg-gradient-to-br from-medical-bluePale/30 via-white to-medical-greenPale/20`), light borders, and glassmorphic blurred glow shapes. Show a product count badge on desktop viewports.
- **Pill Navigation**:
  - Replace raw `<a>` tags with Next.js `<Link>` components to prevent full page reloads.
  - Implement mobile horizontal scrolling (`overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-nowrap md:flex-wrap`) and desktop wrapping.
  - Maintain sibling subcategory visibility. If the current category has a parent, query the parent's children (siblings) and show an "All [Parent Name]" pill as a back-link.
  - Apply high-contrast colors: Active state pill uses `bg-medical-deep text-white border-medical-deep` (11.5:1 contrast, WCAG AA compliant). Inactive pills use clean gray hoverable borders.

### R2. Responsive Grid & Performance (CLS)
- **Breakpoints**: Update product directory grid to `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6` to handle mobile, tablet, and desktop columns smoothly.
- **CLS Prevention**: Preserve a stable aspect ratio (aspect-square wrapper container) for product images.
- **Image Cropping**: Swap from `object-cover` to `object-contain p-4` inside product cards so long/thin surgical instrument details are never cropped out.
- **Fallback Empty States**: Include SVG placeholder icons for cards with missing images and a premium empty state B2B block if the category contains no products.

### R3. B2B Card Features & Accessibility (WCAG AA)
- **Card Elements**:
  - Upper row: Brand name in capital tracking-wider letters, copyable SKU code (`select-all` utility).
  - Title: Link styled with smooth transition.
  - Middle: Clear short description clamping to 2 lines.
  - Bottom: MSRP labeling and formatted currency price using monospaced tabular figures (`font-mono tabular-nums tracking-tight`) to align decimals cleanly.
  - Buttons: Grid layout (`grid-cols-2`) for buttons instead of vertical stacking on mobile.
- **Action CTAs**:
  - WhatsApp CTA: Styled outline button with WhatsApp green details and a descriptive `aria-label`. Link format uses prefilled text including product name and SKU.
  - Request Quote CTA: Uses primary button colors (`bg-primary text-primary-foreground hover:bg-medical-deep`) with an arrow icon.
  - Compare Badge: Subtle overlay on the image using Radix client hooks.
- **Accessibility**:
  - Tab stops optimization: Add `tabIndex={-1}` and `aria-hidden="true"` to the product card image Link container. This prevents duplicate keyboard tab stops per card, letting screen readers land directly on the descriptive title link.
  - Contrast fixes: Ensure the active subcategory pills, CTAs, and comparison toggle active states have at least **4.5:1** contrast. Replace white-on-green text with high-contrast text (`bg-medical-deep` with white text or dark text on green background).
  - Explicit labels: Add descriptive `aria-label` tags to image details, WhatsApp, and Quote links.

---

## 2. Implementation Milestones

### Milestone 1: Redesign Category Page Layout & Sibling Nav
- Target File: `app/(site)/categories/[slug]/page.tsx`
- Implement visual breadcrumbs, parent-child sibling navigation pill queries, and the glassmorphic header hero with product count.
- Update product grid columns to `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- Setup canonical URL as absolute using `siteConfig.url`.

### Milestone 2: Redesign Product Card Layout & B2B/Accessibility Features
- Target File: `components/catalog/product-card.tsx`
- Implement aspect-square container, image placeholder SVG fallback, uppercase brand name, copyable SKU, `font-mono tabular-nums` MSRP price.
- Redesign actions into a 2-column mobile layout. Fix WhatsApp prefilled text, add `aria-labels` and `tabIndex={-1}` on decorative elements/image links.

### Milestone 3: Color Contrast Adjustments
- Verify if any shared styling in components (like `CompareToggle` in `components/catalog/compare-toggle.tsx`) needs alignment to ensure the active/hover states pass WCAG contrast checks.

---

## 3. Verification Protocol
The Worker must verify all changes by running the following scripts:
1. Run `npm run typecheck` to verify TypeScript compile-time safety.
2. Run `npm run build` to verify page and chunk build optimization.
3. Run `npm run lint` to verify coding standards.
4. Manually verify layouts are fully responsive at mobile (375px), tablet (768px), and desktop (1440px) breakpoints.
