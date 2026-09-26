from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class FinancialAnalysis(Base):
    """
    SQLAlchemy model representing the 'financial_analysis' table.
    Stores mathematically verified Python calculations for CapEx, OpEx,
    Revenue, Profit, Margins, Break-even, ROI, and Payback periods under
    Conservative, Base, and Optimistic scenarios.
    """
    __tablename__ = "financial_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    initial_investment = Column(Numeric(14, 2), nullable=False)
    estimated_monthly_rent = Column(Numeric(14, 2), nullable=False)
    estimated_monthly_wages = Column(Numeric(14, 2), nullable=False)
    estimated_monthly_raw_materials = Column(Numeric(14, 2), nullable=False)
    estimated_monthly_utilities = Column(Numeric(14, 2), nullable=False)
    estimated_monthly_marketing = Column(Numeric(14, 2), nullable=False)
    estimated_other_costs = Column(Numeric(14, 2), nullable=False)
    
    monthly_revenue_estimate = Column(Numeric(14, 2), nullable=False)
    monthly_expenses_estimate = Column(Numeric(14, 2), nullable=False)
    net_profit_estimate = Column(Numeric(14, 2), nullable=False)
    gross_margin_percent = Column(Float, nullable=False)
    net_margin_percent = Column(Float, nullable=False)
    break_even_months = Column(Float, nullable=False)
    roi_annual_percent = Column(Float, nullable=False)
    payback_period_months = Column(Float, nullable=False)

    scenarios = Column(JSON, nullable=False, default=dict, comment="Conservative, Base, and Optimistic projections")
    monthly_cash_flow = Column(JSON, nullable=False, default=list, comment="12-month projection data for Recharts visualization")
    assumptions = Column(JSON, nullable=False, default=list, comment="Itemized assumptions with Source, Value, Unit, Confidence")
    confidence_score = Column(Float, nullable=False, default=0.88)
    data_source = Column(String(255), nullable=False, default="Deterministic Python Financial Modeling / Industry Standard Benchmarks")

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

    business = relationship("Business", back_populates="financial_analysis")

    def __repr__(self):
        return f"<FinancialAnalysis id={self.id} business_id={self.business_id} net_profit={self.net_profit_estimate}>"
