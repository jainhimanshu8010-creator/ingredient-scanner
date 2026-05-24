/*
  # Add health metrics to products

  1. Modified Tables
    - `products` - Added health metric columns for age-group based evaluation
      - `sugar_content` (numeric): grams per serving
      - `caffeine_level` (text): none, low, medium, high
      - `health_category` (text): tea, juice, supplement, drink mix, beverage
      - `suitable_for_ages` (text[]): array of age groups (student, adult, senior, child)
      - `health_score` (integer): 1-100 score based on nutritional value
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sugar_content'
  ) THEN
    ALTER TABLE products ADD COLUMN sugar_content numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'caffeine_level'
  ) THEN
    ALTER TABLE products ADD COLUMN caffeine_level text DEFAULT 'low' CHECK (caffeine_level IN ('none', 'low', 'medium', 'high'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'health_category'
  ) THEN
    ALTER TABLE products ADD COLUMN health_category text DEFAULT 'beverage';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'health_score'
  ) THEN
    ALTER TABLE products ADD COLUMN health_score integer DEFAULT 50 CHECK (health_score >= 1 AND health_score <= 100);
  END IF;
END $$;
