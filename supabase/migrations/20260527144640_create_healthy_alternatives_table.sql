/*
  # Create Healthy Alternatives Table

  1. New Tables
    - `healthy_alternatives`
      - `id` (uuid, primary key)
      - `unhealthy_product_category` (text) - category of unhealthy product (e.g., 'beverage', 'snack')
      - `alternative_product_name` (text) - name of the healthy alternative
      - `alternative_brand` (text, nullable) - brand of the alternative (optional)
      - `alternative_image_url` (text, nullable) - image of the alternative (optional)
      - `health_score` (integer) - health score of alternative (1-100)
      - `sugar_content` (numeric) - sugar content in grams
      - `caffeine_level` (text) - caffeine level (none, low, medium, high)
      - `benefits` (text) - JSON array of health benefits
      - `suitable_for_ages` (text) - JSON array of suitable age groups
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `healthy_alternatives` table
    - Add policy for all users to read healthy alternatives (public data)
  
  3. Sample Data
    - Insert healthy alternatives for common product categories
*/

CREATE TABLE IF NOT EXISTS healthy_alternatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unhealthy_product_category text NOT NULL,
  alternative_product_name text NOT NULL,
  alternative_brand text,
  alternative_image_url text,
  health_score integer NOT NULL DEFAULT 75 CHECK (health_score >= 1 AND health_score <= 100),
  sugar_content numeric DEFAULT 0,
  caffeine_level text DEFAULT 'none' CHECK (caffeine_level = ANY (ARRAY['none'::text, 'low'::text, 'medium'::text, 'high'::text])),
  benefits jsonb DEFAULT '[]'::jsonb,
  suitable_for_ages jsonb DEFAULT '["child", "student", "adult", "senior"]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE healthy_alternatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read healthy alternatives"
  ON healthy_alternatives
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert healthy alternatives for various categories
INSERT INTO healthy_alternatives (unhealthy_product_category, alternative_product_name, alternative_brand, alternative_image_url, health_score, sugar_content, caffeine_level, benefits, suitable_for_ages)
VALUES
  -- Beverages alternatives
  ('beverage', 'Fresh Coconut Water', 'Natural', 'https://images.pexels.com/photos/1453565/pexels-photo-1453565.jpeg?w=400', 95, 6, 'none', '["Natural electrolytes", "Rich in potassium", "Low calorie", "Hydrating", "No artificial additives"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('beverage', 'Green Tea', 'Organic', 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?w=400', 88, 0, 'low', '["Antioxidants", "Boosts metabolism", "Heart health", "Brain function", "Natural weight management"]'::jsonb, '["student", "adult", "senior"]'::jsonb),
  
  ('beverage', 'Fresh Vegetable Juice', 'Home-made', 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?w=400', 92, 8, 'none', '["Rich in vitamins", "Natural fiber", "Low sugar", "Boosts immunity", "Detoxifying"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('beverage', 'Buttermilk / Lassi', 'Traditional', 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?w=400', 90, 5, 'none', '["Probiotics", "Aids digestion", "Calcium rich", "Cooling effect", "Protein source"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('beverage', 'Infused Water', 'Natural', 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?w=400', 98, 0, 'none', '["Zero calories", "Hydrating", "Natural flavors", "Vitamin infusion", "No additives"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Snack alternatives
  ('snack', 'Mixed Nuts', 'Organic', 'https://images.pexels.com/photos/1295539/pexels-photo-1295539.jpeg?w=400', 91, 4, 'none', '["Healthy fats", "Protein rich", "Heart healthy", "Energy boost", "Brain function"]'::jsonb, '["student", "adult", "senior"]'::jsonb),
  
  ('snack', 'Fresh Fruit Bowl', 'Natural', 'https://images.pexels.com/photos2294471/pexels-photo-2294471.jpeg?w=400', 95, 15, 'none', '["Natural vitamins", "Fiber rich", "Antioxidants", "Energy boost", "Immune support"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('snack', 'Greek Yogurt with Berries', 'Natural', 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?w=400', 93, 9, 'none', '["Protein rich", "Probiotics", "Calcium", "Antioxidants", "Gut health"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('snack', 'Roasted Chickpeas', 'Homemade', 'https://images.pexels.com/photos/2679248/pexels-photo-2679248.jpeg?w=400', 89, 3, 'none', '["Protein rich", "High fiber", "Sustained energy", "Heart healthy", "Low calorie"]'::jsonb, '["student", "adult", "senior"]'::jsonb),

  -- Junk food alternatives
  ('junk', 'Whole Grain Crackers', 'Healthy Harvest', 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?w=400', 85, 2, 'none', '["Complex carbs", "Fiber rich", "Sustained energy", "Whole grain benefits"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('junk', 'Air-Popped Popcorn', 'Natural', 'https://images.pexels.com/photos/39519/peanuts-cracked-kernels-roasted-39519.jpeg?w=400', 87, 1, 'none', '["Whole grain", "Low calorie", "High fiber", "No trans fats", "Satisfying crunch"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Sweet alternatives
  ('sweet', 'Dark Chocolate 70%', 'Organic', 'https://images.pexels.com/photos/65828/pexels-photo-65828.jpeg?w=400', 82, 22, 'none', '["Antioxidants", "Less sugar", "Heart healthy", "Brain boost", "Mood enhancer"]'::jsonb, '["adult", "senior"]'::jsonb),
  
  ('sweet', 'Dates with Nuts', 'Natural', 'https://images.pexels.com/photos/1585014/pexels-photo-1585014.jpeg?w=400', 88, 30, 'none', '["Natural sweetness", "Iron rich", "Fiber", "Energy", "No refined sugar"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('sweet', 'Fresh Fruit Smoothie', 'Homemade', 'https://images.pexels.com/photos/2234/food-colorful-smoothie-smoothies.jpg?w=400', 90, 18, 'none', '["Natural vitamins", "Protein optional", "Fiber", "Hydrating", "Customizable"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Energy drink alternatives
  ('energy', 'Banana with Peanut Butter', 'Natural', 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=400', 94, 12, 'none', '["Natural energy", "Potassium", "Protein", "Healthy fats", "Sustained boost"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('energy', 'Oatmeal Energy Bites', 'Homemade', 'https://images.pexels.com/photos/4200819/pexels-photo-4200819.jpeg?w=400', 91, 8, 'none', '["Complex carbs", "Protein", "Fiber", "Natural sweeteners", "Sustained energy"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),

  -- Soft drink alternatives
  ('soft_drink', 'Sparkling Water with Lemon', 'Natural', 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?w=400', 97, 0, 'none', '["Zero calories", "No sugar", "Hydrating", "Refreshing", "No artificial ingredients"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb),
  
  ('soft_drink', 'Fresh Lemonade (Low Sugar)', 'Homemade', 'https://images.pexels.com/photos/96984/pexels-photo-96984.jpeg?w=400', 89, 8, 'none', '["Vitamin C", "Natural", "Hydrating", "Low sugar", "Refreshing"]'::jsonb, '["child", "student", "adult", "senior"]'::jsonb);
