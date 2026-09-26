from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.routes.auth import get_current_active_user
from app.schemas.analysis import BusinessAnalysisResponse
from app.services.business_service import get_user_business_by_id
from app.services.analysis_service import (
    save_or_update_analysis,
    get_analysis_by_business_id,
)
from app.agents.business_understanding import get_business_understanding_agent

router = APIRouter(
    prefix="/businesses",
    tags=["Business Understanding Agent"],
)


@router.post(
    "/{business_id}/analyze",
    response_model=BusinessAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze business with Business Understanding AI Agent",
    description="Invokes the local Ollama LLM to perform structured business understanding for the authenticated user's business.",
)
def analyze_business_endpoint(
    business_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> BusinessAnalysisResponse:
    """
    POST /api/businesses/{business_id}/analyze
    1. Authenticate user & verify business ownership
    2. Retrieve business parameters from PostgreSQL
    3. Execute Business Understanding AI Agent (Ollama LLM)
    4. Validate structured JSON with Pydantic
    5. Save analysis to PostgreSQL
    6. Return structured business analysis
    """
    # 1. Verify business exists and belongs to current user
    business = get_user_business_by_id(
        db=db,
        user_id=current_user.id,
        business_id=business_id,
    )
    if not business:
        business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} was not found.",
        )

    # 2. Invoke Business Understanding Agent
    try:
        agent = get_business_understanding_agent()
        agent_output = agent.analyze(business=business)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Business Understanding Agent failed: {str(e)}",
        )

    # 3. Persist analysis to PostgreSQL
    try:
        persisted_analysis = save_or_update_analysis(
            db=db,
            business_id=business.id,
            agent_output=agent_output,
        )
        # Update business status
        business.status = "analyzed"
        db.commit()
        db.refresh(persisted_analysis)
        return persisted_analysis
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while saving analysis: {str(e)}",
        )


@router.get(
    "/{business_id}/analysis",
    response_model=BusinessAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Get existing analysis for a business",
    description="Fetches the stored Business Understanding analysis for a specific business belonging to the user.",
)
def get_business_analysis_endpoint(
    business_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> BusinessAnalysisResponse:
    """
    GET /api/businesses/{business_id}/analysis
    """
    # Verify business ownership
    business = get_user_business_by_id(
        db=db,
        user_id=current_user.id,
        business_id=business_id,
    )
    if not business:
        business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} was not found.",
        )

    # Retrieve existing analysis
    analysis = get_analysis_by_business_id(db=db, business_id=business_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No AI analysis found for business '{business.business_name}' yet. Click 'Analyze My Business' to generate it.",
        )

    return analysis
