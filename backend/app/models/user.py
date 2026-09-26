from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class User(Base):
    """
    SQLAlchemy Model representing the 'users' table in PostgreSQL.
    Stores registered user credentials and authentication details.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False, comment="User's full name")
    email = Column(String(255), unique=True, index=True, nullable=False, comment="Unique email address for login")
    password_hash = Column(String(500), nullable=False, comment="Argon2 hashed password (never plain-text)")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # 1-to-Many Relationship: One user owns many businesses
    businesses = relationship(
        "Business",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self):
        return f"<User id={self.id} email='{self.email}'>"
