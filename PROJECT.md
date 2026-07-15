# Project: Category Details Page Redesign

## Architecture
- **Page Module**: `app/(site)/categories/[slug]/page.tsx`
  - Fetches category details and products asynchronously using params.
  - Dynamically renders SEO breadcrumbs and item list JSON-LD.
  - Displays category title, description, horizontal subcategory nav tags, and product directory.
- **Card Module**: `components/catalog/product-card.tsx` or a custom component in `app/(site)/categories/[slug]/`
  - Renders individual product details (brand, name, SKU, price, short description).
  - Integrates WhatsApp button, Quote button, and Compare toggle.
- **Data Flow**:
  - `getAllCategories()` fetches all categories to resolve the category by slug and find child categories.
  - `searchProducts({ category: category.slug, sort: "popular" })` fetches products in the selected category.
- **Styling**: Tailwind CSS with custom medical theme colors (e.g. `text-medical-deep`, `bg-medical-pale`).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Redesign Page & Cards | Redesign `app/(site)/categories/[slug]/page.tsx` and product card layout for premium aesthetic and UX features | None | PLANNED |

## Code Layout
- `app/(site)/categories/[slug]/page.tsx` - Category details page entrypoint.
- `components/catalog/product-card.tsx` - Shared product card component (we can modify it or create a page-specific alternative).
