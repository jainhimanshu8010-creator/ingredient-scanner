/*
  # Create Products and Ingredients Tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for the product
      - `barcode` (text, unique, not null) - Product barcode (UPC/EAN)
      - `name` (text, not null) - Product name
      - `brand` (text) - Brand name
      - `image_url` (text) - Product image URL
      - `created_at` (timestamptz) - Creation timestamp
    
    - `ingredients`
      - `id` (uuid, primary key) - Unique identifier
      - `product_id` (uuid, foreign key) - Reference to product
      - `name` (text, not null) - Ingredient name
      - `quantity_tablespoons` (decimal, not null) - Quantity in tablespoons
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (products are public information)
    - No write access for anonymous users
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode text UNIQUE NOT NULL,
  name text NOT NULL,
  brand text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity_tablespoons decimal NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_ingredients_product_id ON ingredients(product_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view ingredients"
  ON ingredients FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ingredients"
  ON ingredients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ingredients"
  ON ingredients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ingredients"
  ON ingredients FOR DELETE
  TO authenticated
  USING (true);