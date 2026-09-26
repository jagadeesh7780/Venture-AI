from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, ConfigDict, field_validator


class BusinessUnderstandingAgentOutput(BaseModel):
    """
    Structured Pydantic schema strictly validating the raw JSON returned
    by the Business Understanding AI Agent (via Ollama / Local LLM).
    """
    business_category: str = Field(
        ...,
        min_length=2,
        description="High-level industry or market domain",
        examples=["Food & Beverage", "Retail", "Healthcare", "Technology"]
    )
    business_subcategory: str = Field(
        ...,
        min_length=2,
        description="Specific sector or niche",
        examples=["Specialty Coffee Shop & Roastery"]
    )
    business_model: str = Field(
        ...,
        min_length=2,
        description="Monetization structure and operational delivery model",
        examples=["Direct-to-Consumer Brick & Mortar + Takeaway"]
    )
    target_customers: List[str] = Field(
        default_factory=list,
        description="Identified primary and secondary customer archetypes",
        examples=[["Remote workers", "University students", "Local neighborhood residents"]]
    )
    products_or_services: List[str] = Field(
        default_factory=list,
        description="List of primary goods, offerings, or services",
        examples=[["Espresso-based beverages", "Fresh pastries", "Packaged single-origin beans"]]
    )
    required_resources: List[str] = Field(
        default_factory=list,
        description="Core physical, human, and capital equipment required",
        examples=[["Commercial espresso machine", "Baristas", "Commercial lease space"]]
    )
    operational_requirements: List[str] = Field(
        default_factory=list,
        description="Day-to-day workflow, health permits, and supply chain needs",
        examples=[["Food handling safety permits", "Daily bean supply deliveries", "POS accounting"]]
    )
    potential_risks: List[str] = Field(
        default_factory=list,
        description="Initial operational, market, and regulatory risks identified",
        examples=[["High commercial rent burden", "Local competitor saturation", "Supply price fluctuation"]]
    )
    recommended_analysis: List[str] = Field(
        default_factory=list,
        description="Recommended downstream specialized agent analyses",
        examples=[["Location Foot-traffic Analysis", "Competitor Pricing Audit", "Equipment Sourcing"]]
    )

    @field_validator(
        "target_customers",
        "products_or_services",
        "required_resources",
        "operational_requirements",
        "potential_risks",
        "recommended_analysis",
        mode="before"
    )
    @classmethod
    def ensure_list_of_strings(cls, v):
        if isinstance(v, str):
            return [v.strip()] if v.strip() else []
        if isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        return []

    @field_validator("business_category", "business_subcategory", "business_model")
    @classmethod
    def sanitize_strings(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            return "General Commercial Venture"
        return trimmed


class BusinessAnalysisResponse(BusinessUnderstandingAgentOutput):
    """
    Response schema returned to the frontend representing the persisted analysis.
    """
    id: int
    business_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
