-- Clients table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now() not null
);

-- Release Orders table
create table if not exists public.release_orders (
  id uuid default gen_random_uuid() primary key,
  ro_number text not null,
  date date not null,
  client_id uuid not null references public.clients(id),
  publication text not null,
  edition text not null,
  advertisement_category text not null,
  caption text not null,
  size text not null,
  rate numeric(12,2) not null default 0,
  card_rate numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null default 0,
  gst numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  publishing_date date not null,
  special_comment text default '',
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.clients enable row level security;
alter table public.release_orders enable row level security;

-- Policies: allow authenticated users full access
create policy "Authenticated users can read clients"
  on public.clients for select to authenticated using (true);

create policy "Authenticated users can insert clients"
  on public.clients for insert to authenticated with check (true);

create policy "Authenticated users can read release_orders"
  on public.release_orders for select to authenticated using (true);

create policy "Authenticated users can insert release_orders"
  on public.release_orders for insert to authenticated with check (true);
