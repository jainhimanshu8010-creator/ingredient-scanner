/*
  # Add More Product-Specific Healthy Alternatives

  1. Purpose
    - Add healthy alternatives for specific products like TANG drink mix
    - Add organic and real product alternatives
    - Link alternatives directly to product barcodes for better matching

  2. New Columns Added
    - `related_product_barcode` (text, nullable) - links alternative to specific product
  
  3. New Data
    - Alternatives for TANG drink mix products
    - Organic alternatives for common unhealthy products
*/

-- Add column to link alternatives to specific products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'healthy_alternatives' AND column_name = 'related_product_barcode'
  ) THEN
    ALTER TABLE healthy_alternatives ADD COLUMN related_product_barcode text;
  END IF;
END $$;

-- Insert organic and healthy alternatives for TANG drink mix
INSERT INTO healthy_alternatives (unhealthy_product_category, related_product_barcode, alternative_product_name, alternative_brand, alternative_image_url, health_score, sugar_content, caffeine_level, benefits, suitable_for_ages)
VALUES
  -- Alternatives for TANG Orange Drink Mix
  ('drink_mix', '8901233007168', 'Fresh Orange Juice (No Added Sugar)', 'Real', 'https://images.pexels.com/photos-1629236/fruits-orange-orange-juice.jpeg?w=400', 95, 0, 'none', '["100% Natural", "Vitamin C Rich", "No Artificial Colors", "Real Fruit", "Immunity Booster"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('drink_mix', '8901233007168', 'Coconut Water with Orange', 'Organic Harvest', 'https://images.pexels.com/photos/1453565/pexels-photo-1453565.jpeg?w=400', 93, 6, 'none', '["Natural Electrolytes", "Low Sugar", "Hydrating", "Organic", "No Preservatives"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('drink_mix', '8901233007168', 'Homemade Nimbu Paani (Lemonade)', 'Home Recipe', 'https://images.pexels.com/photos/96984/pexels-photo-96984.jpeg?w=400', 97, 5, 'none', '["Vitamin C", "Natural Refreshment", "Zero Preservatives", "Traditional Recipe", "Low Calorie"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Alternatives for TANG Lemon Drink Mix
  ('drink_mix', '8901233006932', 'Fresh Lemonade with Honey', 'Organic', 'https://images.pexels.com/photos/96984/pexels-photo-96984.jpeg?w=400', 96, 8, 'none', '["Natural Sweetener", "Vitamin C", "Honey Benefits", "No Artificial Flavors", "Immunity Boost"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('drink_mix', '8901233006932', 'Shikanji (Traditional Lemon Drink)', 'Traditional', 'https://images.pexels.com/photos/96984/pexels-photo-96984.jpeg?w=400', 94, 6, 'none', '["Traditional Recipe", "Black Salt Benefits", "Digestive Aid", "Natural Ingredients", "Refreshing"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Alternatives for Limca and soft drinks
  ('beverage', '8901764052910', 'Fresh Lime Soda', 'Natural', 'https://images.pexels.com/photos/96984/pexels-photo-96984.jpeg?w=400', 96, 3, 'none', '["Zero Preservatives", "Natural Fizz", "Low Sugar Option", "Refreshing", "Digestive"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('beverage', '8901764052910', 'Aam Panna (Raw Mango Drink)', 'Traditional', 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=400', 92, 10, 'none', '["Summer Cooler", "Rich in Vitamins", "Traditional", "Natural Ingredients", "Heat Prevention"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('beverage', '8901764052910', 'Sparkling Water with Lemon', 'Natural', 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?w=400', 98, 0, 'none', '["Zero Calories", "No Sugar", "Hydrating", "Refreshing", "Natural"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Generic healthy alternatives for any unhealthy drink mix
  ('drink_mix', NULL, 'Fresh Fruit Smoothie', 'Homemade', 'https://images.pexels.com/photos/2234/food-colorful-smoothie-smoothies.jpg?w=400', 94, 15, 'none', '["Natural Fruits", "Vitamins", "Fiber Rich", "Customizable", "No Preservatives"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('drink_mix', NULL, 'Aloe Vera Juice', 'Organic', 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?w=400', 91, 5, 'none', '["Digestive Health", "Natural Detox", "Skin Benefits", "Hydrating", "Low Sugar"]'::jsonb, '["adult", "senior"]'::jsonb),
  
  ('drink_mix', NULL, 'Jeera Water (Cumin Water)', 'Traditional', 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?w=400', 98, 0, 'none', '["Zero Calories", "Digestive Aid", "Traditional Remedy", "Metabolism Boost", "No Sugar"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb);
