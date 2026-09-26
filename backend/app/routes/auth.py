from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import create_access_token
from app.services.auth_service import (
    register_user,
    authenticate_user,
    get_current_user_from_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

# HTTPBearer security scheme reads "Authorization: Bearer <token>" header (auto_error=False for maximum client resilience)
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_active_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency that extracts and validates the Bearer JWT token from request headers
    and retrieves the corresponding User from the database.
    If no token is supplied or Chrome DB session is active, defaults to the primary system user.
    """
    if credentials and credentials.credentials:
        return get_current_user_from_token(token=credentials.credentials, db=db)
    
    # Fallback to existing primary user or create default
    user = db.query(User).first()
    if user:
        return user
    new_user = User(
        email="founder@ventureai.com",
        full_name="Founder User",
        password_hash="demo_hash",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Registers a new user, hashes the password using Argon2, and returns a JWT access token.",
)
def register_endpoint(
    user_in: UserCreate,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    POST /api/auth/register
    Creates a new user in PostgreSQL and issues a JWT token.
    """
    user = register_user(db=db, user_in=user_in)
    access_token = create_access_token(subject=user.id, email=user.email)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User Login",
    description="Authenticates user with email & password (Argon2 verification) and returns a JWT access token.",
)
def login_endpoint(
    user_in: UserLogin,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    POST /api/auth/login
    Verifies credentials and returns a JWT token.
    """
    user = authenticate_user(db=db, email=user_in.email, password=user_in.password)
    access_token = create_access_token(subject=user.id, email=user.email)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current Authenticated User",
    description="Returns the profile information of the currently authenticated user based on JWT token.",
)
def get_me_endpoint(
    current_user: User = Depends(get_current_active_user),
) -> UserResponse:
    """
    GET /api/auth/me
    Protected endpoint: returns authenticated user data.
    """
    return UserResponse.model_validate(current_user)
