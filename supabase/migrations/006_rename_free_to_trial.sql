-- Rename 'free' plan to 'trial' in agency_settings
-- 1. Update existing rows
update agency_settings set plan = 'trial' where plan = 'free';

-- 2. Drop old check constraint and add new one
alter table agency_settings drop constraint if exists agency_settings_plan_check;
alter table agency_settings
  add constraint agency_settings_plan_check
    check (plan in ('trial', 'pro', 'business'));

-- 3. Update default
alter table agency_settings alter column plan set default 'trial';
