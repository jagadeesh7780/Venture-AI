from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class CompetitorAnalysis(Base):
    """
    SQLAlchemy model representing the 'competitor_analysis' table.
    Stores direct and indirect competitor intelligence, competitive density,
    threat levels, and actionable differentiation strategies.
    """
    __tablename__ = "competitor_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    competition_level = Column(String(50), nullable=False, default="Moderate")
    competitive_density_score = Column(Float, nullable=False, default=60.0)
    direct_competitors = Column(JSON, nullable=False, default=list, comment="List of identified direct competitors")
    indirect_competitors = Column(JSON, nullable=False, default=list, comment="List of indirect/substitute competitors")
    pricing_landscape = Column(JSON, nullable=False, default=dict, comment="Price comparison across competitors")
    differentiation_strategies = Column(JSON, nullable=False, default=list, comment="Recommended positioning strategies")
    swot_summary = Column(JSON, nullable=False, default=dict, comment="Strengths, Weaknesses, Opportunities, Threats")
    confidence_score = Column(Float, nullable=False, default=0.82)
    data_source = Column(String(255), nullable=False, default="OpenStreetMap / Local Directory Aggregations / Spatial Analysis")

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

    business = relationship("Business", back_populates="competitor_analysis")

    def __repr__(self):
        return f"<CompetitorAnalysis id={self.id} business_id={self.business_id} level='{self.competition_level}'>"
