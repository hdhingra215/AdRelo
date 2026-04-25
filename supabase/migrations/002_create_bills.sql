-- Add bill_generated flag to release_orders
alter table public.release_orders
  add column if not exists bill_generated boolean default false not null;

-- Bills table
create table if not exists public.bills (
  id uuid default gen_random_uuid() primary key,
  bill_number text not null,
  date date not null,
  release_order_id uuid not null references public.release_orders(id),
  client_id uuid not null references public.clients(id),
  amount numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null default 0,
  gst numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  amount_in_words text not null default '',
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.bills enable row level security;

-- Policies
create policy "Authenticated users can read bills"
  on public.bills for select to authenticated using (true);

create policy "Authenticated users can insert bills"
  on public.bills for insert to authenticated with check (true);

-- Allow updating release_orders.bill_generated
create policy "Authenticated users can update release_orders"
  on public.release_orders for update to authenticated using (true) with check (true);
