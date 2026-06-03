-- ============================================================
-- Honey Surgicals – initial schema
-- Paste this entire block into: Supabase Dashboard → SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";

-- Make unaccent immutable so it can be used in generated columns
create or replace function public.immutable_unaccent(text)
  returns text
  language sql immutable parallel safe strict
as $$ select unaccent($1) $$;

-- ─── CATEGORIES ─────────────────────────────────────────────

create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  parent_id   uuid references public.categories(id) on delete set null,
  image_url   text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_categories_parent on public.categories(parent_id);
create index if not exists idx_categories_slug   on public.categories(slug);

-- ─── PRODUCTS ───────────────────────────────────────────────

create table if not exists public.products (
  id          uuid    primary key default uuid_generate_v4(),
  name        text    not null,
  slug        text    not null unique,
  description text,
  category_id uuid    references public.categories(id) on delete set null,
  images      text[]  not null default '{}',
  sku         text    unique,
  is_active   boolean not null default true,
  fts         tsvector generated always as (
    to_tsvector('english',
      public.immutable_unaccent(coalesce(name, '')) || ' ' ||
      public.immutable_unaccent(coalesce(description, '')) || ' ' ||
      public.immutable_unaccent(coalesce(sku, ''))
    )
  ) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug     on public.products(slug);
create index if not exists idx_products_active   on public.products(is_active);
create index if not exists idx_products_fts      on public.products using gin(fts);

-- ─── INQUIRIES ──────────────────────────────────────────────

do $$ begin
  create type public.inquiry_status as enum ('new', 'read', 'replied', 'closed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.inquiries (
  id          uuid                  primary key default uuid_generate_v4(),
  product_id  uuid                  references public.products(id) on delete set null,
  product_ids uuid[]                default '{}',
  name        text                  not null,
  company     text,
  email       text                  not null,
  phone       text,
  message     text                  not null,
  status      public.inquiry_status not null default 'new',
  created_at  timestamptz           not null default now(),
  updated_at  timestamptz           not null default now()
);

create index if not exists idx_inquiries_product on public.inquiries(product_id);
create index if not exists idx_inquiries_status  on public.inquiries(status);
create index if not exists idx_inquiries_created on public.inquiries(created_at desc);

-- ─── updated_at trigger ────────────────────────────────────

create or replace function public.set_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

create trigger trg_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger trg_inquiries_updated_at
  before update on public.inquiries
  for each row execute procedure public.set_updated_at();

-- ─── ROW LEVEL SECURITY ────────────────────────────────────

alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.inquiries  enable row level security;

-- Public read
create policy "Public read categories"
  on public.categories for select using (true);

create policy "Public read active products"
  on public.products for select using (is_active = true);

-- Authenticated (admin) full access
create policy "Auth full access categories"
  on public.categories for all using (auth.role() = 'authenticated');

create policy "Auth full access products"
  on public.products for all using (auth.role() = 'authenticated');

create policy "Auth full access inquiries"
  on public.inquiries for all using (auth.role() = 'authenticated');

-- Anyone can submit an inquiry
create policy "Public insert inquiries"
  on public.inquiries for insert with check (true);
