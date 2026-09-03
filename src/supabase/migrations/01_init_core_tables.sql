-- ========================================================
-- 01_init_core_tables.sql
-- Core Content Tables for Aesthetic Admin Portal
-- ========================================================

-- 1. SERVICES & CARE INSTRUCTIONS TABLE
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null,
  description text not null,
  pre_care text,
  post_care text
);

-- 2. PROMOS & OFFERS TABLE
create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  discount_tag text not null,
  description text not null,
  expiry_date date not null
);

-- 3. PATIENT FEEDBACK / TESTIMONIALS TABLE
create table if not exists public.patient_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_name text not null,
  treatment_taken text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================

-- Enable RLS on all tables
alter table public.services enable row level security;
alter table public.promos enable row level security;
alter table public.patient_feedback enable row level security;

-- Drop existing policies first to prevent 42710 duplicate errors
drop policy if exists "Allow public read access on services" on public.services;
drop policy if exists "Allow insert access on services" on public.services;

drop policy if exists "Allow public read access on promos" on public.promos;
drop policy if exists "Allow insert access on promos" on public.promos;

drop policy if exists "Allow public read access on patient_feedback" on public.patient_feedback;
drop policy if exists "Allow insert access on patient_feedback" on public.patient_feedback;

-- CREATE READ POLICIES
create policy "Allow public read access on services" 
  on public.services for select using (true);

create policy "Allow public read access on promos" 
  on public.promos for select using (true);

create policy "Allow public read access on patient_feedback" 
  on public.patient_feedback for select using (true);

-- CREATE WRITE POLICIES
create policy "Allow insert access on services" 
  on public.services for insert with check (true);

create policy "Allow insert access on promos" 
  on public.promos for insert with check (true);

create policy "Allow insert access on patient_feedback" 
  on public.patient_feedback for insert with check (true);