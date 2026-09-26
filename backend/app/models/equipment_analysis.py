from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class EquipmentAnalysis(Base):
    """
    SQLAlchemy model representing the 'equipment_analysis' table.
    Stores required equipment breakdown, missing vs owned analysis,
    estimated pricing, vetted seller categories, and 3D spatial layout coordinates.
    """
    __tablename__ = "equipment_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    equipment_status = Column(String(50), nullable=False, default="none")
    required_equipment = Column(JSON, nullable=False, default=list)
    owned_equipment = Column(JSON, nullable=False, default=list)
    missing_equipment = Column(JSON, nullable=False, default=list)
    estimated_total_cost = Column(Numeric(14, 2), nullable=False, default=0.0)
    potential_sellers = Column(JSON, nullable=False, default=list)
    spatial_3d_specs = Column(JSON, nullable=False, default=list, comment="Specifications for 3D Digital Twin placement")
    maintenance_requirements = Column(JSON, nullable=False, default=list)
    confidence_score = Column(Float, nullable=False, default=0.90)
    data_source = Column(String(255), nullable=False, default="Commercial Equipment Catalog & Industrial Standards")

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

    business = relationship("Business", back_populates="equipment_analysis")

    def __repr__(self):
        return f"<EquipmentAnalysis id={self.id} business_id={self.business_id} status='{self.equipment_status}'>"
