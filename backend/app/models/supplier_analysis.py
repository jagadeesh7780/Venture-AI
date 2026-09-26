from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class SupplierAnalysis(Base):
    """
    SQLAlchemy model representing the 'supplier_analysis' table.
    Stores raw materials checklist, packaging requirements, identified wholesale
    suppliers with location and ratings, and supply chain vulnerability ratings.
    """
    __tablename__ = "supplier_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    raw_materials = Column(JSON, nullable=False, default=list, comment="List of raw ingredients or materials required")
    packaging_supplies = Column(JSON, nullable=False, default=list)
    vetted_suppliers = Column(JSON, nullable=False, default=list, comment="Ranked suppliers with verified tags and distances")
    supply_chain_risk = Column(String(50), nullable=False, default="Low to Moderate")
    inventory_turnover_strategy = Column(JSON, nullable=False, default=dict)
    confidence_score = Column(Float, nullable=False, default=0.86)
    data_source = Column(String(255), nullable=False, default="Wholesale Trade Index / Verified Commercial Directory")

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

    business = relationship("Business", back_populates="supplier_analysis")

    def __repr__(self):
        return f"<SupplierAnalysis id={self.id} business_id={self.business_id} suppliers_count={len(self.vetted_suppliers or [])}>"
