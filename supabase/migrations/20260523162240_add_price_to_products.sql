/*
  # Add price column to products table

  1. Modified Tables
    - `products` - Added `price` column (numeric, optional) to store product pricing
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'price'
  ) THEN
    ALTER TABLE products ADD COLUMN price numeric;
  END IF;
END $$;
