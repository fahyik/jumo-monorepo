INSERT INTO jumo.nutrients (id, name, unit) VALUES
  ('energy', 'Energy', 'kcal'),
  ('carbohydrate', 'Carbohydrates', 'g'),
  ('protein', 'Proteins', 'g'),
  ('fat', 'Fats', 'g')
ON CONFLICT (id) DO NOTHING;
