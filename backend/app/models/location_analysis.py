from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class LocationAnalysis(Base):
    """
    SQLAlchemy model representing the 'location_analysis' table.
    Stores spatial geocoding, nearby landmarks, foot traffic estimates,
    and spatial markers for OpenStreetMap and 3D Digital Twin visualization.
    """
    __tablename__ = "location_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Referenced business ID (1-to-1)",
    )
    latitude = Column(Float, nullable=False, default=12.9716)
    longitude = Column(Float, nullable=False, default=77.5946)
    formatted_address = Column(String(500), nullable=False)
    location_score = Column(Float, nullable=False, default=75.0, comment="Location feasibility score (0-100)")
    foot_traffic_estimate = Column(String(100), nullable=False, default="Moderate to High")
    accessibility_rating = Column(String(100), nullable=False, default="High")
    nearby_places_breakdown = Column(JSON, nullable=False, default=dict)
    spatial_markers = Column(JSON, nullable=False, default=list, comment="List of 3D/Map markers with coordinates and categories")
    confidence_score = Column(Float, nullable=False, default=0.85)
    data_source = Column(String(255), nullable=False, default="OpenStreetMap / Nominatim / Spatial Heuristics")
    notes = Column(Text, nullable=True)

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

    business = relationship("Business", back_populates="location_analysis")

    def __repr__(self):
        return f"<LocationAnalysis id={self.id} business_id={self.business_id} score={self.location_score}>"
