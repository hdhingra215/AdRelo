-- Add contact/business details to clients
alter table public.clients add column if not exists phone text default '';
alter table public.clients add column if not exists gst_number text default '';
alter table public.clients add column if not exists address text default '';

-- Allow authenticated users to update clients
create policy "Authenticated users can update clients"
  on public.clients for update to authenticated using (true) with check (true);
