# HONEY SURGICALS B2B Catalog Platform

Enterprise B2B surgical products catalog built with Next.js 15, TypeScript, Tailwind CSS, ShadCN-style components, Supabase, and Cloudinary.

This is a product discovery and inquiry platform. It intentionally does not include cart, checkout, online payment, wishlist, or order tracking flows.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase

The Supabase MCP endpoint is configured in `.mcp.json`:

```text
https://mcp.supabase.com/mcp?project_ref=onopnadnhzisjxbfrdch
```

Apply the SQL in `supabase/migrations/0001_honey_surgicals.sql` to create normalized tables, indexes, full-text search, RLS policies, and helper RPC functions.

## Cloudinary

Product upload uses signed server-side upload parameters from `/api/admin/cloudinary/signature`. Keep `CLOUDINARY_API_SECRET` server-only in `.env.local`; never expose it through frontend code.

## Main Routes

- `/` customer portal
- `/products` catalog search, filters, sort, and compare selection
- `/products/[slug]` product details with quote, WhatsApp, and contact actions
- `/categories` category hierarchy
- `/compare` product comparison
- `/admin` admin dashboard
- `/admin/products` product management
- `/admin/categories` category management
- `/admin/inquiries` inquiry management
- `/admin/bulk-upload` CSV/Excel import preview
