-- Add plan column to agency_settings for pricing tiers
alter table agency_settings
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'business'));
