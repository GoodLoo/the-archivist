CREATE TABLE IF NOT EXISTS store_settings (
  id integer primary key default 1,
  store_name text not null default 'The Archivist',
  store_email text not null default 'contact@archivist.com',
  store_phone text not null default '+1 (555) 123-4567',
  store_address text not null default '123 Collector Ave, Suite 100, New York, NY 10001',
  currency text not null default 'USD',
  tax_rate numeric not null default 8.875,
  free_shipping_threshold numeric not null default 100,
  whatsapp_phone text not null default '+1234567890',
  facebook text not null default 'https://facebook.com/archivist',
  twitter text not null default 'https://twitter.com/archivist',
  instagram text not null default 'https://instagram.com/archivist',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

INSERT INTO store_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
