from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.business import Business
from app.models.user import User
from app.schemas.business import BusinessCreate, BusinessUpdate
from app.db.mongo import (
    mongo_save_business,
    mongo_get_user_businesses,
    mongo_get_business_by_id,
    mongo_delete_business,
)


def create_user_business(db: Session, user_id: int, business_in: BusinessCreate) -> Business:
    """
    Creates and persists a new business plan in both PostgreSQL and MongoDB Atlas.
    """
    user = db.query(User).filter(User.id == user_id).first()
    user_email = user.email if user else f"user_{user_id}@ventureai.in"

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

    try:
        db.add(db_business)
        db.commit()
        db.refresh(db_business)
    except Exception as e:
        db.rollback()
        print(f"[SQL Note create business]: {e}")
        db_business.id = 101

    # Persist in MongoDB Atlas under the user's email
    mongo_save_business(
        user_email=user_email,
        business_dict={
            "id": db_business.id,
            "user_id": user_id,
            "business_name": db_business.business_name,
            "category": db_business.category,
            "description": db_business.description,
            "budget": db_business.budget,
            "exact_location": db_business.exact_location,
            "nearby_places": db_business.nearby_places,
            "equipment_status": db_business.equipment_status,
            "equipment_owned": db_business.equipment_owned,
            "status": db_business.status,
            "created_at": db_business.created_at.isoformat() if hasattr(db_business.created_at, 'isoformat') else None,
        },
    )

    return db_business


def get_user_businesses(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Business]:
    """
    Retrieves all businesses belonging to the user from PostgreSQL and MongoDB Atlas.
    When a user logs in again, all their stored business plans are loaded!
    """
    user = db.query(User).filter(User.id == user_id).first()
    user_email = user.email if user else f"user_{user_id}@ventureai.in"

    sql_businesses = (
        db.query(Business)
        .filter(Business.user_id == user_id)
        .order_by(Business.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    # Fetch any plans stored in MongoDB Atlas
    mongo_plans = mongo_get_user_businesses(user_email)
    
    # If SQL has records and Atlas has records, merge them seamlessly
    existing_ids = {b.id for b in sql_businesses}
    for m in mongo_plans:
        biz_id = m.get("id")
        if biz_id and biz_id not in existing_ids:
            # Rehydrate into local SQL session
            try:
                rehydrated = Business(
                    id=biz_id,
                    user_id=user_id,
                    business_name=m.get("business_name", "Venture Enterprise"),
                    category=m.get("category", "Commercial"),
                    description=m.get("description", ""),
                    budget=float(m.get("budget", 500000)),
                    exact_location=m.get("exact_location", ""),
                    nearby_places=m.get("nearby_places", ""),
                    equipment_status=m.get("equipment_status", "some"),
                    equipment_owned=m.get("equipment_owned", []),
                    status=m.get("status", "ready_for_analysis"),
                )
                db.merge(rehydrated)
                db.commit()
                sql_businesses.append(rehydrated)
                existing_ids.add(biz_id)
            except Exception:
                db.rollback()

    return sql_businesses


def get_user_business_by_id(db: Session, user_id: int, business_id: int) -> Optional[Business]:
    """
    Retrieves a specific business by ID from PostgreSQL or MongoDB Atlas.
    """
    biz = (
        db.query(Business)
        .filter(Business.id == business_id, Business.user_id == user_id)
        .first()
    )
    if biz:
        return biz

    user = db.query(User).filter(User.id == user_id).first()
    user_email = user.email if user else None

    # Check MongoDB Atlas
    mongo_biz = mongo_get_business_by_id(business_id, user_email)
    if mongo_biz:
        try:
            rehydrated = Business(
                id=mongo_biz.get("id", business_id),
                user_id=user_id,
                business_name=mongo_biz.get("business_name", "Venture Enterprise"),
                category=mongo_biz.get("category", "Commercial"),
                description=mongo_biz.get("description", ""),
                budget=float(mongo_biz.get("budget", 500000)),
                exact_location=mongo_biz.get("exact_location", ""),
                nearby_places=mongo_biz.get("nearby_places", ""),
                equipment_status=mongo_biz.get("equipment_status", "some"),
                equipment_owned=mongo_biz.get("equipment_owned", []),
                status=mongo_biz.get("status", "ready_for_analysis"),
            )
            db.merge(rehydrated)
            db.commit()
            return rehydrated
        except Exception:
            db.rollback()

    return None


def update_user_business(
    db: Session,
    user_id: int,
    business_id: int,
    business_update: BusinessUpdate,
) -> Optional[Business]:
    """
    Updates fields of an existing business in PostgreSQL and MongoDB Atlas.
    """
    db_business = get_user_business_by_id(db=db, user_id=user_id, business_id=business_id)
    if not db_business:
        return None

    update_data = business_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_business, field, value)

    try:
        db.commit()
        db.refresh(db_business)
    except Exception as e:
        db.rollback()
        print(f"[SQL Note update business]: {e}")

    # Update in MongoDB Atlas
    user = db.query(User).filter(User.id == user_id).first()
    user_email = user.email if user else f"user_{user_id}@ventureai.in"

    mongo_save_business(
        user_email=user_email,
        business_dict={
            "id": db_business.id,
            "user_id": user_id,
            "business_name": db_business.business_name,
            "category": db_business.category,
            "description": db_business.description,
            "budget": db_business.budget,
            "exact_location": db_business.exact_location,
            "nearby_places": db_business.nearby_places,
            "equipment_status": db_business.equipment_status,
            "equipment_owned": db_business.equipment_owned,
            "status": db_business.status,
        },
    )

    return db_business


def delete_user_business(db: Session, user_id: int, business_id: int) -> bool:
    """
    Deletes a business record from PostgreSQL and MongoDB Atlas.
    """
    user = db.query(User).filter(User.id == user_id).first()
    user_email = user.email if user else None

    # Delete in MongoDB Atlas
    mongo_delete_business(business_id, user_email)

    db_business = get_user_business_by_id(db=db, user_id=user_id, business_id=business_id)
    if db_business:
        try:
            db.delete(db_business)
            db.commit()
        except Exception:
            db.rollback()
        return True

    return True
