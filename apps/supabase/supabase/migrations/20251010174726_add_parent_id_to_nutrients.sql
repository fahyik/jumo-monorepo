-- Add parent_id column to nutrients table for hierarchical nutrient relationships
-- Examples: saturated_fat is a child of fat, sugar is a child of carbohydrate
ALTER TABLE jumo.nutrients
ADD COLUMN parent_id TEXT NULL REFERENCES jumo.nutrients(id) ON DELETE CASCADE;

-- Create index for efficient parent lookups
CREATE INDEX idx_nutrients_parent_id ON jumo.nutrients(parent_id);

-- Add comment to explain the column
COMMENT ON COLUMN jumo.nutrients.parent_id IS 'References parent nutrient for hierarchical relationships (e.g., saturated_fat -> fat)';
