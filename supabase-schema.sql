-- ═══════════════════════════════════════════════════════
--  GEAR APP – Supabase Schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL)
-- ═══════════════════════════════════════════════════════

-- Equipment table
create table if not exists equipment (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null check (category in ('bike', 'running', 'ski', 'snowboard')),
  name text not null,
  subtype text default '',
  image text,
  serial_number text default '',
  purchase_date date,
  purchase_price numeric default 0,
  retailer text default '',
  notes text default '',
  strava_gear_id text,
  specs jsonb default '{}'::jsonb,
  total_km numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Wear parts table
create table if not exists wear_parts (
  id uuid default gen_random_uuid() primary key,
  equipment_id uuid references equipment(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default '',
  brand text default '–',
  km numeric default 0,
  max_km numeric default 1000,
  date date default current_date,
  cost numeric default 0,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_equipment_user on equipment(user_id);
create index if not exists idx_wear_parts_equipment on wear_parts(equipment_id);
create index if not exists idx_wear_parts_user on wear_parts(user_id);

-- Row Level Security (RLS)
alter table equipment enable row level security;
alter table wear_parts enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own equipment"
  on equipment for select using (auth.uid() = user_id);

create policy "Users can insert own equipment"
  on equipment for insert with check (auth.uid() = user_id);

create policy "Users can update own equipment"
  on equipment for update using (auth.uid() = user_id);

create policy "Users can delete own equipment"
  on equipment for delete using (auth.uid() = user_id);

create policy "Users can view own wear_parts"
  on wear_parts for select using (auth.uid() = user_id);

create policy "Users can insert own wear_parts"
  on wear_parts for insert with check (auth.uid() = user_id);

create policy "Users can update own wear_parts"
  on wear_parts for update using (auth.uid() = user_id);

create policy "Users can delete own wear_parts"
  on wear_parts for delete using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger equipment_updated_at
  before update on equipment
  for each row execute function update_updated_at();
