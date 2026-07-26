-- ============================================================================
-- The Archivist - Seed Data Script
-- Target: PostgreSQL
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Categories
-- ---------------------------------------------------------------------------
INSERT INTO categories (id, name, slug) VALUES
  ('01', 'Marvel Multiverse',   'marvel-multiverse'),
  ('02', 'DC Multiverse',       'dc-multiverse'),
  ('03', 'Wizarding World',     'wizarding-world'),
  ('04', 'Star Wars Galaxy',    'star-wars-galaxy'),
  ('05', 'Anime & Manga',       'anime-manga'),
  ('06', 'Gaming & Esports',    'gaming-esports'),
  ('07', 'Cinema & Television', 'cinema-television'),
  ('08', 'Premium Originals',   'premium-originals')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Products
-- ---------------------------------------------------------------------------
INSERT INTO products (id, name, slug, price, original_price, description, category_id, in_stock, material, scale, edition, weight, height, features) VALUES
('marvel-01', 'Iron Man Mark III', 'iron-man-mark-iii', 249.99, 299.99, 'Highly detailed Iron Man Mark III armor figurine with LED arc reactor. Every plate is individually articulated for museum-quality posing.', '01', true, 'Polystone & Die-Cast Metal', '1/6', 'Limited Edition (5000 pcs)', '2.3 kg', '32 cm', '["LED-lit arc reactor and repulsors","Interchangeable hands and battle damage parts","Magnetic flight stand included","Numbered certificate of authenticity"]'::jsonb),
('marvel-02', 'Spider-Man (Classic Suit)', 'spider-man-classic-suit', 189.99, NULL, 'Classic red and blue Spider-Man figurine in dynamic web-swinging pose.', '01', true, 'Premium PVC', '1/6', 'Standard Edition', '1.1 kg', '30 cm', '["Detailed web pattern sculpt","Interchangeable web accessories","Dynamic display base"]'::jsonb),
('marvel-03', 'Thor (Stormbreaker)', 'thor-stormbreaker', 279.99, NULL, 'Thor with Stormbreaker, featuring interchangeable hands and lightning effects.', '01', true, 'Cold-Cast Porcelain', '1/6', 'Deluxe Edition (3000 pcs)', '3.1 kg', '35 cm', '["LED lightning effects on Stormbreaker","Interchangeable hands and cape options","Asgardian display base"]'::jsonb),
('marvel-04', 'Black Panther', 'black-panther', 219.99, NULL, 'Black Panther deluxe figurine with Vibranium energy effects.', '01', false, 'Premium PVC', '1/6', 'Deluxe Edition', '1.8 kg', '32 cm', '["UV-reactive Vibranium effects","Interchangeable masked and unmasked heads","Wakandan display base"]'::jsonb),
('marvel-05', 'Doctor Strange', 'doctor-strange', 239.99, NULL, 'Doctor Strange with magical rune disc and cloak effects.', '01', true, 'Polystone', '1/6', 'Standard Edition', '2.0 kg', '33 cm', '["Translucent magic circle effects","Articulated cloak of levitation","Eye of Agamotto pendant (light-up)"]'::jsonb),
('marvel-06', 'Venom', 'venom', 259.99, NULL, 'Venom 1/6 scale figurine with symbiotic tendrils and interchangeable heads.', '01', true, 'Premium PVC & Silicone', '1/6', 'Deluxe Edition (4000 pcs)', '2.5 kg', '36 cm', '["Extended symbiotic tendril accessories","Multiple interchangeable heads","Venomized display base"]'::jsonb),
('dc-01', 'Batman (The Dark Knight)', 'batman-the-dark-knight', 269.99, 319.99, 'The Dark Knight Batman premium figurine with fabric cape and gadget belt.', '02', true, 'Polystone & Fabric', '1/6', 'Deluxe Edition (5000 pcs)', '2.8 kg', '34 cm', '["Real fabric cape with wire framing","LED-light-up Bat-signal base","Interchangeable hands and Batarangs","Numbered certificate of authenticity"]'::jsonb),
('dc-02', 'Superman (Man of Steel)', 'superman-man-of-steel', 259.99, NULL, 'Superman in flight pose with fabric cape and heat vision effects.', '02', true, 'Cold-Cast Porcelain', '1/6', 'Standard Edition', '2.4 kg', '35 cm', '["Heat vision LED eye effect","Fabric cape with pose wire","Floating flight display stand"]'::jsonb),
('dc-03', 'Wonder Woman', 'wonder-woman', 249.99, NULL, 'Wonder Woman with Lasso of Truth and shield.', '02', true, 'Premium PVC', '1/6', 'Standard Edition', '1.9 kg', '32 cm', '["Lasso of Truth with LED glow","Interchangeable arms and weapons","Themysciran display base"]'::jsonb),
('dc-04', 'The Joker', 'the-joker', 229.99, NULL, 'The Joker deluxe figurine with interchangeable accessories and grinning portrait.', '02', true, 'Polystone', '1/6', 'Deluxe Edition (3500 pcs)', '1.7 kg', '31 cm', '["Interchangeable grinning and serious heads","Crowbar and playing card accessories","Graffiti-style display base"]'::jsonb),
('dc-05', 'Flash', 'flash', 219.99, NULL, 'The Flash in speedster pose with lightning effect trail.', '02', false, 'Premium PVC', '1/6', 'Standard Edition', '1.3 kg', '32 cm', '["Translucent lightning effect parts","Dynamic running pose sculpt","Speed Force display base"]'::jsonb),
('dc-06', 'Darkseid', 'darkseid', 349.99, NULL, 'Darkseid colossal figurine with Omega Beams and Apokoliptian throne.', '02', true, 'Cold-Cast Porcelain', '1/4', 'Collector''s Edition (2000 pcs)', '5.2 kg', '52 cm', '["LED Omega Beam effects","Apokoliptian throne display base","Interchangeable arms and head"]'::jsonb),
('wiz-01', 'Harry Potter (Hogwarts)', 'harry-potter-hogwarts', 199.99, NULL, 'Harry Potter with wand and Hogwarts robes, capturing the magic of the wizarding world.', '03', true, 'Premium PVC', '1/6', 'Standard Edition', '1.2 kg', '30 cm', '["Wand with spell-casting effect","Hogwarts robe with fabric detail","Hedwig companion accessory"]'::jsonb),
('wiz-02', 'Dumbledore', 'dumbledore', 239.99, NULL, 'Albus Dumbledore with Fawkes the phoenix and the Elder Wand.', '03', true, 'Polystone', '1/6', 'Deluxe Edition', '1.8 kg', '32 cm', '["Fawkes the phoenix companion","Elder Wand with magic effect","Pensive display accessory"]'::jsonb),
('wiz-03', 'Voldemort', 'voldemort', 259.99, NULL, 'Lord Voldemort with Nagini and the Elder Wand in dramatic battle pose.', '03', true, 'Cold-Cast Porcelain', '1/6', 'Deluxe Edition (3000 pcs)', '2.1 kg', '34 cm', '["Nagini snake companion","LED wand glow effect","Dark Mark display base"]'::jsonb),
('wiz-04', 'Newt Scamander', 'newt-scamander', 219.99, NULL, 'Newt Scamander with Niffler and Bowtruckle from Fantastic Beasts.', '03', true, 'Premium PVC', '1/6', 'Standard Edition', '1.4 kg', '30 cm', '["Niffler and Bowtruckle companions","Suitcase accessory with beast details","Magizoologist display base"]'::jsonb),
('wiz-05', 'Hedwig', 'hedwig', 149.99, NULL, 'Hedwig life-size figurine with snowy owl feather detailing.', '03', false, 'Polystone & Feather', '1/1', 'Life-Size Edition (2500 pcs)', '1.5 kg', '25 cm', '["Life-size scale with realistic feather texture","Perch display stand","Letter-carrying accessory"]'::jsonb),
('sw-01', 'Darth Vader', 'darth-vader', 299.99, 349.99, 'Darth Vader with light-up lightsaber and breathing sound effect module.', '04', true, 'Polystone & Die-Cast Metal', '1/6', 'Deluxe Edition (5000 pcs)', '3.4 kg', '38 cm', '["LED lightsaber with sound effects","Full cape and chest panel details","Death Star display base","Breathing sound module"]'::jsonb),
('sw-02', 'Stormtrooper', 'stormtrooper', 179.99, NULL, 'Imperial Stormtrooper with blaster rifle and authentic armor detailing.', '04', true, 'Premium PVC', '1/6', 'Standard Edition', '1.0 kg', '31 cm', '["Detailed armor sculpt with weathering","Blaster rifle accessory","Imperial display base"]'::jsonb),
('sw-03', 'Boba Fett', 'boba-fett', 269.99, NULL, 'Boba Fett with jetpack and EE-3 carbine rifle, helmet details included.', '04', true, 'Polystone', '1/6', 'Deluxe Edition', '2.0 kg', '32 cm', '["Jetpack with flame effects","EE-3 carbine rifle and blaster pistol","Worn armor weathering details"]'::jsonb),
('sw-04', 'Yoda', 'yoda', 199.99, NULL, 'Yoda with his walking stick and lightsaber in training pose.', '04', true, 'Premium PVC', '1/4', 'Standard Edition', '0.9 kg', '22 cm', '["Fabric robe and detailed skin texture","Walking stick and lightsaber","Dagobah swamp display base"]'::jsonb),
('sw-05', 'R2-D2', 'r2-d2', 189.99, NULL, 'R2-D2 with holographic Leia projection accessory and light-up dome.', '04', true, 'Die-Cast Metal & PVC', '1/6', 'Standard Edition', '1.6 kg', '28 cm', '["LED dome lights with sound effects","Holographic Leia projection accessory","Opening compartments with tools"]'::jsonb),
('sw-06', 'Han Solo in Carbonite', 'han-solo-in-carbonite', 329.99, NULL, 'Han Solo frozen in carbonite wall mount replica with LED freeze effect.', '04', true, 'Polystone & LED', '1/4', 'Collector''s Edition (2000 pcs)', '4.5 kg', '65 cm', '["LED ice-freeze glow effect","Wall-mountable carbonite slab","Detailed Han Solo silhouette"]'::jsonb),
('anime-01', 'Goku Ultra Instinct', 'goku-ultra-instinct', 269.99, NULL, 'Goku Ultra Instinct with silver aura energy effects and dynamic combat pose.', '05', true, 'Premium PVC', '1/6', 'Deluxe Edition (4000 pcs)', '1.8 kg', '33 cm', '["Translucent silver aura effects","Interchangeable hands and face plates","Energy blast display base"]'::jsonb),
('anime-02', 'Naruto (Sage Mode)', 'naruto-sage-mode', 229.99, NULL, 'Naruto in Sage Mode with toads and Rasengan effects.', '05', true, 'Premium PVC', '1/6', 'Standard Edition', '1.5 kg', '31 cm', '["Rasengan spiral effects","Gamakichi toad companion","Sage Mode eye details"]'::jsonb),
('anime-03', 'Eren Yeager (Titan)', 'eren-yeager-titan', 299.99, NULL, 'Eren Yeager Attack Titan form with steam effects and muscular sculpt.', '05', true, 'Cold-Cast Porcelain', '1/6', 'Deluxe Edition (3000 pcs)', '3.5 kg', '40 cm', '["Steam effect clouds around body","Interchangeable muscle arms","Battle-damage torso details"]'::jsonb),
('anime-04', 'L Lawliet', 'l-lawliet', 199.99, NULL, 'L with his iconic posture, apple, and phone accessory from Death Note.', '05', false, 'Premium PVC', '1/6', 'Standard Edition', '1.0 kg', '29 cm', '["Seated pose with phone and apple","Detailed casual clothing sculpt","Death Note stack accessory"]'::jsonb),
('anime-05', 'Gojo Satoru', 'gojo-satoru', 279.99, NULL, 'Satoru Gojo with Unlimited Void technique effects and blindfold.', '05', true, 'Polystone', '1/6', 'Deluxe Edition (3500 pcs)', '2.2 kg', '34 cm', '["Translucent Unlimited Void effects","Removable blindfold with revealed eyes head","Domain Expansion display base"]'::jsonb),
('anime-06', 'Mikasa Ackerman', 'mikasa-ackerman', 239.99, NULL, 'Mikasa Ackerman with ODM gear and blades in aerial attack pose.', '05', true, 'Premium PVC', '1/6', 'Standard Edition', '1.6 kg', '30 cm', '["ODM gear with metal cable effects","Interchangeable blades","Aerial dynamic display stand"]'::jsonb),
('gaming-01', 'Master Chief', 'master-chief', 289.99, 339.99, 'Master Chief with energy sword and assault rifle in combat stance.', '06', true, 'Polystone & Die-Cast Metal', '1/6', 'Deluxe Edition (5000 pcs)', '3.0 kg', '35 cm', '["LED energy sword with glow effect","Interchangeable MA5B assault rifle","Halo ring display base","Numbered certificate of authenticity"]'::jsonb),
('gaming-02', 'Geralt of Rivia', 'geralt-of-rivia', 259.99, NULL, 'Geralt with silver sword and Igni sign effects on a monster-hunter base.', '06', true, 'Polystone', '1/6', 'Deluxe Edition', '2.3 kg', '33 cm', '["Igni sign LED fire effect","Both steel and silver swords","Medallion with chain detail"]'::jsonb),
('gaming-03', 'Lara Croft', 'lara-croft', 239.99, NULL, 'Lara Croft with bow and climbing gear in jungle explorer attire.', '06', true, 'Premium PVC', '1/6', 'Standard Edition', '1.3 kg', '30 cm', '["Bow with LED arrow effect","Climbing axe and backpack accessories","Temple ruin display base"]'::jsonb),
('gaming-04', 'Kratos (God of War)', 'kratos-god-of-war', 309.99, NULL, 'Kratos with Leviathan Axe and Guardian Shield in battle pose.', '06', true, 'Cold-Cast Porcelain', '1/6', 'Collector''s Edition (3000 pcs)', '3.8 kg', '38 cm', '["Leviathan Axe with frost effects","Guardian Shield with LED glow","Midgard landscape display base"]'::jsonb),
('gaming-05', 'Cloud Strife', 'cloud-strife', 279.99, NULL, 'Cloud Strife with Buster Sword and materia effects on a Midgar base.', '06', false, 'Premium PVC', '1/6', 'Deluxe Edition', '2.0 kg', '33 cm', '["Buster Sword with materia glow","Interchangeable hands and sword poses","Hardedge sword alternate weapon"]'::jsonb),
('cinema-01', 'Indiana Jones', 'indiana-jones', 239.99, NULL, 'Indiana Jones with whip, fedora, and the Golden Idol in adventure pose.', '07', true, 'Premium PVC', '1/6', 'Standard Edition', '1.4 kg', '31 cm', '["Whip and revolver accessories","Golden Idol with pedestal","Fedora with realistic fabric"]'::jsonb),
('cinema-02', 'John Wick', 'john-wick', 269.99, NULL, 'John Wick in tactical suit with pistol and Continental coin.', '07', true, 'Polystone & Fabric', '1/6', 'Deluxe Edition', '1.7 kg', '32 cm', '["Fabric suit with realistic tailoring","Multiple weapon accessories","Continental coin display piece"]'::jsonb),
('cinema-03', 'Rick Sanchez', 'rick-sanchez', 199.99, NULL, 'Rick Sanchez with portal gun and flask in interdimensional pose.', '07', true, 'Premium PVC', '1/6', 'Standard Edition', '1.0 kg', '28 cm', '["Portal gun with LED glow","Flask and Meeseeks box accessories","Portal effect display base"]'::jsonb),
('cinema-04', 'Daenerys Targaryen', 'daenerys-targaryen', 259.99, NULL, 'Daenerys with Drogon and dragon eggs in her Mother of Dragons persona.', '07', true, 'Cold-Cast Porcelain', '1/6', 'Deluxe Edition (3500 pcs)', '2.5 kg', '34 cm', '["Drogon dragon companion","Dragon eggs with painted details","Throne room display base"]'::jsonb),
('cinema-05', 'The Mandalorian', 'the-mandalorian', 289.99, NULL, 'The Mandalorian with Grogu (The Child) and Amban phase-pulse rifle.', '07', false, 'Polystone & Die-Cast Metal', '1/6', 'Deluxe Edition (5000 pcs)', '2.8 kg', '33 cm', '["Grogu (The Child) in hover pram","Amban phase-pulse rifle with LED","Beskar armor battle damage details"]'::jsonb),
('orig-01', 'Celestial Sentinel', 'celestial-sentinel', 399.99, NULL, 'Exclusive Archivist original celestial warrior figurine with cosmic armor.', '08', true, 'Cold-Cast Porcelain & LED', '1/4', 'Collector''s Edition (1500 pcs)', '6.5 kg', '55 cm', '["Multi-point LED lighting system","Cosmic armor with gold accents","Celestial throne display base","Hand-numbered plaque"]'::jsonb),
('orig-02', 'Chronos Warden', 'chronos-warden', 449.99, NULL, 'Guardian of time with clockwork mechanisms and temporal effects.', '08', true, 'Polystone & Brass', '1/4', 'Collector''s Edition (1000 pcs)', '7.2 kg', '58 cm', '["Working clockwork gear details","Brass and bronze metal finishes","Time portal display base with LEDs","Hand-numbered certificate"]'::jsonb),
('orig-03', 'Void Reaper', 'void-reaper', 379.99, NULL, 'Otherworldly reaper from the void with cosmic scythe and ethereal glow.', '08', true, 'Cold-Cast Porcelain', '1/4', 'Collector''s Edition (2000 pcs)', '5.8 kg', '60 cm', '["Translucent ethereal effect parts","Cosmic scythe with LED glow","Void rift display base"]'::jsonb),
('orig-04', 'Arcane Construct', 'arcane-construct', 499.99, NULL, 'Mechanical construct infused with arcane energy and crystal formations.', '08', false, 'Die-Cast Metal & Crystal', '1/4', 'Ultra Rare (500 pcs)', '8.5 kg', '62 cm', '["Real crystal formations","Die-cast metal frame with articulation","Arcane glow LED system","Individually numbered plaque"]'::jsonb);

-- ---------------------------------------------------------------------------
-- 3. Product Images
-- ---------------------------------------------------------------------------
-- Primary image for every product
INSERT INTO product_images (id, product_id, url, is_primary, sort_order) VALUES
(gen_random_uuid(), 'marvel-01', 'https://placehold.co/400x400/DC143C/ffffff?text=Iron+Man', true, 0),
(gen_random_uuid(), 'marvel-02', 'https://placehold.co/400x400/DC143C/ffffff?text=Spider-Man', true, 0),
(gen_random_uuid(), 'marvel-03', 'https://placehold.co/400x400/DC143C/ffffff?text=Thor', true, 0),
(gen_random_uuid(), 'marvel-04', 'https://placehold.co/400x400/DC143C/ffffff?text=Black+Panther', true, 0),
(gen_random_uuid(), 'marvel-05', 'https://placehold.co/400x400/DC143C/ffffff?text=Doctor+Strange', true, 0),
(gen_random_uuid(), 'marvel-06', 'https://placehold.co/400x400/DC143C/ffffff?text=Venom', true, 0),
(gen_random_uuid(), 'dc-01', 'https://placehold.co/400x400/1E90FF/ffffff?text=Batman', true, 0),
(gen_random_uuid(), 'dc-02', 'https://placehold.co/400x400/1E90FF/ffffff?text=Superman', true, 0),
(gen_random_uuid(), 'dc-03', 'https://placehold.co/400x400/1E90FF/ffffff?text=Wonder+Woman', true, 0),
(gen_random_uuid(), 'dc-04', 'https://placehold.co/400x400/1E90FF/ffffff?text=Joker', true, 0),
(gen_random_uuid(), 'dc-05', 'https://placehold.co/400x400/1E90FF/ffffff?text=Flash', true, 0),
(gen_random_uuid(), 'dc-06', 'https://placehold.co/400x400/1E90FF/ffffff?text=Darkseid', true, 0),
(gen_random_uuid(), 'wiz-01', 'https://placehold.co/400x400/4A148C/ffffff?text=Harry+Potter', true, 0),
(gen_random_uuid(), 'wiz-02', 'https://placehold.co/400x400/4A148C/ffffff?text=Dumbledore', true, 0),
(gen_random_uuid(), 'wiz-03', 'https://placehold.co/400x400/4A148C/ffffff?text=Voldemort', true, 0),
(gen_random_uuid(), 'wiz-04', 'https://placehold.co/400x400/4A148C/ffffff?text=Newt+Scamander', true, 0),
(gen_random_uuid(), 'wiz-05', 'https://placehold.co/400x400/4A148C/ffffff?text=Hedwig', true, 0),
(gen_random_uuid(), 'sw-01', 'https://placehold.co/400x400/000000/ffffff?text=Darth+Vader', true, 0),
(gen_random_uuid(), 'sw-02', 'https://placehold.co/400x400/000000/ffffff?text=Stormtrooper', true, 0),
(gen_random_uuid(), 'sw-03', 'https://placehold.co/400x400/000000/ffffff?text=Boba+Fett', true, 0),
(gen_random_uuid(), 'sw-04', 'https://placehold.co/400x400/000000/ffffff?text=Yoda', true, 0),
(gen_random_uuid(), 'sw-05', 'https://placehold.co/400x400/000000/ffffff?text=R2-D2', true, 0),
(gen_random_uuid(), 'sw-06', 'https://placehold.co/400x400/000000/ffffff?text=Han+Solo', true, 0),
(gen_random_uuid(), 'anime-01', 'https://placehold.co/400x400/FF69B4/ffffff?text=Goku', true, 0),
(gen_random_uuid(), 'anime-02', 'https://placehold.co/400x400/FF69B4/ffffff?text=Naruto', true, 0),
(gen_random_uuid(), 'anime-03', 'https://placehold.co/400x400/FF69B4/ffffff?text=Eren+Yeager', true, 0),
(gen_random_uuid(), 'anime-04', 'https://placehold.co/400x400/FF69B4/ffffff?text=L+Lawliet', true, 0),
(gen_random_uuid(), 'anime-05', 'https://placehold.co/400x400/FF69B4/ffffff?text=Gojo', true, 0),
(gen_random_uuid(), 'anime-06', 'https://placehold.co/400x400/FF69B4/ffffff?text=Mikasa', true, 0),
(gen_random_uuid(), 'gaming-01', 'https://placehold.co/400x400/00C853/ffffff?text=Master+Chief', true, 0),
(gen_random_uuid(), 'gaming-02', 'https://placehold.co/400x400/00C853/ffffff?text=Geralt', true, 0),
(gen_random_uuid(), 'gaming-03', 'https://placehold.co/400x400/00C853/ffffff?text=Lara+Crofts', true, 0),
(gen_random_uuid(), 'gaming-04', 'https://placehold.co/400x400/00C853/ffffff?text=Kratos', true, 0),
(gen_random_uuid(), 'gaming-05', 'https://placehold.co/400x400/00C853/ffffff?text=Cloud+Strife', true, 0),
(gen_random_uuid(), 'cinema-01', 'https://placehold.co/400x400/FF6F00/ffffff?text=Indiana+Jones', true, 0),
(gen_random_uuid(), 'cinema-02', 'https://placehold.co/400x400/FF6F00/ffffff?text=John+Wick', true, 0),
(gen_random_uuid(), 'cinema-03', 'https://placehold.co/400x400/FF6F00/ffffff?text=Rick+Sanchez', true, 0),
(gen_random_uuid(), 'cinema-04', 'https://placehold.co/400x400/FF6F00/ffffff?text=Daenerys', true, 0),
(gen_random_uuid(), 'cinema-05', 'https://placehold.co/400x400/FF6F00/ffffff?text=Mandalorian', true, 0),
(gen_random_uuid(), 'orig-01', 'https://placehold.co/400x400/D4AF37/ffffff?text=Celestial', true, 0),
(gen_random_uuid(), 'orig-02', 'https://placehold.co/400x400/D4AF37/ffffff?text=Chronos', true, 0),
(gen_random_uuid(), 'orig-03', 'https://placehold.co/400x400/D4AF37/ffffff?text=Void+Reaper', true, 0),
(gen_random_uuid(), 'orig-04', 'https://placehold.co/400x400/D4AF37/ffffff?text=Arcane', true, 0);

-- Gallery images (products with additional images)
INSERT INTO product_images (id, product_id, url, is_primary, sort_order) VALUES
(gen_random_uuid(), 'marvel-01', 'https://placehold.co/600x600/DC143C/ffffff?text=Iron+Man+Front', false, 1),
(gen_random_uuid(), 'marvel-01', 'https://placehold.co/600x600/DC143C/ffffff?text=Iron+Man+Back', false, 2);

-- ---------------------------------------------------------------------------
-- 4. Blog Posts
-- ---------------------------------------------------------------------------
INSERT INTO blog_posts (id, title, slug, excerpt, content, image, author, date, category, featured) VALUES
(
  'collecting-guide-2026',
  'The Ultimate Guide to Collecting Premium Figurines in 2026',
  'the-ultimate-guide-to-collecting-premium-figurines-in-2026',
  'From limited editions to grail hunting, here''s everything you need to know about building a world-class collection.',
  'Welcome to the definitive guide for figurine collecting in 2026. Whether you''re a seasoned collector or just starting your journey, the landscape of premium collectibles has evolved dramatically.

**Understanding the Market**

The collectible figurine market has seen unprecedented growth. With limited edition runs and artist collaborations becoming the norm, knowing where to invest your passion (and budget) is crucial.

**Key Factors to Consider**

1. **Material Quality**: Premium PVC, cold-cast porcelain, and polystone offer different levels of detail and durability.
2. **Articulation**: Static statues vs. fully articulated figures — each has its place in a well-rounded collection.
3. **Packaging**: Mint condition boxes can significantly impact resale value.
4. **Authentication**: Always verify authenticity through serial numbers and certificates.

**Building Your Collection**

Start with characters that resonate with you personally. A curated collection of pieces you love will always be more satisfying than a scattergun approach. Focus on one or two categories and build depth.

**Storage and Display**

Proper display is an art form. Consider dust-free cabinets, UV-protective glass, and strategic lighting to showcase your collection like the museum it deserves to be.

Happy hunting, Archivist.',
  'https://placehold.co/1200x600/333333/DC143C?text=Collection+Guide',
  'The Archivist Team',
  '2026-07-15',
  'Guides',
  true
),
(
  'marvel-phase-7',
  'Marvel Phase 7: New Figurines Announced',
  'marvel-phase-7-new-figurines-announced',
  'Get ready for the next wave of Marvel collectibles inspired by the upcoming Phase 7 lineup.',
  'Marvel Studios has unveiled its Phase 7 slate, and we''ve already secured the licensing for an incredible new line of premium figurines...

Full article content with detailed analysis of each announced figure, release dates, and pre-order information.',
  'https://placehold.co/1200x600/333333/DC143C?text=Marvel+Phase+7',
  'Alex Chen',
  '2026-07-12',
  'News',
  true
),
(
  'dc-absolutely-timeless',
  'DC''s Absolutely Timeless Line: A Collector''s Dream',
  'dcs-absolutely-timeless-line-a-collectors-dream',
  'DC''s new premium line redefines what collector-grade figurines can be.',
  'DC Comics has raised the bar with their Absolutely Timeless line, featuring museum-quality statues...

Full article with detailed review of the line, pricing analysis, and comparison with other premium lines.',
  'https://placehold.co/1200x600/333333/1E90FF?text=DC+Timeless',
  'Sarah Mitchell',
  '2026-07-08',
  'Reviews',
  false
),
(
  'display-techniques',
  'Museum-Quality Display Techniques for Your Collection',
  'museum-quality-display-techniques-for-your-collection',
  'Transform your shelves into a gallery with these professional display tips.',
  'Creating the perfect display for your collection is an art form in itself...

Full article with lighting techniques, shelving options, and arrangement strategies.',
  'https://placehold.co/1200x600/333333/FF6F00?text=Display+Tips',
  'The Archivist Team',
  '2026-07-05',
  'Guides',
  false
),
(
  'anime-figurine-market',
  'The Booming Anime Figurine Market in 2026',
  'the-booming-anime-figurine-market-in-2026',
  'Anime collectibles are dominating the market. Here''s what''s driving the trend.',
  'The anime figurine market has exploded in 2026, with series like Jujutsu Kaisen and Demon Slayer leading the charge...

Full market analysis with trends, pricing data, and upcoming releases.',
  'https://placehold.co/1200x600/333333/FF69B4?text=Anime+Market',
  'Yuki Tanaka',
  '2026-07-01',
  'Trends',
  false
),
(
  'vault-exclusive-originals',
  'Behind the Scenes: Creating Our Premium Originals',
  'behind-the-scenes-creating-our-premium-originals',
  'An exclusive look at how The Archivist designs and produces original figurines.',
  'Ever wondered what goes into creating an original figurine from concept to production...

Full behind-the-scenes article with interviews with sculptors, painters, and designers.',
  'https://placehold.co/1200x600/333333/D4AF37?text=Originals+BTS',
  'Marcus Webb',
  '2026-06-28',
  'Behind the Scenes',
  true
),
(
  'star-wars-40th',
  'Star Wars: 40 Years of Premium Collectibles',
  'star-wars-40-years-of-premium-collectibles',
  'Celebrating four decades of the galaxy''s most sought-after figurines.',
  'From the original Kenner figures to today''s hyper-realistic premium statues...

Full retrospective with iconic pieces from each era and their current market values.',
  'https://placehold.co/1200x600/333333/000000?text=Star+Wars+40',
  'James O''Brien',
  '2026-06-20',
  'Features',
  false
),
(
  'gaming-2026-releases',
  'Most Anticipated Gaming Figurines of Late 2026',
  'most-anticipated-gaming-figurines-of-late-2026',
  'From Elden Ring to GTA VI, the gaming figurines you need to pre-order now.',
  'The gaming figurine calendar for late 2026 is absolutely stacked with incredible releases...

Full preview with release dates, pricing, and where to pre-order.',
  'https://placehold.co/1200x600/333333/00C853?text=Gaming+2026',
  'Alex Chen',
  '2026-06-15',
  'News',
  false
);

COMMIT;
