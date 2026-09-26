from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from app.services.dataset_service import get_dataset_service

router = APIRouter(prefix="/dataset", tags=["Dataset Matching & Equipment"])


class MatchEquipmentRequest(BaseModel):
    business_input: str = Field(
        ...,
        description="The user's business name, category, or description input to match against the dataset",
        examples=["Boutique fashion studio", "Coffee shop with espresso", "Organic vegetable farming"]
    )
    available_equipment: Optional[List[str]] = Field(
        default=[],
        description="List of equipment already available/owned by the user to compare against the dataset mapping",
        examples=[["Sewing machine", "Steam iron"]]
    )
    location: Optional[str] = Field(
        default=None,
        description="Business location or city to discover nearby equipment providers and suppliers",
        examples=["T. Nagar, Chennai", "Indiranagar, Bangalore", "Bandra West, Mumbai"]
    )


class DescriptionRequest(BaseModel):
    category: str = Field(..., description="Business category or industry")
    business_name: Optional[str] = Field(default="", description="Proposed business name")
    budget: Optional[float] = Field(default=0.0, description="Planned investment capital in INR")


@router.post("/generate-description")
def generate_description_endpoint(req: DescriptionRequest):
    """
    Dynamically generates an executive, professional venture description based on
    user category, business name, and budget.
    """
    from app.services.ai_prediction_service import ai_prediction_service
    desc = ai_prediction_service.generate_description(
        business_name=req.business_name or "",
        category=req.category or "Commercial Venture",
        budget=req.budget or 0.0,
    )
    return {"description": desc}


@router.post("/match-equipment")
def match_equipment_endpoint(req: MatchEquipmentRequest):
    """
    Based on the user's business input, dynamically generates the exact tailored
    equipment manifest with operational purposes, compares available vs missing assets,
    and discovers verified nearby equipment providers and wholesale suppliers in that locality.
    """
    from app.services.ai_prediction_service import ai_prediction_service
    service = get_dataset_service()

    # 1. Run dynamic AI equipment prediction
    ai_equip = ai_prediction_service.predict_equipment(
        business_name=req.business_input,
        category=req.business_input,
        available_equipment=req.available_equipment,
    )

    # 2. Match dataset metadata if available
    matched_biz = service.find_closest_business(req.business_input)
    biz_meta = matched_biz if matched_biz else {
        "business_id": "V-AI-001",
        "business_name": req.business_input,
        "theme": ai_equip["detected_theme"],
        "category": ai_equip["category"],
        "sub_category": "Specialized Operations",
        "match_score": 1.0,
    }

    # 3. Find nearby providers and suppliers
    providers_data = ai_prediction_service.search_nearby_providers_and_suppliers(
        location=req.location or "Commercial Area",
        category=biz_meta.get("category", "Commercial"),
        center_lat=16.2377,
        center_lng=80.6464,
    )

    # Format equipment list for comparison schema with dual-compatible keys
    normalized_equipment = []
    for e in ai_equip["equipment"]:
        item_copy = dict(e)
        item_copy["equipment_name"] = e["name"]
        item_copy["equipment_id"] = e.get("id", "EQ-001")
        item_copy["typical_quantity"] = e.get("quantity", 1)
        item_copy["essential"] = "Yes" if e.get("priority") == "Mandatory" else "No"
        item_copy["is_available"] = e.get("status") == "owned"
        normalized_equipment.append(item_copy)

    missing_items = [e for e in normalized_equipment if not e["is_available"]]
    available_items = [e for e in normalized_equipment if e["is_available"]]

    comparison = {
        "total_count": len(normalized_equipment),
        "total_mapped_equipment": len(normalized_equipment),
        "available_count": len(available_items),
        "missing_count": len(missing_items),
        "availability_rate_percentage": ai_equip["availability_rate"],
        "estimated_missing_cost_inr": ai_equip["estimated_total_cost"],
        "total_required_cost_inr": ai_equip["total_manifest_cost"],
        "available_equipment": available_items,
        "missing_equipment": missing_items,
        "all_mapped_equipment": normalized_equipment,
    }

    return {
        "success": True,
        "query_input": req.business_input,
        "matched_business": biz_meta,
        "equipment_comparison": comparison,
        "nearby_providers": providers_data.get("providers", []),
        "nearby_suppliers": providers_data.get("suppliers", []),
        "data_source": "VENTURE AI Dynamic Intelligence Engine & Google Places API (Verified Local POIs)",
    }


@router.get("/businesses")
def get_dataset_businesses(query: Optional[str] = Query(None, description="Search term for business, theme, or category")):
    """
    Browse or search 500 businesses in businesses.csv
    """
    service = get_dataset_service()
    all_biz = service._businesses
    if query and query.strip():
        q = query.strip().lower()
        matched = [
            b for b in all_biz
            if q in b["business_name"].lower() or q in b["category"].lower() or q in b["theme"].lower()
        ]
        return {"total": len(matched), "businesses": matched}
    return {"total": len(all_biz), "businesses": all_biz}


@router.get("/businesses/{business_id}/equipment")
def get_dataset_equipment(business_id: str):
    """
    Retrieve all equipment mapped to a business from business_equipment.csv
    """
    service = get_dataset_service()
    equip = service.get_equipment_for_business(business_id)
    return {
        "business_id": business_id,
        "total_equipment": len(equip),
        "equipment": equip
    }
