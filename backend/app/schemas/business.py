from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict


class EquipmentStatusEnum(str, Enum):
    ALL = "all"
    SOME = "some"
    NONE = "none"


class BusinessBase(BaseModel):
    """
    Base attributes for a Business entity.
    """
    business_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
        description="Name of the business venture",
        examples=["Apex Specialty Coffee & Roastery"]
    )
    category: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Category or industry of the business venture",
        examples=["Boutique & Fashion", "Cafe & Coffee Roastery"]
    )
    description: str = Field(
        ...,
        min_length=10,
        description="Detailed overview of the business idea",
        examples=["Artisanal roastery offering single-origin coffee and a collaborative workspace."]
    )
    budget: Decimal = Field(
        ...,
        gt=0,
        decimal_places=2,
        description="Total startup investment budget in INR (₹) (must be > 0)",
        examples=[500000.00]
    )
    exact_location: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="Exact street address or GPS plot",
        examples=["452 Market Street, Suite 100, San Francisco, CA 94105"]
    )
    nearby_places: Optional[str] = Field(
        None,
        description="Nearby landmark areas, metro stations, and foot-traffic centers",
        examples=["Adjacent to Montgomery Metro, Salesforce Tower, and university district"]
    )
    equipment_status: str = Field(
        ...,
        description="Equipment status: 'all', 'some', or 'none'",
        examples=["some"]
    )
    equipment_owned: Optional[List[str]] = Field(
        default_factory=list,
        description="List of equipment owned (required when equipment_status is 'some')",
        examples=[["Commercial Espresso Machine", "Coffee Grinders", "Point-of-Sale Terminal"]]
    )

    @field_validator("equipment_status")
    @classmethod
    def normalize_equipment_status(cls, v: str) -> str:
        val = v.strip().lower()
        if val in ["all", "i have all equipment"]:
            return "all"
        elif val in ["some", "i have some equipment"]:
            return "some"
        elif val in ["none", "i need equipment", "need"]:
            return "none"
        raise ValueError("equipment_status must be 'all', 'some', or 'none'.")

    @field_validator("business_name", "description", "exact_location")
    @classmethod
    def validate_non_empty_strings(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Field cannot be empty or contain only whitespace.")
        return trimmed


class BusinessCreate(BusinessBase):
    """
    Schema for creating a new business (POST /api/businesses).
    """
    @model_validator(mode="after")
    def validate_equipment_details(self):
        if self.equipment_status == "some":
            if not self.equipment_owned or len(self.equipment_owned) == 0:
                raise ValueError("Please specify at least one owned equipment item when 'I have some equipment' is selected.")
        return self


class BusinessUpdate(BaseModel):
    """
    Schema for updating an existing business (PUT /api/businesses/{id}).
    All fields are optional.
    """
    business_name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    budget: Optional[Decimal] = Field(None, gt=0)
    exact_location: Optional[str] = Field(None, min_length=3, max_length=500)
    nearby_places: Optional[str] = None
    equipment_status: Optional[str] = None
    equipment_owned: Optional[List[str]] = None
    status: Optional[str] = None

    @field_validator("equipment_status")
    @classmethod
    def normalize_update_equipment_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        val = v.strip().lower()
        if val in ["all", "i have all equipment"]:
            return "all"
        elif val in ["some", "i have some equipment"]:
            return "some"
        elif val in ["none", "i need equipment", "need"]:
            return "none"
        raise ValueError("equipment_status must be 'all', 'some', or 'none'.")


class BusinessResponse(BusinessBase):
    """
    Response schema representing a persisted business record.
    """
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
