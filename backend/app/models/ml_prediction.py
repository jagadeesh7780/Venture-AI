from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class MLPrediction(Base):
    """
    SQLAlchemy model representing the 'ml_predictions' table.
    Stores multi-factor feasibility scores, success probability,
    confidence ratings, risk indexes, and feature importance breakdowns.
    """
    __tablename__ = "ml_predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    overall_feasibility_score = Column(Float, nullable=False, default=78.5, comment="Final composite feasibility score (0-100)")
    confidence_score = Column(Float, nullable=False, default=0.87)
    success_probability = Column(Float, nullable=False, default=74.0, comment="Estimated probability of venture viability")
    risk_level = Column(String(50), nullable=False, default="Moderate")
    positive_factors = Column(JSON, nullable=False, default=list, comment="Top viability drivers")
    negative_factors = Column(JSON, nullable=False, default=list, comment="Top risk or drag factors")
    feature_importance = Column(JSON, nullable=False, default=dict, comment="Normalized feature weights driving the score")
    model_name = Column(String(100), nullable=False, default="Scikit-Learn Multi-Factor Feasibility Ensemble")
    limitations_disclaimer = Column(Text, nullable=False, default="AI-assisted decision support. Estimates are grounded on current parameters and market benchmarks, not guaranteed financial outcomes.")

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

    business = relationship("Business", back_populates="ml_prediction")

    def __repr__(self):
        return f"<MLPrediction id={self.id} business_id={self.business_id} score={self.overall_feasibility_score}>"
