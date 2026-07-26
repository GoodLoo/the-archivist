-- Run this in Supabase SQL Editor

-- Orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS date text;

-- Order timeline
ALTER TABLE order_timeline ADD COLUMN IF NOT EXISTS label text;
ALTER TABLE order_timeline ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;

-- Order items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name text;
