-- Agency settings table (one row per user)
create table if not exists public.agency_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  firm_name text not null default '',
  gst_number text not null default '',
  bank_account text not null default '',
  ifsc text not null default '',
  branch text not null default '',
  upi_id text not null default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.agency_settings enable row level security;

-- Users can only read/write their own settings
create policy "Users can read own settings"
  on public.agency_settings for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.agency_settings for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.agency_settings for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
