import uuid
import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, JSON, Numeric
from database import Base

class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(Enum("processing", "complete", "failed", "review_required", name="audit_status_enum"), default="processing")
    progress_step = Column(Integer, default=1)
    progress_message = Column(String, default="Initializing audit...")
    product_name = Column(String, nullable=False)
    origin_country = Column(String(2), nullable=False)
    destination_country = Column(String(2), nullable=False)
    declared_hs_code = Column(String(10), nullable=True)
    shipment_value = Column(Numeric(15, 2), nullable=False)
    report_json = Column(JSON, nullable=True)
    overall_status = Column(Enum("COMPLIANT", "NON_COMPLIANT", "REVIEW_REQUIRED", name="overall_status_enum"), nullable=True)
    risk_level = Column(Enum("LOW", "MEDIUM", "HIGH", "CRITICAL", name="risk_level_enum"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
