from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from app.core.config import settings

# Initialize Argon2 password hasher
# Argon2 is the winner of the Password Hashing Competition (PHC) and is memory-hard.
password_hasher = PasswordHasher(
    time_cost=2,        # Number of iterations
    memory_cost=102400, # 100 MiB memory usage
    parallelism=8,      # Number of parallel threads
    hash_len=32,
    salt_len=16
)


def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using the Argon2id algorithm.
    Never store plain-text passwords in the database.
    """
    return password_hasher.hash(password)


get_password_hash = hash_password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against an Argon2 hash.
    Returns True if valid, False otherwise.
    """
    try:
        return password_hasher.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False
    except Exception:
        return False


def create_access_token(subject: Union[str, Any], email: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a cryptographically signed JSON Web Token (JWT) containing the user's ID and email.
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "email": email,
        "iat": now,
        "exp": expire,
    }
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT token signature and expiration.
    Returns payload dictionary if valid, None if expired or invalid.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
