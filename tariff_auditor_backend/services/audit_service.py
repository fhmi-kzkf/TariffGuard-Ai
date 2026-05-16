import traceback
import re
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.schemas import AuditRequest
from models.audit import AuditRecord
from agents.crew import run_audit_crew

async def process_audit_background(audit_id: str, request: AuditRequest, db: AsyncSession):
    print(f"\n[DEBUG BACKGROUND] Memulai background task untuk ID: {audit_id}")
    
    # 1. Ambil data record dari database untuk diupdate nanti
    result = await db.execute(select(AuditRecord).where(AuditRecord.id == audit_id))
    record = result.scalars().first()
    
    if not record:
        print(f"[ERROR BACKGROUND] Record dengan ID {audit_id} tidak ditemukan di database.")
        return

    try:
        # 2. Gabungkan field dari frontend menjadi format yang diminta CrewAI
        specifications = {
            "technical_description": request.technical_description,
            "material_composition": request.material_composition,
            "intended_use": request.intended_use
        }
        
        # 3. Ambil 2 digit pertama dari declared_hs_code sebagai hs_chapter
        if request.declared_hs_code and len(request.declared_hs_code) >= 2:
            hs_chapter = request.declared_hs_code[:2]
        else:
            hs_chapter = "Unknown"

        # 4. Panggil CrewAI di dalam Thread terpisah agar event loop FastAPI tidak terblokir
        print(f"[DEBUG BACKGROUND] Memanggil run_audit_crew untuk ID: {audit_id}...")
        
        crew_result = await asyncio.to_thread(
            run_audit_crew,
            product_name=request.product_name,
            specifications=specifications,
            destination_country=request.destination_country,
            origin_country=request.origin_country,
            hs_chapter=hs_chapter,
            declared_hs_code=request.declared_hs_code,
            shipment_value=request.shipment_value,
            audit_id=audit_id
        )
        
        # 4.5. Bersihkan backticks markdown (```json ... ```) dari output jika ada
        clean_json = str(crew_result).strip()
        clean_json = re.sub(r"^```(?:json)?\s*", "", clean_json)
        clean_json = re.sub(r"\s*```$", "", clean_json).strip()

        # 5. Simpan hasil sukses ke database
        record.status = "complete"
        record.report_json = clean_json
        await db.commit()
        print(f"[DEBUG BACKGROUND] Audit selesai dan disimpan untuk ID: {audit_id}\n")

    except Exception as e:
        # 6. Tangkap error (misal API key habis limit / salah konfigurasi) dan update status menjadi failed
        error_trace = traceback.format_exc()
        print(f"[ERROR BACKGROUND] Terjadi kesalahan saat memproses {audit_id}:\n{error_trace}")
        record.status = "failed"
        record.progress_message = str(e)
        await db.commit()