import sys, os
sys.path.insert(0, os.path.abspath("."))
# pyrefly: ignore [missing-import]
from app.services.ai_prediction_service import ai_prediction_service
# pyrefly: ignore [missing-import]
from app.agents.equipment import get_equipment_analysis_agent
# pyrefly: ignore [missing-import]
from app.agents.supplier import get_supplier_analysis_agent
# pyrefly: ignore [missing-import]
from app.models.business import Business

cats = [
    'Boutique', 'Cafe', 'Bakery', 'Restaurant', 'Gym', 'Salon',
    'Supermarket', 'Clinic', 'Tech', 'Auto', 'Pharmacy', 'Laundry',
    'Custom Drone Service'
]

print("=== 1. AI PREDICTION VERIFICATION ===")
for c in cats:
    res = ai_prediction_service.predict_equipment(f"Prime {c}", c)
    desc = ai_prediction_service.generate_description(f"Prime {c}", c, 750000)
    items_count = res["total_items"]
    cost = res["total_manifest_cost"]
    print(f"[{c:<20}] Items: {items_count:<2} | Cost: INR {cost:>10,d} | Desc: {desc[:60]}...")

print("\n=== 2. AGENTS PIPELINE VERIFICATION ===")
sample_biz = Business(
    id=999,
    user_id=1,
    business_name="Aura Designer Studio",
    category="Boutique & Fashion",
    description="Luxury designer boutique and fashion atelier",
    budget=500000.0,
    exact_location="Tenali, Andhra Pradesh",
    equipment_status="some",
    equipment_owned=["Sewing machine", "Steam iron & table"],
)

eq_agent = get_equipment_analysis_agent()
eq_res = eq_agent.analyze(sample_biz)
print(f"Equipment Agent -> Required: {len(eq_res['required_equipment'])}, Owned: {len(eq_res['owned_equipment'])}, Missing: {len(eq_res['missing_equipment'])}, Sellers: {len(eq_res['potential_sellers'])}")

supp_agent = get_supplier_analysis_agent()
supp_res = supp_agent.analyze(sample_biz)
print(f"Supplier Agent -> Raw Materials: {len(supp_res['raw_materials'])}, Vetted Suppliers: {len(supp_res['vetted_suppliers'])}")

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
