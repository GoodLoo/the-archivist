-- Run this in Supabase SQL Editor
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number text;
