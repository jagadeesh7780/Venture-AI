# Business + Equipment Dataset

Curated dataset for AI Business Feasibility, Launch Planning, and Equipment Intelligence.

## Files
1. **`businesses.csv`**
   - 500 business types (B0001 to B0500)
   - 20 Themes (Technology / Startup, Healthcare, Food, Fashion, Real Estate, Education, Transportation, Finance, Retail, Manufacturing, Agriculture, Beauty, Fitness, Travel, Automotive, Pet, Professional Services, Entertainment, Energy, Logistics)
   - 100 Categories
   - Fields: `business_id,business_name,theme,category,sub_category`

2. **`business_equipment.csv`**
   - 5,501 curated business-to-equipment mappings (E00001 to E05501)
   - Relationship: `businesses.business_id = business_equipment.business_id`
   - Fields: `equipment_id,business_id,business_name,theme,category,equipment_name,equipment_type,typical_quantity,essential,description`
   - Equipment Types:
     - `Essential Equipment` (Core operational hardware/machinery)
     - `Optional Equipment` (Scale & performance enhancers)
     - `Operational / Safety Equipment` (Fire extinguisher, first aid kit, extension board, surge protector)

## Logic & Strict Constraint
- Based on the user's business input, the system finds the closest matching business from `businesses.csv` and returns its `theme`, `category`, and `business_name`.
- Retrieves all equipment mapped to that business from `business_equipment.csv`.
- Compares mapped equipment against the equipment already available to the user.
- **Strict rule**: Returns ONLY dataset-based results; does not invent or hallucinate information.
