from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class GrowthPlan(Base):
    """
    SQLAlchemy model representing the 'growth_plans' table.
    Stores multi-stage launch roadmap, licensing and compliance checklist,
    key performance indicators (KPIs), and 12-month expansion strategy.
    """
    __tablename__ = "growth_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    timeline_phases = Column(JSON, nullable=False, default=dict, comment="Pre-launch, Month 1, Month 2-3, Month 4-6, Month 6-12")
    regulatory_compliance = Column(JSON, nullable=False, default=list, comment="Licensing, permits, GST, health/safety clearances")
    key_kpis = Column(JSON, nullable=False, default=list, comment="Target operational, financial, and customer KPIs")
    hiring_roadmap = Column(JSON, nullable=False, default=list)
    risk_mitigation_plan = Column(JSON, nullable=False, default=list)
    confidence_score = Column(Float, nullable=False, default=0.88)
    data_source = Column(String(255), nullable=False, default="Startup Execution Playbooks / Regulatory Knowledge Graph")

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

    business = relationship("Business", back_populates="growth_plan")

    def __repr__(self):
        return f"<GrowthPlan id={self.id} business_id={self.business_id}>"
