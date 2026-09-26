from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Business(Base):
    """
    SQLAlchemy model representing the 'businesses' table in PostgreSQL/SQLite.
    Stores feasibility study inputs and links each business strictly to its owner (user_id).
    """
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Owner user ID",
    )
    business_name = Column(
        String(255),
        nullable=False,
        index=True,
        comment="Commercial or venture name",
    )
    category = Column(
        String(100),
        nullable=True,
        default="Commercial",
        comment="Industry or category (e.g. Boutique, Cafe, Gym)",
    )
    description = Column(
        Text,
        nullable=False,
        comment="Detailed business overview and value proposition",
    )
    budget = Column(
        Numeric(14, 2),
        nullable=False,
        comment="Planned startup investment capital in INR (₹)",
    )
    exact_location = Column(
        String(500),
        nullable=False,
        comment="Specific street address or plot location",
    )
    nearby_places = Column(
        Text,
        nullable=True,
        comment="Surrounding landmark areas, foot-traffic hubs, and transit stations",
    )
    equipment_status = Column(
        String(20),
        nullable=False,
        comment="Equipment status: 'all', 'some', or 'none'",
    )
    equipment_owned = Column(
        JSON,
        nullable=True,
        comment="List of equipment items owned (populated when equipment_status is 'some')",
    )
    status = Column(
        String(50),
        default="ready_for_analysis",
        nullable=False,
        comment="Lifecycle status: 'ready_for_analysis', 'analyzing', 'completed'",
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="businesses")

    analysis = relationship(
        "BusinessAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    location_analysis = relationship(
        "LocationAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    competitor_analysis = relationship(
        "CompetitorAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    financial_analysis = relationship(
        "FinancialAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    equipment_analysis = relationship(
        "EquipmentAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    supplier_analysis = relationship(
        "SupplierAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    marketing_analysis = relationship(
        "MarketingAnalysis",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    growth_plan = relationship(
        "GrowthPlan",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    ml_prediction = relationship(
        "MLPrediction",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    agent_runs = relationship(
        "AgentRun",
        back_populates="business",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    report = relationship(
        "Report",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self):
        return f"<Business id={self.id} user_id={self.user_id} name='{self.business_name}'>"
