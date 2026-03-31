-- Add payment_instructions and qr_code_url to agency_settings
ALTER TABLE agency_settings
  ADD COLUMN IF NOT EXISTS payment_instructions TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS qr_code_url TEXT DEFAULT NULL;
