from typing import Optional
from sqlalchemy.orm import Session
from app.models.analysis import BusinessAnalysis
from app.schemas.analysis import BusinessUnderstandingAgentOutput


def save_or_update_analysis(
    db: Session,
    business_id: int,
    agent_output: BusinessUnderstandingAgentOutput,
) -> BusinessAnalysis:
    """
    Persists or updates the 1-to-1 BusinessAnalysis record in PostgreSQL/SQLite.
    """
    existing = (
        db.query(BusinessAnalysis)
        .filter(BusinessAnalysis.business_id == business_id)
        .first()
    )

    if existing:
        existing.business_category = agent_output.business_category
        existing.business_subcategory = agent_output.business_subcategory
        existing.business_model = agent_output.business_model
        existing.target_customers = agent_output.target_customers
        existing.products_or_services = agent_output.products_or_services
        existing.required_resources = agent_output.required_resources
        existing.operational_requirements = agent_output.operational_requirements
        existing.potential_risks = agent_output.potential_risks
        existing.recommended_analysis = agent_output.recommended_analysis
        db.commit()
        db.refresh(existing)
        return existing

    new_analysis = BusinessAnalysis(
        business_id=business_id,
        business_category=agent_output.business_category,
        business_subcategory=agent_output.business_subcategory,
        business_model=agent_output.business_model,
        target_customers=agent_output.target_customers,
        products_or_services=agent_output.products_or_services,
        required_resources=agent_output.required_resources,
        operational_requirements=agent_output.operational_requirements,
        potential_risks=agent_output.potential_risks,
        recommended_analysis=agent_output.recommended_analysis,
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    return new_analysis


def get_analysis_by_business_id(
    db: Session,
    business_id: int,
) -> Optional[BusinessAnalysis]:
    """
    Retrieves the existing BusinessAnalysis record for a specific business ID.
    """
    return (
        db.query(BusinessAnalysis)
        .filter(BusinessAnalysis.business_id == business_id)
        .first()
    )
