/*
  # Insert product batch

  1. New Data
    - Inserting 25 products with barcodes, names, brands, and prices
    - Products include: Himalaya teas, Kissan juices, AVT tea, Maa juice, Cadbury TANG drinks, and Dabur beverages
*/

INSERT INTO products (barcode, name, brand, price) VALUES
('8901138514983', 'HIMALAYA KOF TEA 2×10GM', 'Himalaya', 95.00),
('8901138514976', 'HIMALAYA DIGES TEA 2×10GM', 'Himalaya', 95.00),
('8901138815264', 'HIMALAYA GREEN TEA 2×10GM', 'Himalaya', 49.00),
('8901138515102', 'HIMALAYA LAXA TEA 2×10GM', 'Himalaya', 95.00),
('8901138815295', 'HIMALAYA LEAN TEA 2×10GM', 'Himalaya', 95.00),
('8901138815271', 'HIMALAYA SLEEP TEA 2×10GM', 'Himalaya', 95.00),
('8901138815288', 'HIMALAYA STRESS TEA 2×10GM', 'Himalaya', 95.00),
('8901030329562', 'KISSAN APPLE JUICE & SOYA 1L', 'Kissan', 90.00),
('8901030329579', 'KISSAN MANGO JUICE & SOYA 1L', 'Kissan', 90.00),
('8901030329555', 'KISSAN ORANGE JUICE & SOYA 1L', 'Kissan', 90.00),
('8901030329593', 'KISSAN ORIGINAL SOYA MILK 1L', 'Kissan', 95.00),
('8902042212620', 'AVT Premium CTC Dust Tea 44g', 'AVT', 10.00),
('8902153686266', 'Maa Apple Tetra 200ml', 'Maa', 12.00),
('8901233007007', 'Cadbury TANG Lemon Flavor Drink 19g', 'Cadbury', 4.00),
('8901233006932', 'Cadbury TANG Lemon Flavor Drink 200g', 'Cadbury', 35.00),
('8901233006949', 'Cadbury TANG Orange Flavor Drink 19g', 'Cadbury', 4.00),
('8901233006963', 'Cadbury TANG Orange Flavor Drink 200g', 'Cadbury', 35.00),
('8901233006956', 'Cadbury TANG Orange Flavor Drink 500g', 'Cadbury', 80.00),
('8901233007168', 'Cadbury TANG Orange Flavor Drink 750g', 'Cadbury', 115.00),
('8901207001413', 'DABUR GLUCOSE-D 200GM', 'Dabur', 42.00),
('8901888000064', 'DABUR LEMONEEZ 250M', 'Dabur', 30.00),
('8901888003027', 'Dabur REAL Active Fiber Multi Fruit 1L', 'Dabur', 90.00),
('8901888003010', 'Dabur REAL Active Fiber Orange Citrus 1L', 'Dabur', 90.00),
('8901207012495', 'Dabur REAL Burrst Apple Fizz 500ml', 'Dabur', 28.00),
('8901207012501', 'Dabur REAL Burrst Limon Fizz 500ml', 'Dabur', 28.00)
ON CONFLICT (barcode) DO NOTHING;
