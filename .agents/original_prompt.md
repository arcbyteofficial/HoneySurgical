## 2026-07-15T04:48:29Z

Redesign the Category Details page (`app/(site)/categories/[slug]/page.tsx`) of the Honey Surgical Next.js application to provide a premium, modern, clean, and minimalistic grid-based user experience for institutional medical procurement officers.

Working directory: c:\Users\hatim\Desktop\honey surgical
Integrity mode: development

## Requirements

### R1. Minimalist & Premium Medical Aesthetic
- Apply a high-end medical aesthetic to the Category Details page using the existing color system (e.g., `text-medical-deep` blue, soft gradients, and clean whitespace).
- Build a elegant category header section showing the category name and description, with subtle CSS backgrounds (like soft gradients or light borders) and glassmorphism accents.
- Implement subcategory navigation tags or pills with horizontal scrolling on mobile. Subcategory pills must have distinct active and hover states.

### R2. Responsive Grid-Based Product Directory
- Display products in a clean, balanced grid layout (2 columns on mobile, 3 columns on tablet, 4 columns on desktop).
- Cards should have a modern, borderless or minimal border look with smooth hover transitions (subtle lift, shadow transition, image scaling).
- Ensure image ratios are stable (aspect-ratio container or layout space reserved) to prevent Cumulative Layout Shift (CLS).

### R3. High-Converting UX Features on Product Cards
- Present the brand name (small, muted), SKU, short description, and price clearly using monospaced or tabular figures for price readability.
- Integrate action buttons:
  - "Request Quote" CTA using the main accent color.
  - "WhatsApp Inquiry" CTA with the brand's WhatsApp link.
  - A subtle "Compare" toggle badge (overlayed on the product image) matching the application's existing product comparison feature.

### R4. Accessible Navigation and SEO Compliance
- Maintain breadcrumbs navigation (`BreadcrumbsJsonLd`) and structure structured metadata (`generateMetadata`, `ItemListJsonLd`).
- Follow accessibility (WCAG AA) standards: focus rings on interactive elements, appropriate `aria-labels` for buttons/icons, and minimum 4.5:1 contrast ratio.

## Acceptance Criteria

### Visual & Interactive Quality
- [ ] Product grid is fully responsive and displays 2 columns on mobile, 3 on tablet, and 4 on desktop.
- [ ] Product cards feature smooth hover animations (lifting and shadow changes) without shifting layout bounds.
- [ ] Subcategory pills scroll horizontally on mobile without breaking viewport constraints.

### Functional Integrity
- [ ] Page builds successfully in Next.js without TypeScript errors or hydration mismatch issues.
- [ ] Clicking on subcategory pills correctly redirects users to the respective subcategory pages.
- [ ] Comparison toggle correctly triggers comparison tray/logic.
- [ ] WhatsApp button redirects to the WhatsApp URL with the prefilled message containing the product name.
