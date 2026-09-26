from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.routes.auth import get_current_active_user
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessResponse
from app.services.business_service import (
    create_user_business,
    get_user_businesses,
    get_user_business_by_id,
    update_user_business,
    delete_user_business,
)

router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"],
)


@router.post(
    "",
    response_model=BusinessResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new business",
    description="Creates and persists a new business entry linked to the authenticated user.",
)
def create_business_endpoint(
    business_in: BusinessCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> BusinessResponse:
    """
    POST /api/businesses
    Creates a business under current_user.id.
    """
    try:
        new_business = create_user_business(
            db=db,
            user_id=current_user.id,
            business_in=business_in,
        )
        return new_business
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while saving business: {str(e)}",
        )


@router.get(
    "",
    response_model=List[BusinessResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all businesses owned by current user",
    description="Retrieves a list of all businesses belonging to the currently logged in user.",
)
def list_businesses_endpoint(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> List[BusinessResponse]:
    """
    GET /api/businesses
    Returns current user's businesses.
    """
    return get_user_businesses(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{business_id}",
    response_model=BusinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a specific business by ID",
    description="Fetches a business record only if it belongs to the authenticated user.",
)
def get_business_endpoint(
    business_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> BusinessResponse:
    """
    GET /api/businesses/{id}
    """
    business = get_user_business_by_id(
        db=db,
        user_id=current_user.id,
        business_id=business_id,
    )
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} was not found or you do not have permission to view it.",
        )
    return business


@router.put(
    "/{business_id}",
    response_model=BusinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a business by ID",
    description="Updates an existing business record belonging to the authenticated user.",
)
def update_business_endpoint(
    business_id: int,
    business_update: BusinessUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> BusinessResponse:
    """
    PUT /api/businesses/{id}
    """
    updated_business = update_user_business(
        db=db,
        user_id=current_user.id,
        business_id=business_id,
        business_update=business_update,
    )
    if not updated_business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} was not found or you do not have permission to edit it.",
        )
    return updated_business


@router.delete(
    "/{business_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a business by ID",
    description="Deletes a business record belonging to the authenticated user.",
)
def delete_business_endpoint(
    business_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    DELETE /api/businesses/{id}
    """
    success = delete_user_business(
        db=db,
        user_id=current_user.id,
        business_id=business_id,
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} was not found or you do not have permission to delete it.",
        )
    return {
        "message": f"Business with ID {business_id} has been permanently deleted.",
        "success": True,
    }
