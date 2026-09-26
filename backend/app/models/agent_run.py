from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class AgentRun(Base):
    """
    SQLAlchemy model representing the 'agent_runs' table.
    Tracks execution status, timing, and outputs for all specialized agents in the LangGraph workflow:
    - business_understanding
    - rag_knowledge
    - location_competitor
    - financial
    - equipment
    - supplier
    - marketing
    - growth
    - ml_feasibility
    """
    __tablename__ = "agent_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column(
        Integer,
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Referenced business ID",
    )
    agent_name = Column(String(100), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="queued", comment="queued, running, completed, skipped, failed")
    execution_time_ms = Column(Integer, nullable=True, default=0)
    output_summary = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
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

    business = relationship("Business", back_populates="agent_runs")

    def __repr__(self):
        return f"<AgentRun id={self.id} business_id={self.business_id} agent='{self.agent_name}' status='{self.status}'>"
