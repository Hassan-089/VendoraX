-- ============================================================
-- VendoraX: Seed Script — Pakistani Events (with Categories)
-- ============================================================
-- PREREQUISITE: Run supabase-add-category.sql FIRST
-- Then run this in Supabase SQL Editor
-- ============================================================
-- This script:
-- 1. Finds the user ID for mhassan.farooq089@gmail.com
-- 2. Deletes any existing events for that organizer (clean slate)
-- 3. Inserts 15 real-world-style Pakistani events (approved)
-- 4. Inserts stall packages for each event
-- ============================================================

DO $$
DECLARE
  v_organizer_id uuid;
  v_event_id uuid;
BEGIN

  -- ===== Step 1: Get the organizer's user ID =====
  SELECT id INTO v_organizer_id
  FROM auth.users
  WHERE email = 'mhassan.farooq089@gmail.com'
  LIMIT 1;

  IF v_organizer_id IS NULL THEN
    RAISE EXCEPTION 'User with email mhassan.farooq089@gmail.com not found. Please sign up first.';
  END IF;

  -- Make sure the profile has organizer role
  UPDATE profiles SET role = 'organizer' WHERE id = v_organizer_id;

  -- Clean up old data for this organizer (optional — remove if you want to keep existing)
  DELETE FROM stall_packages WHERE event_id IN (
    SELECT id FROM events WHERE organizer_id = v_organizer_id
  );
  DELETE FROM events WHERE organizer_id = v_organizer_id;

  -- ============================================================
  -- EVENT 1: Lahore Eat Food Festival 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Lahore Eat Food Festival 2025',
    'Pakistan''s biggest food festival returns to Lahore! Over 150 food stalls, live cooking competitions, celebrity chef appearances, and a dedicated kids zone. Featuring the best of Lahori street food, international cuisine, dessert villages, and artisanal beverages. Sponsored by leading Pakistani food brands.',
    'Lahore',
    'Expo Centre Lahore, Johar Town',
    '2025-11-15',
    '2025-11-17',
    50000,
    v_organizer_id,
    'approved',
    'Food & Beverage',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    NOW() - INTERVAL '2 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Standard Food Stall', 35000, '10x10 ft', ARRAY['1 Table', '2 Chairs', 'Electricity', 'Event Listing']),
    (v_event_id, 'Premium Food Pavilion', 85000, '20x15 ft', ARRAY['3 Tables', '6 Chairs', 'Premium Location', 'LED Screen', 'Electricity', 'Social Media Feature']),
    (v_event_id, 'Title Sponsor Package', 500000, '30x30 ft', ARRAY['Main Stage Branding', 'VIP Lounge Access', '10 Passes', 'Logo on All Marketing', 'Dedicated Social Media Campaign']);

  -- ============================================================
  -- EVENT 2: Pakistan Tech Summit 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Pakistan Tech Summit 2025',
    'The largest technology conference in Pakistan bringing together 200+ speakers, startup founders, investors, and tech leaders. Panels on AI, fintech, blockchain, SaaS, and e-commerce. Includes hackathon, startup pitch competition with PKR 5M prize pool, and networking sessions.',
    'Islamabad',
    'Pak-China Friendship Centre, Islamabad',
    '2025-10-20',
    '2025-10-22',
    15000,
    v_organizer_id,
    'approved',
    'Technology',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    NOW() - INTERVAL '3 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Startup Booth', 50000, '8x8 ft', ARRAY['1 Table', '2 Chairs', 'WiFi', 'Event Guide Listing']),
    (v_event_id, 'Corporate Pavilion', 200000, '20x20 ft', ARRAY['6 Passes', 'Premium Floor Location', 'Lead Scanner', 'Logo on Stage Screen', 'Dedicated Power']),
    (v_event_id, 'Innovation Partner', 750000, '40x30 ft', ARRAY['Keynote Slot', 'Full Branding', '20 VIP Passes', 'Media Coverage', 'App Banner Ad']);

  -- ============================================================
  -- EVENT 3: Karachi Fashion Week 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Karachi Fashion Week 2025',
    'South Asia''s premier fashion event showcasing 50+ Pakistani designers, bridal couture, pret collections, and streetwear. Featuring runway shows, fashion talks, pop-up boutiques, and celebrity appearances. A must-attend for fashion brands and lifestyle companies looking to connect with affluent audiences.',
    'Karachi',
    'Pearl Continental Hotel, Karachi',
    '2025-12-05',
    '2025-12-08',
    20000,
    v_organizer_id,
    'approved',
    'Fashion & Lifestyle',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Boutique Pop-Up', 75000, '10x10 ft', ARRAY['Mannequin Display', 'Lighting', '2 Passes', 'Event Catalogue Listing']),
    (v_event_id, 'Designer Showcase', 200000, '20x15 ft', ARRAY['Runway Slot', '6 Passes', 'VIP Area Access', 'Professional Photography', 'LED Screen']),
    (v_event_id, 'Platinum Sponsor', 1000000, 'Full Branding', ARRAY['Title Naming Rights', 'Main Runway Branding', '25 VIP Passes', 'Red Carpet Access', 'Exclusive Media Wall']);

  -- ============================================================
  -- EVENT 4: Lahore Literary Festival 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Lahore Literary Festival 2025',
    'The iconic LLF returns with 100+ sessions featuring Nobel laureates, Pulitzer winners, Pakistani authors, poets, and intellectuals. Book launches, mushairas, panel discussions on democracy, art, music, and heritage. Includes dedicated children''s literature zone and Sufi music evenings at the historic Alhamra.',
    'Lahore',
    'Alhamra Art Centre, Mall Road, Lahore',
    '2025-09-12',
    '2025-09-14',
    25000,
    v_organizer_id,
    'approved',
    'Arts & Culture',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    NOW() - INTERVAL '4 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Book Stall', 25000, '8x8 ft', ARRAY['1 Bookshelf Unit', '2 Chairs', 'Event Programme Listing']),
    (v_event_id, 'Publisher Pavilion', 65000, '15x12 ft', ARRAY['Author Signing Area', '4 Passes', 'Premium Location', 'Social Media Feature']),
    (v_event_id, 'Cultural Partner', 300000, '25x20 ft', ARRAY['Panel Sponsorship', 'Stage Branding', '10 VIP Passes', 'Logo on All Print Material']);

  -- ============================================================
  -- EVENT 5: Karachi Eat Festival 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Karachi Eat Festival 2025',
    'Karachi''s most loved food festival with 200+ food vendors, live music performances by Coke Studio artists, dessert competitions, and food truck alley. Experience the best biryani, BBQ, seafood, and fusion cuisine Karachi has to offer. Family-friendly with kids activities and carnival rides.',
    'Karachi',
    'Beach View Park, Clifton, Karachi',
    '2025-12-20',
    '2025-12-22',
    75000,
    v_organizer_id,
    'approved',
    'Food & Beverage',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    NOW() - INTERVAL '5 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Food Cart', 20000, '8x6 ft', ARRAY['Electricity', '1 Table', 'Event Listing']),
    (v_event_id, 'Food Stall', 45000, '12x10 ft', ARRAY['2 Tables', '4 Chairs', 'Electricity', 'Water Supply', 'Event Guide Feature']),
    (v_event_id, 'Food Zone Sponsor', 350000, '25x20 ft', ARRAY['Zone Naming Rights', 'Logo on Entrance', '8 Passes', 'Social Media Takeover', 'Celebrity Chef Meet']);

  -- ============================================================
  -- EVENT 6: Islamabad Business Conclave 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Islamabad Business Conclave 2025',
    'An exclusive business networking event connecting C-level executives, government officials, diplomats, and investors. Featuring panels on Pakistan''s economic future, CPEC updates, trade policy, and foreign investment. Includes private boardroom meetings and black-tie gala dinner.',
    'Islamabad',
    'Serena Hotel, Islamabad',
    '2025-10-10',
    '2025-10-11',
    5000,
    v_organizer_id,
    'approved',
    'Business & Corporate',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    NOW() - INTERVAL '6 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Exhibition Booth', 100000, '10x10 ft', ARRAY['2 Delegate Passes', 'WiFi', 'Brochure Distribution', 'Event Guide Listing']),
    (v_event_id, 'Diamond Partner', 500000, '20x20 ft', ARRAY['Keynote Introduction', '10 VIP Passes', 'Gala Dinner Table', 'Full Branding', 'Media Interviews']);

  -- ============================================================
  -- EVENT 7: DHA Wedding Expo Lahore 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'DHA Wedding Expo Lahore 2025',
    'Lahore''s grandest wedding exhibition featuring 100+ bridal designers, wedding planners, caterers, photographers, jewellers, and decor specialists. Live mehndi artist demonstrations, bridal runway shows, and couple consultation booths. Perfect for brands targeting the PKR 1 trillion wedding industry.',
    'Lahore',
    'Royal Palm Golf & Country Club, Lahore',
    '2025-11-01',
    '2025-11-03',
    30000,
    v_organizer_id,
    'approved',
    'Weddings & Lifestyle',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    NOW() - INTERVAL '7 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Vendor Booth', 40000, '10x8 ft', ARRAY['Table & Display', '2 Passes', 'Catalogue Listing']),
    (v_event_id, 'Premium Showcase', 120000, '20x15 ft', ARRAY['Runway Feature', '6 Passes', 'VIP Parking', 'Social Media Promotion', 'LED Display']),
    (v_event_id, 'Bridal Title Sponsor', 600000, '30x25 ft', ARRAY['Main Stage Branding', 'All Marketing Collateral', '15 VIP Passes', 'Exclusive Lounge', 'Media Coverage']);

  -- ============================================================
  -- EVENT 8: Pakistan Auto Show 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Pakistan Auto Show 2025',
    'The ultimate automotive experience — new car launches, EV showcases, supercars, modified vehicles, and vintage car exhibitions. Test drive zones, auto parts marketplace, motorsport simulator challenges, and panel discussions on Pakistan''s EV future. Featuring brands like Toyota, Honda, KIA, MG, and BYD.',
    'Lahore',
    'Expo Centre Lahore, Hall 1-4',
    '2025-11-22',
    '2025-11-24',
    60000,
    v_organizer_id,
    'approved',
    'Automotive',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    NOW() - INTERVAL '8 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Auto Parts Booth', 30000, '10x10 ft', ARRAY['Display Table', '2 Passes', 'Electricity', 'Catalogue Listing']),
    (v_event_id, 'Car Display Zone', 150000, '30x25 ft', ARRAY['Vehicle Display Platform', '6 Passes', 'Spotlight Lighting', 'Test Drive Route Access', 'PA Announcements']),
    (v_event_id, 'Auto Title Partner', 800000, '50x40 ft', ARRAY['Main Hall Naming', 'Grand Entrance Branding', '20 VIP Passes', 'Press Conference Slot', 'Full Digital Campaign']);

  -- ============================================================
  -- EVENT 9: Islamabad Music Festival 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Islamabad Music Festival 2025',
    'A 2-day open-air music extravaganza in the scenic Margalla Hills backdrop. Featuring performances by Atif Aslam, Ali Zafar, Aima Baig, Young Stunners, and 20+ emerging artists. Multiple stages, DJ sets, acoustic unplugged sessions, food courts, and art installations. The must-attend musical event of 2025.',
    'Islamabad',
    'Fatima Jinnah Park (F-9 Park), Islamabad',
    '2025-10-25',
    '2025-10-26',
    40000,
    v_organizer_id,
    'approved',
    'Music & Entertainment',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    NOW() - INTERVAL '9 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Brand Activation Stall', 60000, '12x10 ft', ARRAY['Brand Sampling Area', '4 Passes', 'Electricity', 'Music Between Sets Shoutout']),
    (v_event_id, 'Stage Sponsor', 400000, '20x20 ft', ARRAY['Stage Naming Rights', '10 VIP Passes', 'Backstage Access', 'Artist Meet & Greet', 'Full Branding']),
    (v_event_id, 'Beverage Partner', 250000, '15x15 ft', ARRAY['Exclusive Beverage Rights', '8 Passes', 'Bar Setup Area', 'Cup Branding', 'Social Media Feature']);

  -- ============================================================
  -- EVENT 10: Faisalabad Textile & Trade Expo 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Faisalabad Textile & Trade Expo 2025',
    'Pakistan''s textile capital hosts the biggest B2B trade exhibition — connecting manufacturers, exporters, buyers, and textile machinery suppliers. Live demonstrations of weaving, dyeing, and digital printing technologies. International buyers from 30+ countries expected. Organized with support from FCCI and APTMA.',
    'Faisalabad',
    'Faisalabad Expo Centre, Jaranwala Road',
    '2025-09-28',
    '2025-09-30',
    12000,
    v_organizer_id,
    'approved',
    'Trade & Industry',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    NOW() - INTERVAL '10 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Standard Trade Booth', 40000, '10x10 ft', ARRAY['Display Area', '2 Passes', 'WiFi', 'B2B Meeting Schedule']),
    (v_event_id, 'Machinery Demo Zone', 150000, '25x20 ft', ARRAY['Heavy Equipment Space', '6 Passes', 'Power Supply (3-Phase)', 'Catalogue Premium Listing']),
    (v_event_id, 'Industry Partner', 400000, '30x25 ft', ARRAY['Panel Sponsorship', 'Award Ceremony Branding', '12 VIP Passes', 'International Buyer Matchmaking']);

  -- ============================================================
  -- EVENT 11: Karachi International Book Fair 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Karachi International Book Fair 2025',
    'The largest book fair in South Asia with 300+ publishers, 50,000+ book titles, author signings, children''s storytelling sessions, and educational technology showcases. Featuring international publishers from UK, US, Turkey, and Middle East. Special discounts of up to 70% on books across all genres.',
    'Karachi',
    'Karachi Expo Centre, University Road',
    '2025-11-10',
    '2025-11-13',
    80000,
    v_organizer_id,
    'approved',
    'Education & Literature',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
    NOW() - INTERVAL '11 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Publisher Stall', 25000, '8x8 ft', ARRAY['Bookshelf Display', '2 Passes', 'Event Listing']),
    (v_event_id, 'Premium Publisher', 60000, '15x12 ft', ARRAY['Author Signing Table', '4 Passes', 'Premium Floor Location', 'PA Announcements']),
    (v_event_id, 'Education Partner', 200000, '20x20 ft', ARRAY['Workshop Room Access', '8 VIP Passes', 'Logo on Bags', 'Full Social Media Campaign']);

  -- ============================================================
  -- EVENT 12: Peshawar Cultural Mela 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Peshawar Cultural Mela 2025',
    'Celebrating the rich Pashtun heritage — traditional music (Rabab), Attan dance performances, handicraft exhibitions, Peshawari cuisine stalls, calligraphy workshops, and gem & jewellery marketplace. Featuring artisans from across KPK, tribal areas, and Afghanistan. A vibrant cultural exchange experience.',
    'Peshawar',
    'Nishtar Hall & Bala Hisar Fort, Peshawar',
    '2025-10-05',
    '2025-10-07',
    18000,
    v_organizer_id,
    'approved',
    'Culture & Heritage',
    'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&q=80',
    NOW() - INTERVAL '12 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Artisan Stall', 15000, '8x6 ft', ARRAY['Display Table', '2 Passes', 'Event Listing']),
    (v_event_id, 'Handicraft Pavilion', 45000, '15x12 ft', ARRAY['Live Demo Area', '4 Passes', 'Photography Coverage', 'Premium Location']),
    (v_event_id, 'Heritage Partner', 150000, '20x20 ft', ARRAY['Stage Sponsorship', 'Cultural Award Naming', '8 VIP Passes', 'Full Media Coverage']);

  -- ============================================================
  -- EVENT 13: Pakistan Property Expo 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Pakistan Property Expo 2025',
    'The biggest real estate exhibition in Pakistan — featuring top developers like Bahria Town, DHA, Capital Smart City, Blue World City, and 100+ builders. Plot bookings, apartment launches, overseas Pakistani investment opportunities, mortgage consultations, and smart home technology showcases.',
    'Lahore',
    'International Expo Centre, Johar Town, Lahore',
    '2025-12-12',
    '2025-12-14',
    35000,
    v_organizer_id,
    'approved',
    'Real Estate',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    NOW() - INTERVAL '13 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Developer Booth', 60000, '12x10 ft', ARRAY['Model Display Area', '4 Passes', 'LED Screen', 'Brochure Distribution']),
    (v_event_id, 'Premium Developer', 200000, '25x20 ft', ARRAY['Scale Model Platform', '8 Passes', 'VIP Lounge', 'PA Announcements', 'Social Media Feature']),
    (v_event_id, 'Platinum Exhibitor', 500000, '40x30 ft', ARRAY['Grand Entrance Branding', 'Keynote Slot', '15 VIP Passes', 'Helicopter Tour Prize Sponsorship']);

  -- ============================================================
  -- EVENT 14: Lahore Startup Weekend 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Lahore Startup Weekend 2025',
    'A 54-hour hackathon-style event where aspiring entrepreneurs build startups from scratch. Mentorship from successful founders like Monis Rahman (Rozee.pk), Kalsoom Lakhani (i2i Ventures), and top VCs. Categories include EdTech, HealthTech, FinTech, and Social Impact. Top 3 startups win seed funding of PKR 3M each.',
    'Lahore',
    'LUMS Centre for Entrepreneurship, DHA',
    '2025-09-19',
    '2025-09-21',
    3000,
    v_organizer_id,
    'approved',
    'Technology',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    NOW() - INTERVAL '14 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Mentor Booth', 25000, '8x6 ft', ARRAY['Brand Display', '2 Passes', 'Mentorship Session Slot']),
    (v_event_id, 'Innovation Sponsor', 150000, '15x12 ft', ARRAY['Category Naming Rights', '6 VIP Passes', 'Judge Panel Seat', 'Logo on Certificates', 'Social Media Campaign']);

  -- ============================================================
  -- EVENT 15: Karachi Kids Carnival 2025
  -- ============================================================
  INSERT INTO events (title, description, city, venue, start_date, end_date, expected_visitors, organizer_id, status, category, image_url, created_at)
  VALUES (
    'Karachi Kids Carnival 2025',
    'The ultimate family fun event — carnival rides, magic shows, puppet theatre, face painting, science experiments, and educational workshops for kids aged 3-14. Character meet-and-greets, balloon artists, treasure hunts, and a dedicated baby care zone. Over 80 entertainment and educational stalls.',
    'Karachi',
    'PAF Museum & Amusement Park, Shahrah-e-Faisal',
    '2025-12-25',
    '2025-12-27',
    45000,
    v_organizer_id,
    'approved',
    'Family & Entertainment',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    NOW() - INTERVAL '15 days'
  ) RETURNING id INTO v_event_id;

  INSERT INTO stall_packages (event_id, name, price, size, perks) VALUES
    (v_event_id, 'Activity Stall', 20000, '8x8 ft', ARRAY['Table & Chairs', '2 Passes', 'Event Listing', 'Balloon Decoration']),
    (v_event_id, 'Fun Zone Sponsor', 100000, '20x15 ft', ARRAY['Zone Naming', 'Character Mascot Slot', '6 Passes', 'PA Shoutouts', 'Social Media Promotion']),
    (v_event_id, 'Carnival Title Partner', 400000, '30x25 ft', ARRAY['Gate Branding', 'All Wristband Branding', '15 VIP Passes', 'Main Stage Sponsorship', 'Exclusive Media Coverage']);

  RAISE NOTICE '✅ Successfully seeded 15 events with stall packages for organizer %', v_organizer_id;

END $$;
