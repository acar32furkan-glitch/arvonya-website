-- Arvonya — initial schema
-- Run this in Supabase Dashboard → SQL Editor

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.properties (
  id text primary key,
  code text not null,
  kind text not null default 'property',
  listing_type text not null,
  sub_type text not null,
  title text not null,
  price_tl numeric not null,
  price_usd numeric,
  location_city text,
  location_district text,
  location_neighborhood text,
  rooms text,
  area_m2 numeric,
  floor text,
  total_floors text,
  building_age text,
  heating text,
  balcony text,
  status text,
  description text,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id text primary key,
  code text not null,
  kind text not null default 'vehicle',
  title text not null,
  price_tl numeric not null,
  price_usd numeric,
  description text,
  images text[] not null default '{}',
  year integer not null,
  km integer not null default 0,
  transmission text,
  fuel text,
  condition text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Helpful indexes for listing queries
create index if not exists properties_is_active_created_at_idx
  on public.properties (is_active, created_at desc);

create index if not exists vehicles_is_active_created_at_idx
  on public.vehicles (is_active, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security (anon key — read-only public listings)
-- ---------------------------------------------------------------------------

alter table public.properties enable row level security;
alter table public.vehicles enable row level security;

create policy "Public read active properties"
  on public.properties
  for select
  using (is_active = true);

create policy "Public read active vehicles"
  on public.vehicles
  for select
  using (is_active = true);

-- Admin write policies: add later with authenticated role or service role.

-- ---------------------------------------------------------------------------
-- Storage: public "listings" bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listings',
  'listings',
  true,
  5242880, -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Allow public read on listing images
create policy "Public read listing images"
  on storage.objects
  for select
  using (bucket_id = 'listings');

-- Allow authenticated uploads (tighten with auth later)
create policy "Authenticated upload listing images"
  on storage.objects
  for insert
  with check (bucket_id = 'listings');

create policy "Authenticated update listing images"
  on storage.objects
  for update
  using (bucket_id = 'listings');

create policy "Authenticated delete listing images"
  on storage.objects
  for delete
  using (bucket_id = 'listings');
