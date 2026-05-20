-- ============================================================
-- VendoraX: Add 'category' column to events table
-- Run this FIRST in Supabase SQL Editor, BEFORE the seed script
-- ============================================================

-- Step 1: Add the category column (nullable so existing rows aren't broken)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS category TEXT;

-- Step 2: Add the image_url column for event cover images
ALTER TABLE events
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Step 3: Create an index for fast category-based queries
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);

-- Step 4: Create an index for city-based queries
CREATE INDEX IF NOT EXISTS idx_events_city ON events (city);

-- Step 5: Create an index for status-based queries (already may exist)
CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);

-- Confirmation
SELECT 'Migration complete: category, image_url columns added with indexes.' AS result;
