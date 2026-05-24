/*
  # Update products with health metrics

  1. Data Updates
    - Added sugar content, caffeine levels, and health scores for all products
    - Scores based on nutritional value, added sugars, and caffeine content
*/

UPDATE products SET sugar_content = 0, caffeine_level = 'high', health_category = 'tea', health_score = 85 WHERE barcode = '8901138514983'; -- KOF Tea
UPDATE products SET sugar_content = 0, caffeine_level = 'high', health_category = 'tea', health_score = 82 WHERE barcode = '8901138514976'; -- DIGES Tea
UPDATE products SET sugar_content = 0, caffeine_level = 'medium', health_category = 'tea', health_score = 90 WHERE barcode = '8901138815264'; -- GREEN Tea
UPDATE products SET sugar_content = 0, caffeine_level = 'high', health_category = 'tea', health_score = 80 WHERE barcode = '8901138515102'; -- LAXA Tea
UPDATE products SET sugar_content = 0, caffeine_level = 'medium', health_category = 'tea', health_score = 88 WHERE barcode = '8901138815295'; -- LEAN Tea
UPDATE products SET sugar_content = 0, caffeine_level = 'high', health_category = 'tea', health_score = 83 WHERE barcode = '8901138815271'; -- SLEEP Tea
UPDATE products SET sugar_content = 0, caffeine_level = 'high', health_category = 'tea', health_score = 84 WHERE barcode = '8901138815288'; -- STRESS Tea
UPDATE products SET sugar_content = 8, caffeine_level = 'none', health_category = 'juice', health_score = 75 WHERE barcode = '8901030329562'; -- KISSAN Apple Juice
UPDATE products SET sugar_content = 9, caffeine_level = 'none', health_category = 'juice', health_score = 74 WHERE barcode = '8901030329579'; -- KISSAN Mango Juice
UPDATE products SET sugar_content = 7, caffeine_level = 'none', health_category = 'juice', health_score = 76 WHERE barcode = '8901030329555'; -- KISSAN Orange Juice
UPDATE products SET sugar_content = 2, caffeine_level = 'none', health_category = 'beverage', health_score = 92 WHERE barcode = '8901030329593'; -- KISSAN Soya Milk
UPDATE products SET sugar_content = 0, caffeine_level = 'high', health_category = 'tea', health_score = 87 WHERE barcode = '8902042212620'; -- AVT Tea
UPDATE products SET sugar_content = 10, caffeine_level = 'none', health_category = 'juice', health_score = 72 WHERE barcode = '8902153686266'; -- Maa Apple
UPDATE products SET sugar_content = 15, caffeine_level = 'none', health_category = 'drink_mix', health_score = 45 WHERE barcode = '8901233007007'; -- TANG Lemon 19g
UPDATE products SET sugar_content = 180, caffeine_level = 'none', health_category = 'drink_mix', health_score = 40 WHERE barcode = '8901233006932'; -- TANG Lemon 200g
UPDATE products SET sugar_content = 15, caffeine_level = 'none', health_category = 'drink_mix', health_score = 45 WHERE barcode = '8901233006949'; -- TANG Orange 19g
UPDATE products SET sugar_content = 180, caffeine_level = 'none', health_category = 'drink_mix', health_score = 40 WHERE barcode = '8901233006963'; -- TANG Orange 200g
UPDATE products SET sugar_content = 450, caffeine_level = 'none', health_category = 'drink_mix', health_score = 35 WHERE barcode = '8901233006956'; -- TANG Orange 500g
UPDATE products SET sugar_content = 675, caffeine_level = 'none', health_category = 'drink_mix', health_score = 30 WHERE barcode = '8901233007168'; -- TANG Orange 750g
UPDATE products SET sugar_content = 150, caffeine_level = 'none', health_category = 'supplement', health_score = 78 WHERE barcode = '8901207001413'; -- GLUCOSE-D
UPDATE products SET sugar_content = 30, caffeine_level = 'none', health_category = 'beverage', health_score = 88 WHERE barcode = '8901888000064'; -- LEMONEEZ
UPDATE products SET sugar_content = 12, caffeine_level = 'none', health_category = 'juice', health_score = 80 WHERE barcode = '8901888003027'; -- REAL Fiber Multi Fruit
UPDATE products SET sugar_content = 11, caffeine_level = 'none', health_category = 'juice', health_score = 81 WHERE barcode = '8901888003010'; -- REAL Fiber Orange
UPDATE products SET sugar_content = 8, caffeine_level = 'none', health_category = 'beverage', health_score = 50 WHERE barcode = '8901207012495'; -- REAL Burrst Apple
UPDATE products SET sugar_content = 8, caffeine_level = 'none', health_category = 'beverage', health_score = 50 WHERE barcode = '8901207012501'; -- REAL Burrst Limon
