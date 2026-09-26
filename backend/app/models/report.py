from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Report(Base):
    """
    SQLAlchemy model representing the 'reports' table.
    Stores complete comprehensive Business Feasibility Reports including
    Executive Summary, Section Details, Risk Disclaimers, and Data Origin Matrix.
    """
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    title = Column(String(255), nullable=False)
    executive_summary = Column(Text, nullable=False)
    overall_feasibility_score = Column(Float, nullable=False, default=75.0)
    sections = Column(JSON, nullable=False, default=dict)
    data_origin_matrix = Column(JSON, nullable=False, default=dict, comment="Maps sections to USER_PROVIDED, VERIFIED_EXTERNAL, ESTIMATED, AI_INTERPRETATION, ML_PREDICTION, SIMULATED")
    key_recommendations = Column(JSON, nullable=False, default=list)
    risk_factors = Column(JSON, nullable=False, default=list)
    full_markdown_report = Column(Text, nullable=True)

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

    business = relationship("Business", back_populates="report")

    def __repr__(self):
        return f"<Report id={self.id} business_id={self.business_id} title='{self.title}'>"
