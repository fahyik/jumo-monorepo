-- Insert base nutrients first
INSERT INTO jumo.nutrients (id, name, unit, parent_id) VALUES
  ('energy', 'Energy', 'kcal', NULL),
  ('carbohydrate', 'Carbohydrates', 'g', NULL),
  ('protein', 'Proteins', 'g', NULL),
  ('fat', 'Fats', 'g', NULL),
  ('alcohol', 'Alcohol', 'g', NULL),
  ('salt', 'Salt', 'g', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert child nutrients
INSERT INTO jumo.nutrients (id, name, unit, parent_id) VALUES
  ('sugar', 'Sugars', 'g', 'carbohydrate'),
  ('fiber', 'Fiber', 'g', 'carbohydrate'),
  ('saturated_fat', 'Saturated Fat', 'g', 'fat'),
  ('sodium', 'Sodium', 'mg', 'salt')
ON CONFLICT (id) DO NOTHING;
