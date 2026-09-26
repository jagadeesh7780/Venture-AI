from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class MarketingAnalysis(Base):
    """
    SQLAlchemy model representing the 'marketing_analysis' table.
    Stores customer opportunity mapping, direct and B2B distribution channels,
    marketing opportunity scores, and digital/offline acquisition campaigns.
    """
    __tablename__ = "marketing_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    marketing_opportunity_score = Column(Float, nullable=False, default=80.0)
    primary_customer_personas = Column(JSON, nullable=False, default=list)
    b2b_opportunities = Column(JSON, nullable=False, default=list, comment="Corporate, hotel, educational, or retail B2B targets")
    distribution_channels = Column(JSON, nullable=False, default=list, comment="Direct, online platforms, aggregators, retail")
    marketing_channels = Column(JSON, nullable=False, default=list, comment="Local SEO, social media, community partnerships")
    customer_acquisition_cost_est = Column(String(100), nullable=False, default="Low to Moderate")
    confidence_score = Column(Float, nullable=False, default=0.85)
    data_source = Column(String(255), nullable=False, default="Omnichannel Market Research & Customer Density Models")

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

    business = relationship("Business", back_populates="marketing_analysis")

    def __repr__(self):
        return f"<MarketingAnalysis id={self.id} business_id={self.business_id} score={self.marketing_opportunity_score}>"
