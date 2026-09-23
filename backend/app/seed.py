"""Create tables, seed admin, and upsert demo properties."""

from __future__ import annotations

import json
import uuid
from pathlib import Path

from app.auth import hash_password
from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models import Admin, Property

ROOT = Path(__file__).resolve().parents[1]
SEED_FILE = ROOT / "data" / "properties.json"


def seed() -> None:
    settings = get_settings()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        email = settings.admin_email.strip().lower()
        existing = db.query(Admin).filter(Admin.email == email).first()
        if existing is None:
            db.add(
                Admin(
                    id=f"admin-{uuid.uuid4()}",
                    email=email,
                    password_hash=hash_password(settings.admin_password),
                )
            )
            db.commit()
            print(f"Created admin: {email}")
        else:
            print(f"Admin already exists: {email}")

        if not SEED_FILE.exists():
            print(f"No seed file at {SEED_FILE}; skipping properties.")
            return

        items = json.loads(SEED_FILE.read_text(encoding="utf-8"))
        upserted = 0
        for item in items:
            prop_id = item["id"]
            row = db.get(Property, prop_id)
            if row is None:
                row = Property(id=prop_id, view_count=item.get("viewCount", 0))
                db.add(row)

            row.title = item["title"]
            row.type = item["type"]
            row.locality = item["locality"]
            row.address = item["address"]
            row.price = item["price"]
            row.area_sqft = item["areaSqft"]
            row.bedrooms = item["bedrooms"]
            row.bathrooms = item["bathrooms"]
            row.furnishing = item["furnishing"]
            row.possession_status = item["possessionStatus"]
            row.age_of_property = item["ageOfProperty"]
            row.facing = item["facing"]
            row.floor_number = item["floorNumber"]
            row.total_floors = item["totalFloors"]
            row.amenities = item["amenities"]
            row.description = item["description"]
            row.images = item["images"]
            row.listed_date = item["listedDate"]
            row.owner_contact_name = item["ownerContactName"]
            row.owner_contact_phone = item["ownerContactPhone"]
            upserted += 1

        db.commit()
        print(f"Upserted {upserted} properties.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
