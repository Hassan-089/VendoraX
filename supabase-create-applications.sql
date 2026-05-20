-- ============================================================
-- VendoraX: Create 'stall_applications' table
-- Run this in your Supabase SQL Editor to enable stall bookings!
-- ============================================================

CREATE TABLE IF NOT EXISTS stall_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES stall_packages(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (Optional, depending on your project setup)
-- ALTER TABLE stall_applications ENABLE ROW LEVEL SECURITY;

-- Index for fast queries by event
CREATE INDEX IF NOT EXISTS idx_stall_apps_event_id ON stall_applications (event_id);

-- Index for fast queries by business (vendor)
CREATE INDEX IF NOT EXISTS idx_stall_apps_business_id ON stall_applications (business_id);

-- Index for fast status checks
CREATE INDEX IF NOT EXISTS idx_stall_apps_status ON stall_applications (status);

SELECT 'Migration complete: stall_applications table and indexes created.' AS result;
