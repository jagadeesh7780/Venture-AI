from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate


def create_user_business(db: Session, user_id: int, business_in: BusinessCreate) -> Business:
    """
    Creates and persists a new business record strictly owned by the given user_id.
    """
    db_business = Business(
        user_id=user_id,
        business_name=business_in.business_name,
        category=getattr(business_in, "category", None) or "Commercial",
        description=business_in.description,
        budget=business_in.budget,
        exact_location=business_in.exact_location,
        nearby_places=business_in.nearby_places,
        equipment_status=business_in.equipment_status,
        equipment_owned=business_in.equipment_owned or [],
        status="ready_for_analysis",
    )
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business


def get_user_businesses(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Business]:
    """
    Retrieves all businesses belonging strictly to the authenticated user.
    """
    return (
        db.query(Business)
        .filter(Business.user_id == user_id)
        .order_by(Business.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_business_by_id(db: Session, user_id: int, business_id: int) -> Optional[Business]:
    """
    Retrieves a specific business by ID ONLY IF it belongs to the authenticated user.
    Prevents unauthorized access across user boundaries.
    """
    return (
        db.query(Business)
        .filter(Business.id == business_id, Business.user_id == user_id)
        .first()
    )


def update_user_business(
    db: Session,
    user_id: int,
    business_id: int,
    business_update: BusinessUpdate,
) -> Optional[Business]:
    """
    Updates fields of an existing business owned by the user.
    """
    db_business = get_user_business_by_id(db=db, user_id=user_id, business_id=business_id)
    if not db_business:
        return None

    update_data = business_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_business, field, value)

    db.commit()
    db.refresh(db_business)
    return db_business


def delete_user_business(db: Session, user_id: int, business_id: int) -> bool:
    """
    Deletes a business record owned by the user.
    Returns True if deleted, False if not found.
    """
    db_business = get_user_business_by_id(db=db, user_id=user_id, business_id=business_id)
    if not db_business:
        return False

    db.delete(db_business)
    db.commit()
    return True
