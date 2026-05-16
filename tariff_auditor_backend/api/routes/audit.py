import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Optional

from models.schemas import AuditRequest, AuditResponse, AuditStatusResponse
from models.audit import AuditRecord
from database import get_db
from services.audit_service import process_audit_background
from config import settings
import uuid
import json

router = APIRouter(prefix="/api/v1")

# Rate limiting simple in-memory
RATE_LIMIT = {}
RATE_LIMIT_TIMEFRAME = datetime.timedelta(minutes=1)

def check_rate_limit(ip: str):
    now = datetime.datetime.now(datetime.timezone.utc)
    if ip in RATE_LIMIT:
        requests = [req for req in RATE_LIMIT[ip] if now - req < RATE_LIMIT_TIMEFRAME]
        RATE_LIMIT[ip] = requests
        if len(requests) >= 10:
            raise HTTPException(status_code=429, detail="Too many requests")
        RATE_LIMIT[ip].append(now)
    else:
        RATE_LIMIT[ip] = [now]

@router.post("/audit", response_model=AuditResponse)
async def create_audit(request: AuditRequest, bg_tasks: BackgroundTasks, http_req: Request, db: AsyncSession = Depends(get_db)):
    client_ip = http_req.client.host if http_req.client else "127.0.0.1"
    print(f"\n[DEBUG ROUTER] Menerima request audit dari {client_ip} untuk produk: {request.product_name}")
    check_rate_limit(client_ip)

    record = AuditRecord(
        product_name=request.product_name,
        origin_country=request.origin_country,
        destination_country=request.destination_country,
        declared_hs_code=request.declared_hs_code,
        shipment_value=request.shipment_value,
        status="processing"
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    bg_tasks.add_task(process_audit_background, str(record.id), request, db)

    return AuditResponse(
        audit_id=str(record.id),
        status=record.status,
        created_at=record.created_at
    )

@router.get("/audit/{audit_id}")
async def get_audit(audit_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditRecord).where(AuditRecord.id == audit_id, AuditRecord.deleted_at.is_(None)))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    if record.status == "processing":
        return {"status": record.status, "progress": {"step": record.progress_step, "message": record.progress_message}}
    
    try:
        return json.loads(record.report_json)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format from LLM", "raw_data": record.report_json}

@router.get("/audit/{audit_id}/status", response_model=AuditStatusResponse)
async def get_audit_status(audit_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditRecord).where(AuditRecord.id == audit_id, AuditRecord.deleted_at.is_(None)))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    return AuditStatusResponse(
        status=record.status,
        progress={"step": record.progress_step, "message": record.progress_message}
    )

@router.get("/audits")
async def list_audits(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    destination_country: Optional[str] = None,
    date_from: Optional[datetime.datetime] = None,
    date_to: Optional[datetime.datetime] = None,
    db: AsyncSession = Depends(get_db)
):
    if limit > 100:
        limit = 100
    
    query = select(AuditRecord).where(AuditRecord.deleted_at.is_(None))
    
    if status:
        query = query.where(AuditRecord.status == status)
    if destination_country:
        query = query.where(AuditRecord.destination_country == destination_country)
    if date_from:
        query = query.where(AuditRecord.created_at >= date_from)
    if date_to:
        query = query.where(AuditRecord.created_at <= date_to)
        
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    query = query.offset((page - 1) * limit).limit(limit)
    records_result = await db.execute(query)
    records = records_result.scalars().all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": [
            {
                "id": r.id,
                "status": r.status,
                "product_name": r.product_name,
                "destination_country": r.destination_country,
                "created_at": r.created_at
            }
            for r in records
        ]
    }

@router.delete("/audit/{audit_id}")
async def delete_audit(audit_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditRecord).where(AuditRecord.id == audit_id, AuditRecord.deleted_at.is_(None)))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    record.deleted_at = datetime.datetime.now(datetime.timezone.utc)
    await db.commit()
    
    from fastapi.responses import Response
    return Response(status_code=204)
