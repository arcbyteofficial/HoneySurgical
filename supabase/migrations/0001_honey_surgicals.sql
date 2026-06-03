create extension if not exists pgcrypto;

create type public.user_role as enum ('super_admin', 'product_manager');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.inquiry_status as enum ('new', 'contacted', 'closed');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'product_manager',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  parent_id uuid references public.categories(id) on delete restrict,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  brand_id uuid not null references public.brands(id) on delete restrict,
  price numeric(12, 2) check (price is null or price >= 0),
  short_description text not null,
  description text not null,
  specifications jsonb not null default '[]'::jsonb,
  features text[] not null default array[]::text[],
  keywords text[] not null default array[]::text[],
  status public.product_status not null default 'draft',
  view_count integer not null default 0 check (view_count >= 0),
  search_vector tsvector not null default ''::tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  message text not null,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  visitor_hash text,
  user_agent text,
  referrer text,
  viewed_at timestamptz not null default now()
);

create table public.search_logs (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  filters jsonb not null default '{}'::jsonb,
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index categories_parent_id_idx on public.categories(parent_id);
create index categories_slug_idx on public.categories(slug);
create index brands_slug_idx on public.brands(slug);
create index products_category_id_idx on public.products(category_id);
create index products_brand_id_idx on public.products(brand_id);
create index products_status_idx on public.products(status);
create index products_price_idx on public.products(price);
create index products_created_at_idx on public.products(created_at desc);
create index products_view_count_idx on public.products(view_count desc);
create index products_search_vector_idx on public.products using gin(search_vector);
create index product_images_product_id_idx on public.product_images(product_id, sort_order);
create index inquiries_status_idx on public.inquiries(status);
create index inquiries_created_at_idx on public.inquiries(created_at desc);
create index product_views_product_id_idx on public.product_views(product_id, viewed_at desc);
create index search_logs_query_idx on public.search_logs using gin(to_tsvector('english', query));
create index search_logs_created_at_idx on public.search_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger brands_set_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create or replace function public.set_product_search_vector()
returns trigger
language plpgsql
as $$
declare
  category_name text;
  brand_name text;
begin
  select name into category_name from public.categories where id = new.category_id;
  select name into brand_name from public.brands where id = new.brand_id;

  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.sku, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.short_description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(new.keywords, ' ')), 'B') ||
    setweight(to_tsvector('english', array_to_string(new.features, ' ')), 'D') ||
    setweight(to_tsvector('english', coalesce(new.specifications::text, '')), 'D');

  return new;
end;
$$;

create trigger products_set_search_vector
before insert or update on public.products
for each row execute function public.set_product_search_vector();

create or replace function public.increment_product_view(product uuid, visitor text default null, agent text default null, source text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.product_views(product_id, visitor_hash, user_agent, referrer)
  values (product, visitor, agent, source);

  update public.products
  set view_count = view_count + 1
  where id = product;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.users
    where auth_user_id = auth.uid()
      and role in ('super_admin', 'product_manager')
  );
$$;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.product_views enable row level security;
alter table public.search_logs enable row level security;

create policy "admins can manage users" on public.users
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read categories" on public.categories
for select using (true);
create policy "admins can manage categories" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read brands" on public.brands
for select using (true);
create policy "admins can manage brands" on public.brands
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read active products" on public.products
for select using (status = 'active');
create policy "admins can manage products" on public.products
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read active product images" on public.product_images
for select using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.status = 'active'
  )
);
create policy "admins can manage product images" on public.product_images
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can submit inquiries" on public.inquiries
for insert with check (true);
create policy "admins can manage inquiries" on public.inquiries
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can insert product views" on public.product_views
for insert with check (true);
create policy "admins can read product views" on public.product_views
for select using (public.is_admin());

create policy "public can insert search logs" on public.search_logs
for insert with check (true);
create policy "admins can read search logs" on public.search_logs
for select using (public.is_admin());

insert into public.brands (id, name, slug) values
  ('10000000-0000-4000-8000-000000000001', 'Honey Surgicals', 'honey-surgicals'),
  ('10000000-0000-4000-8000-000000000002', '3M', '3m'),
  ('10000000-0000-4000-8000-000000000003', 'Romsons', 'romsons'),
  ('10000000-0000-4000-8000-000000000004', 'BPL Medical', 'bpl-medical'),
  ('10000000-0000-4000-8000-000000000005', 'Dr. Morepen', 'dr-morepen'),
  ('10000000-0000-4000-8000-000000000006', 'Philips', 'philips'),
  ('10000000-0000-4000-8000-000000000007', 'Hindustan Syringes', 'hindustan-syringes')
on conflict (slug) do nothing;

insert into public.categories (id, name, slug, description, parent_id, sort_order) values
  ('20000000-0000-4000-8000-000000000001', 'Disposable Products', 'disposable-products', 'Disposable medical products for clinical and hospital procurement.', null, 1),
  ('20000000-0000-4000-8000-000000000002', 'Hospital Furniture', 'hospital-furniture', 'Hospital furniture for wards, ICU, examination, and patient movement.', null, 2),
  ('20000000-0000-4000-8000-000000000003', 'Surgical Instruments', 'surgical-instruments', 'Surgical instruments and sets for procedure rooms and operating theatres.', null, 3),
  ('20000000-0000-4000-8000-000000000004', 'Diagnostics', 'diagnostics', 'Diagnostic devices for clinical screening and monitoring.', null, 4),
  ('20000000-0000-4000-8000-000000000005', 'Orthopedic Products', 'orthopedic-products', 'Orthopedic supports, braces, and mobility assistance products.', null, 5),
  ('20000000-0000-4000-8000-000000000006', 'Medical Equipment', 'medical-equipment', 'Medical equipment for wards, emergency rooms, and homecare supply.', null, 6),
  ('20000000-0000-4000-8000-000000000007', 'Laboratory Equipment', 'laboratory-equipment', 'Laboratory devices and consumables for diagnostics and testing.', null, 7),
  ('20000000-0000-4000-8000-000000000008', 'Infection Control', 'infection-control', 'Infection control products for safety, sterilization, and facility hygiene.', null, 8),
  ('20000000-0000-4000-8000-000000000009', 'Emergency Care', 'emergency-care', 'Emergency care products for first response and clinical preparedness.', null, 9),
  ('20000000-0000-4000-8000-000000000010', 'Dental Products', 'dental-products', 'Dental equipment, instruments, and consumables.', null, 10),
  ('20000000-0000-4000-8000-000000000011', 'Rehabilitation Products', 'rehabilitation-products', 'Rehabilitation and mobility support products.', null, 11)
on conflict (slug) do nothing;

insert into public.categories (name, slug, description, parent_id, sort_order) values
  ('Surgical Gloves', 'surgical-gloves', 'Surgical gloves for sterile procedure use.', '20000000-0000-4000-8000-000000000001', 1),
  ('Latex Gloves', 'latex-gloves', 'Latex gloves for clinical examination and procedure support.', '20000000-0000-4000-8000-000000000001', 2),
  ('Nitrile Gloves', 'nitrile-gloves', 'Nitrile gloves for latex-free medical use.', '20000000-0000-4000-8000-000000000001', 3),
  ('Masks', 'masks', 'Surgical and protective masks.', '20000000-0000-4000-8000-000000000001', 4),
  ('Syringes', 'syringes', 'Disposable syringes for clinical use.', '20000000-0000-4000-8000-000000000001', 5),
  ('IV Sets', 'iv-sets', 'IV infusion sets and related disposables.', '20000000-0000-4000-8000-000000000001', 6),
  ('Catheters', 'catheters', 'Catheters for hospital supply.', '20000000-0000-4000-8000-000000000001', 7),
  ('Cannulas', 'cannulas', 'Cannulas for IV access and clinical care.', '20000000-0000-4000-8000-000000000001', 8),
  ('Surgical Drapes', 'surgical-drapes', 'Surgical drapes for sterile operating environments.', '20000000-0000-4000-8000-000000000001', 9),
  ('Hospital Beds', 'hospital-beds', 'Hospital beds for wards and rooms.', '20000000-0000-4000-8000-000000000002', 1),
  ('ICU Beds', 'icu-beds', 'ICU beds with clinical care functions.', '20000000-0000-4000-8000-000000000002', 2),
  ('Fowler Beds', 'fowler-beds', 'Fowler beds for patient positioning.', '20000000-0000-4000-8000-000000000002', 3),
  ('Wheelchairs', 'wheelchairs', 'Wheelchairs for patient mobility.', '20000000-0000-4000-8000-000000000002', 4),
  ('Stretchers', 'stretchers', 'Stretchers for patient transfer and emergency care.', '20000000-0000-4000-8000-000000000002', 5),
  ('Examination Tables', 'examination-tables', 'Examination tables for clinics and hospitals.', '20000000-0000-4000-8000-000000000002', 6),
  ('Bedside Lockers', 'bedside-lockers', 'Bedside lockers for patient rooms.', '20000000-0000-4000-8000-000000000002', 7),
  ('Forceps', 'forceps', 'Surgical forceps.', '20000000-0000-4000-8000-000000000003', 1),
  ('Scissors', 'scissors', 'Surgical scissors.', '20000000-0000-4000-8000-000000000003', 2),
  ('Retractors', 'retractors', 'Surgical retractors.', '20000000-0000-4000-8000-000000000003', 3),
  ('Needle Holders', 'needle-holders', 'Needle holders for surgical procedures.', '20000000-0000-4000-8000-000000000003', 4),
  ('Clamps', 'clamps', 'Surgical clamps.', '20000000-0000-4000-8000-000000000003', 5),
  ('Surgical Sets', 'surgical-sets', 'Surgical instrument sets.', '20000000-0000-4000-8000-000000000003', 6),
  ('Stethoscopes', 'stethoscopes', 'Clinical stethoscopes.', '20000000-0000-4000-8000-000000000004', 1),
  ('BP Monitors', 'bp-monitors', 'Blood pressure monitors.', '20000000-0000-4000-8000-000000000004', 2),
  ('Thermometers', 'thermometers', 'Digital and clinical thermometers.', '20000000-0000-4000-8000-000000000004', 3),
  ('Pulse Oximeters', 'pulse-oximeters', 'Pulse oximeters for SpO2 monitoring.', '20000000-0000-4000-8000-000000000004', 4),
  ('Glucometers', 'glucometers', 'Glucometers and diabetes monitoring supplies.', '20000000-0000-4000-8000-000000000004', 5),
  ('Knee Braces', 'knee-braces', 'Knee braces for support and rehabilitation.', '20000000-0000-4000-8000-000000000005', 1),
  ('Cervical Collars', 'cervical-collars', 'Cervical collars and neck supports.', '20000000-0000-4000-8000-000000000005', 2),
  ('Lumbar Supports', 'lumbar-supports', 'Lumbar support belts.', '20000000-0000-4000-8000-000000000005', 3),
  ('Walkers', 'walkers', 'Walking frames and walkers.', '20000000-0000-4000-8000-000000000005', 4),
  ('Crutches', 'crutches', 'Crutches and walking support products.', '20000000-0000-4000-8000-000000000005', 5),
  ('ECG Machines', 'ecg-machines', 'ECG machines for diagnostics.', '20000000-0000-4000-8000-000000000006', 1),
  ('Defibrillators', 'defibrillators', 'Defibrillators for emergency care.', '20000000-0000-4000-8000-000000000006', 2),
  ('Nebulizers', 'nebulizers', 'Nebulizers for respiratory care.', '20000000-0000-4000-8000-000000000006', 3),
  ('Suction Machines', 'suction-machines', 'Suction machines for clinical use.', '20000000-0000-4000-8000-000000000006', 4),
  ('Oxygen Concentrators', 'oxygen-concentrators', 'Oxygen concentrators for respiratory support.', '20000000-0000-4000-8000-000000000006', 5),
  ('Microscopes', 'microscopes', 'Laboratory microscopes.', '20000000-0000-4000-8000-000000000007', 1),
  ('Centrifuges', 'centrifuges', 'Laboratory centrifuges.', '20000000-0000-4000-8000-000000000007', 2),
  ('Test Tubes', 'test-tubes', 'Test tubes and sample containers.', '20000000-0000-4000-8000-000000000007', 3),
  ('Lab Consumables', 'lab-consumables', 'Laboratory consumables.', '20000000-0000-4000-8000-000000000007', 4),
  ('PPE Kits', 'ppe-kits', 'PPE kits for clinical safety.', '20000000-0000-4000-8000-000000000008', 1),
  ('Sanitizers', 'sanitizers', 'Sanitizers for hand and surface hygiene.', '20000000-0000-4000-8000-000000000008', 2),
  ('Sterilizers', 'sterilizers', 'Sterilizers for infection control.', '20000000-0000-4000-8000-000000000008', 3),
  ('Disinfectants', 'disinfectants', 'Disinfectants for facility hygiene.', '20000000-0000-4000-8000-000000000008', 4),
  ('First Aid Kits', 'first-aid-kits', 'First aid kits for emergency readiness.', '20000000-0000-4000-8000-000000000009', 1),
  ('Emergency Stretchers', 'emergency-stretchers', 'Emergency stretchers for transfer and response.', '20000000-0000-4000-8000-000000000009', 2),
  ('Ambu Bags', 'ambu-bags', 'Ambu bags for emergency ventilation.', '20000000-0000-4000-8000-000000000009', 3),
  ('Dental Instruments', 'dental-instruments', 'Dental instruments for clinics.', '20000000-0000-4000-8000-000000000010', 1),
  ('Dental Chairs', 'dental-chairs', 'Dental chairs and dental furniture.', '20000000-0000-4000-8000-000000000010', 2),
  ('Dental Consumables', 'dental-consumables', 'Dental consumables for routine care.', '20000000-0000-4000-8000-000000000010', 3),
  ('Walking Sticks', 'walking-sticks', 'Walking sticks and support canes.', '20000000-0000-4000-8000-000000000011', 1),
  ('Mobility Aids', 'mobility-aids', 'Mobility aids for rehabilitation.', '20000000-0000-4000-8000-000000000011', 2),
  ('Support Devices', 'support-devices', 'Support devices for rehabilitation care.', '20000000-0000-4000-8000-000000000011', 3)
on conflict (slug) do nothing;
