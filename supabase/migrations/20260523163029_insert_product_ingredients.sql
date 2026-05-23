/*
  # Insert product ingredients

  1. New Data
    - Adding detailed ingredients for all 25 products
    - Includes tea blends, juice compositions, and beverage ingredients
*/

INSERT INTO ingredients (product_id, name, quantity_tablespoons, order_index)
SELECT p.id, ingredient_name, quantity, idx FROM (
  VALUES
  -- Himalaya KOF TEA (8901138514983)
  ('8901138514983', 'Herbs (Tulsi, Ginger, Honey)', 1, 1),
  ('8901138514983', 'Spices (Clove, Cinnamon)', 1, 2),
  ('8901138514983', 'Licorice Root', 0.5, 3),
  
  -- Himalaya DIGES TEA (8901138514976)
  ('8901138514976', 'Herbs (Fennel, Fenugreek)', 1, 1),
  ('8901138514976', 'Ginger Root', 0.75, 2),
  ('8901138514976', 'Cardamom', 0.5, 3),
  ('8901138514976', 'Black Cumin Seeds', 0.25, 4),
  
  -- Himalaya GREEN TEA (8901138815264)
  ('8901138815264', 'Green Tea Leaves', 2, 1),
  ('8901138815264', 'Natural Green Tea Flavor', 0.5, 2),
  ('8901138815264', 'Antioxidants', 0.25, 3),
  
  -- Himalaya LAXA TEA (8901138515102)
  ('8901138515102', 'Senna Leaves', 1, 1),
  ('8901138515102', 'Fennel Seeds', 1, 2),
  ('8901138515102', 'Ginger', 0.75, 3),
  ('8901138515102', 'Licorice', 0.5, 4),
  
  -- Himalaya LEAN TEA (8901138815295)
  ('8901138815295', 'Green Tea Extract', 2, 1),
  ('8901138815295', 'Garcinia Cambogia', 1, 2),
  ('8901138815295', 'Ginger Extract', 0.75, 3),
  
  -- Himalaya SLEEP TEA (8901138815271)
  ('8901138815271', 'Ashwagandha', 1, 1),
  ('8901138815271', 'Brahmi', 1, 2),
  ('8901138815271', 'Jatamansi', 0.75, 3),
  ('8901138815271', 'Licorice Root', 0.5, 4),
  
  -- Himalaya STRESS TEA (8901138815288)
  ('8901138815288', 'Ashwagandha Root', 1.5, 1),
  ('8901138815288', 'Brahmi', 1, 2),
  ('8901138815288', 'Holy Basil (Tulsi)', 1, 3),
  ('8901138815288', 'Licorice', 0.5, 4),
  
  -- KISSAN APPLE JUICE & SOYA (8901030329562)
  ('8901030329562', 'Apple Juice Concentrate', 30, 1),
  ('8901030329562', 'Soy Extract', 20, 2),
  ('8901030329562', 'Water', 50, 3),
  ('8901030329562', 'Natural Flavoring', 0.5, 4),
  ('8901030329562', 'Vitamin Fortification', 0.25, 5),
  
  -- KISSAN MANGO JUICE & SOYA (8901030329579)
  ('8901030329579', 'Mango Juice Concentrate', 30, 1),
  ('8901030329579', 'Soy Extract', 20, 2),
  ('8901030329579', 'Water', 50, 3),
  ('8901030329579', 'Natural Mango Flavoring', 0.5, 4),
  
  -- KISSAN ORANGE JUICE & SOYA (8901030329555)
  ('8901030329555', 'Orange Juice Concentrate', 30, 1),
  ('8901030329555', 'Soy Extract', 20, 2),
  ('8901030329555', 'Water', 50, 3),
  ('8901030329555', 'Vitamin C', 0.5, 4),
  
  -- KISSAN ORIGINAL SOYA MILK (8901030329593)
  ('8901030329593', 'Soy Bean Extract', 40, 1),
  ('8901030329593', 'Water', 58, 2),
  ('8901030329593', 'Calcium', 1, 3),
  ('8901030329593', 'Vitamin D & B12', 0.25, 4),
  ('8901030329593', 'Natural Flavor', 0.5, 5),
  
  -- AVT Premium CTC Dust Tea (8902042212620)
  ('8902042212620', 'CTC Tea Leaves', 100, 1),
  
  -- Maa Apple Tetra (8902153686266)
  ('8902153686266', 'Apple Juice', 95, 1),
  ('8902153686266', 'Water', 4, 2),
  ('8902153686266', 'Natural Flavoring', 1, 3),
  
  -- Cadbury TANG Lemon 19g (8901233007007)
  ('8901233007007', 'Sugar', 15, 1),
  ('8901233007007', 'Citric Acid', 2, 2),
  ('8901233007007', 'Lemon Flavor', 1.5, 3),
  ('8901233007007', 'Vitamin C', 0.5, 4),
  
  -- Cadbury TANG Lemon 200g (8901233006932)
  ('8901233006932', 'Sugar', 180, 1),
  ('8901233006932', 'Citric Acid', 20, 2),
  ('8901233006932', 'Lemon Flavor', 15, 3),
  ('8901233006932', 'Vitamin C', 5, 4),
  
  -- Cadbury TANG Orange 19g (8901233006949)
  ('8901233006949', 'Sugar', 15, 1),
  ('8901233006949', 'Citric Acid', 2, 2),
  ('8901233006949', 'Orange Flavor', 1.5, 3),
  ('8901233006949', 'Vitamin C', 0.5, 4),
  
  -- Cadbury TANG Orange 200g (8901233006963)
  ('8901233006963', 'Sugar', 180, 1),
  ('8901233006963', 'Citric Acid', 20, 2),
  ('8901233006963', 'Orange Flavor', 15, 3),
  ('8901233006963', 'Vitamin C', 5, 4),
  
  -- Cadbury TANG Orange 500g (8901233006956)
  ('8901233006956', 'Sugar', 450, 1),
  ('8901233006956', 'Citric Acid', 50, 2),
  ('8901233006956', 'Orange Flavor', 37.5, 3),
  ('8901233006956', 'Vitamin C', 12.5, 4),
  
  -- Cadbury TANG Orange 750g (8901233007168)
  ('8901233007168', 'Sugar', 675, 1),
  ('8901233007168', 'Citric Acid', 75, 2),
  ('8901233007168', 'Orange Flavor', 56.25, 3),
  ('8901233007168', 'Vitamin C', 18.75, 4),
  
  -- DABUR GLUCOSE-D 200GM (8901207001413)
  ('8901207001413', 'Glucose (Dextrose)', 150, 1),
  ('8901207001413', 'Maltodextrin', 40, 2),
  ('8901207001413', 'Vitamins (B Complex)', 5, 3),
  ('8901207001413', 'Minerals', 5, 4),
  
  -- DABUR LEMONEEZ 250M (8901888000064)
  ('8901888000064', 'Lemon Juice', 40, 1),
  ('8901888000064', 'Honey', 30, 2),
  ('8901888000064', 'Water', 200, 3),
  ('8901888000064', 'Ginger Extract', 1, 4),
  
  -- Dabur REAL Active Fiber Multi Fruit (8901888003027)
  ('8901888003027', 'Fruit Juice Concentrate', 40, 1),
  ('8901888003027', 'Fiber (Inulin)', 5, 2),
  ('8901888003027', 'Water', 50, 3),
  ('8901888003027', 'Vitamins & Minerals', 5, 4),
  
  -- Dabur REAL Active Fiber Orange Citrus (8901888003010)
  ('8901888003010', 'Orange Juice Concentrate', 40, 1),
  ('8901888003010', 'Fiber (Inulin)', 5, 2),
  ('8901888003010', 'Water', 50, 3),
  ('8901888003010', 'Vitamin C', 5, 4),
  
  -- Dabur REAL Burrst Apple Fizz (8901207012495)
  ('8901207012495', 'Apple Juice', 35, 1),
  ('8901207012495', 'Carbonated Water', 60, 2),
  ('8901207012495', 'Sugar', 5, 3),
  ('8901207012495', 'Natural Apple Flavor', 1, 4),
  
  -- Dabur REAL Burrst Limon Fizz (8901207012501)
  ('8901207012501', 'Lemon Juice', 35, 1),
  ('8901207012501', 'Carbonated Water', 60, 2),
  ('8901207012501', 'Sugar', 5, 3),
  ('8901207012501', 'Lemon Flavor', 1, 4)
) AS t(barcode, ingredient_name, quantity, idx)
JOIN products p ON p.barcode = t.barcode;
