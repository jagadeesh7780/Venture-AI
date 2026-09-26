from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class UserCreate(BaseModel):
    """
    Schema for user registration request (POST /api/auth/register).
    """
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
        description="Full name of the user",
        examples=["Sarah Connor"]
    )
    email: EmailStr = Field(
        ...,
        description="Unique valid email address",
        examples=["sarah.connor@example.com"]
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        description="Raw password (will be hashed with Argon2 immediately)",
        examples=["SecurePass123!"]
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 2:
            raise ValueError("Full name must be at least 2 characters long.")
        return trimmed


class UserLogin(BaseModel):
    """
    Schema for user login request (POST /api/auth/login).
    """
    email: EmailStr = Field(
        ...,
        description="Registered email address",
        examples=["sarah.connor@example.com"]
    )
    password: str = Field(
        ...,
        min_length=1,
        description="Account password",
        examples=["SecurePass123!"]
    )


class UserResponse(BaseModel):
    """
    Public representation of a User record (never returns password_hash).
    """
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """
    Authentication response schema containing JWT access token and user info.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
