import datetime
from typing import Optional, List, Dict, Any
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import PyMongoError, DuplicateKeyError
from app.core.config import settings

_mongo_client: Optional[MongoClient] = None


def get_mongo_client() -> Optional[MongoClient]:
    """
    Returns a singleton MongoClient connected to MongoDB Atlas.
    """
    global _mongo_client
    if _mongo_client is None:
        try:
            uri = settings.MONGODB_URI
            if uri:
                _mongo_client = MongoClient(
                    uri,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=5000,
                    retryWrites=True,
                )
                # Verify connection
                _mongo_client.admin.command('ping')
                print("[MongoDB Atlas] Successfully connected to Cluster0!")
        except Exception as e:
            print(f"[MongoDB Atlas Warning] Could not connect: {e}")
            _mongo_client = None
    return _mongo_client


def get_mongo_db():
    """
    Returns the venture_ai_db database instance in MongoDB Atlas.
    """
    client = get_mongo_client()
    if client is not None:
        db = client[settings.MONGODB_DB_NAME]
        # Ensure indexes on first access
        try:
            db.users.create_index("email", unique=True, sparse=True)
            db.businesses.create_index([("user_email", ASCENDING), ("id", DESCENDING)])
            db.businesses.create_index("id", unique=True, sparse=True)
        except Exception:
            pass
        return db
    return None


# ==========================================
# MongoDB User Persistence Functions
# ==========================================

def mongo_create_user(full_name: str, email: str, password_hash: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Persists a new user record into MongoDB Atlas 'users' collection.
    """
    db = get_mongo_db()
    clean_email = email.strip().lower()
    now = datetime.datetime.utcnow().isoformat()

    user_doc = {
        "id": user_id or int(datetime.datetime.utcnow().timestamp() * 1000),
        "full_name": full_name.strip(),
        "email": clean_email,
        "password_hash": password_hash,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }

    if db is not None:
        try:
            db.users.update_one(
                {"email": clean_email},
                {"$set": user_doc},
                upsert=True,
            )
            print(f"[MongoDB Atlas] User '{clean_email}' saved to Atlas users collection.")
        except Exception as e:
            print(f"[MongoDB Atlas Error] saving user '{clean_email}': {e}")

    return user_doc


def mongo_get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """
    Fetches user record from MongoDB Atlas by email.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            clean_email = email.strip().lower()
            return db.users.find_one({"email": clean_email}, {"_id": 0})
        except Exception as e:
            print(f"[MongoDB Atlas Error] fetching user by email '{email}': {e}")
    return None


def mongo_get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Fetches user record from MongoDB Atlas by ID.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            return db.users.find_one({"id": int(user_id)}, {"_id": 0})
        except Exception as e:
            print(f"[MongoDB Atlas Error] fetching user by id '{user_id}': {e}")
    return None


def mongo_update_user_password(email: str, new_password_hash: str) -> bool:
    """
    Updates user password hash in MongoDB Atlas.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            clean_email = email.strip().lower()
            result = db.users.update_one(
                {"email": clean_email},
                {
                    "$set": {
                        "password_hash": new_password_hash,
                        "updated_at": datetime.datetime.utcnow().isoformat(),
                    }
                },
            )
            return result.modified_count > 0 or result.matched_count > 0
        except Exception as e:
            print(f"[MongoDB Atlas Error] updating password for '{email}': {e}")
    return False


# ==========================================
# MongoDB Business Planning Persistence Functions
# ==========================================

def mongo_save_business(user_email: str, business_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves or updates a user's business plan in MongoDB Atlas 'businesses' collection.
    Guarantees user plans are permanently stored under their email credentials.
    """
    db = get_mongo_db()
    clean_email = user_email.strip().lower()
    now = datetime.datetime.utcnow().isoformat()

    doc = {
        **business_dict,
        "user_email": clean_email,
        "updated_at": now,
    }
    if "created_at" not in doc or not doc["created_at"]:
        doc["created_at"] = now

    # Remove MongoDB internal _id if present in incoming dict
    doc.pop("_id", None)

    biz_id = doc.get("id")

    if db is not None and biz_id is not None:
        try:
            db.businesses.update_one(
                {"id": int(biz_id)},
                {"$set": doc},
                upsert=True,
            )
            print(f"[MongoDB Atlas] Business Plan #{biz_id} for '{clean_email}' saved to Atlas.")
        except Exception as e:
            print(f"[MongoDB Atlas Error] saving business plan #{biz_id}: {e}")

    return doc


def mongo_get_user_businesses(user_email: str) -> List[Dict[str, Any]]:
    """
    Retrieves all business plans created by this user from MongoDB Atlas.
    When user re-logs in with same credentials, all plans are returned.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            clean_email = user_email.strip().lower()
            cursor = db.businesses.find({"user_email": clean_email}, {"_id": 0}).sort("created_at", DESCENDING)
            return list(cursor)
        except Exception as e:
            print(f"[MongoDB Atlas Error] fetching business plans for '{user_email}': {e}")
    return []


def mongo_get_business_by_id(business_id: int, user_email: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Fetches a specific business plan by ID.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            query: Dict[str, Any] = {"id": int(business_id)}
            if user_email:
                query["user_email"] = user_email.strip().lower()
            return db.businesses.find_one(query, {"_id": 0})
        except Exception as e:
            print(f"[MongoDB Atlas Error] fetching business #{business_id}: {e}")
    return None


def mongo_delete_business(business_id: int, user_email: Optional[str] = None) -> bool:
    """
    Deletes a business plan from MongoDB Atlas.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            query: Dict[str, Any] = {"id": int(business_id)}
            if user_email:
                query["user_email"] = user_email.strip().lower()
            result = db.businesses.delete_one(query)
            return result.deleted_count > 0
        except Exception as e:
            print(f"[MongoDB Atlas Error] deleting business #{business_id}: {e}")
    return False


def mongo_save_business_intelligence(business_id: int, intel_data: Dict[str, Any]) -> bool:
    """
    Stores full multi-agent intelligence, 3D spatial twin, and financial analysis for a business in Atlas.
    """
    db = get_mongo_db()
    if db is not None:
        try:
            db.businesses.update_one(
                {"id": int(business_id)},
                {
                    "$set": {
                        "full_intelligence": intel_data,
                        "intelligence_updated_at": datetime.datetime.utcnow().isoformat(),
                    }
                },
                upsert=False,
            )
            return True
        except Exception as e:
            print(f"[MongoDB Atlas Error] saving intelligence for business #{business_id}: {e}")
    return False
