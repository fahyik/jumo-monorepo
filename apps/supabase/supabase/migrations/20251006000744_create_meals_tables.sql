CREATE SCHEMA IF NOT EXISTS jumo;
ALTER SCHEMA "jumo" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "jumo" TO "anon";
GRANT USAGE ON SCHEMA "jumo" TO "authenticated";
GRANT USAGE ON SCHEMA "jumo" TO "service_role";

CREATE TABLE IF NOT EXISTS jumo.nutrients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL,
  translation_key TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jumo.provider_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  raw_data JSONB NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

CREATE TABLE IF NOT EXISTS jumo.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  name TEXT,
  notes TEXT,
  consumed_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jumo.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  meal_id UUID NOT NULL REFERENCES jumo.meals(id) ON DELETE RESTRICT,
  provider_food_id UUID NOT NULL REFERENCES jumo.provider_foods(id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jumo.meal_items_nutrients (
  meal_item_id UUID NOT NULL REFERENCES jumo.meal_items(id) ON DELETE CASCADE,
  nutrient_id TEXT NOT NULL REFERENCES jumo.nutrients(id) ON DELETE RESTRICT,
  amount NUMERIC NOT NULL,
  PRIMARY KEY (meal_item_id, nutrient_id)
);

CREATE INDEX idx_meals_user_id ON jumo.meals(user_id);
CREATE INDEX idx_meals_consumed_at ON jumo.meals(consumed_at);
CREATE INDEX idx_meals_deleted_at ON jumo.meals(deleted_at);
CREATE INDEX idx_meal_items_user_id ON jumo.meal_items(user_id);
CREATE INDEX idx_meal_items_meal_id ON jumo.meal_items(meal_id);
CREATE INDEX idx_meal_items_provider_food_id ON jumo.meal_items(provider_food_id);
CREATE INDEX idx_meal_items_deleted_at ON jumo.meal_items(deleted_at);
CREATE INDEX idx_provider_foods_provider ON jumo.provider_foods(provider);
CREATE INDEX idx_meal_items_nutrients_meal_item_id ON jumo.meal_items_nutrients(meal_item_id);
CREATE INDEX idx_meal_items_nutrients_nutrient_id ON jumo.meal_items_nutrients(nutrient_id);

CREATE OR REPLACE FUNCTION jumo.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nutrients_updated_at BEFORE UPDATE ON jumo.nutrients
  FOR EACH ROW EXECUTE FUNCTION jumo.update_updated_at_column();

CREATE TRIGGER update_provider_foods_updated_at BEFORE UPDATE ON jumo.provider_foods
  FOR EACH ROW EXECUTE FUNCTION jumo.update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON jumo.meals
  FOR EACH ROW EXECUTE FUNCTION jumo.update_updated_at_column();

CREATE TRIGGER update_meal_items_updated_at BEFORE UPDATE ON jumo.meal_items
  FOR EACH ROW EXECUTE FUNCTION jumo.update_updated_at_column();

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "jumo" GRANT ALL ON TABLES TO "service_role";
