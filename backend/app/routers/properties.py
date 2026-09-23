import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Admin, Property, SessionToken
from app.schemas import PropertyDraft, PropertyOut

router = APIRouter(prefix="/api/properties", tags=["properties"])
settings = get_settings()


def property_to_out(row: Property) -> PropertyOut:
    return PropertyOut(
        id=row.id,
        title=row.title,
        type=row.type,
        locality=row.locality,
        address=row.address,
        price=row.price,
        areaSqft=row.area_sqft,
        bedrooms=row.bedrooms,
        bathrooms=row.bathrooms,
        furnishing=row.furnishing,
        possessionStatus=row.possession_status,
        ageOfProperty=row.age_of_property,
        facing=row.facing,
        floorNumber=row.floor_number,
        totalFloors=row.total_floors,
        amenities=list(row.amenities or []),
        description=row.description,
        images=list(row.images or []),
        listedDate=row.listed_date,
        ownerContactName=row.owner_contact_name,
        ownerContactPhone=row.owner_contact_phone,
        viewCount=row.view_count or 0,
    )


def apply_draft(row: Property, draft: PropertyDraft, *, keep_views: bool) -> None:
    row.title = draft.title
    row.type = draft.type
    row.locality = draft.locality
    row.address = draft.address
    row.price = draft.price
    row.area_sqft = draft.areaSqft
    row.bedrooms = draft.bedrooms
    row.bathrooms = draft.bathrooms
    row.furnishing = draft.furnishing
    row.possession_status = draft.possessionStatus
    row.age_of_property = draft.ageOfProperty
    row.facing = draft.facing
    row.floor_number = draft.floorNumber
    row.total_floors = draft.totalFloors
    row.amenities = draft.amenities
    row.description = draft.description
    row.images = draft.images
    row.listed_date = draft.listedDate
    row.owner_contact_name = draft.ownerContactName
    row.owner_contact_phone = draft.ownerContactPhone
    if not keep_views:
        row.view_count = 0


def current_admin(request: Request, db: Session) -> Admin:
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    session = db.get(SessionToken, token)
    if not session or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    admin = db.get(Admin, session.admin_id)
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return admin


@router.get("", response_model=list[PropertyOut])
def list_properties(db: Session = Depends(get_db)) -> list[PropertyOut]:
    rows = db.query(Property).all()
    return [property_to_out(r) for r in rows]


@router.get("/{property_id}", response_model=PropertyOut)
def get_property(property_id: str, db: Session = Depends(get_db)) -> PropertyOut:
    row = db.get(Property, property_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    return property_to_out(row)


@router.post("/{property_id}/view", response_model=PropertyOut)
def increment_view(property_id: str, db: Session = Depends(get_db)) -> PropertyOut:
    row = db.get(Property, property_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    row.view_count = (row.view_count or 0) + 1
    db.commit()
    db.refresh(row)
    return property_to_out(row)


@router.post("", response_model=PropertyOut, status_code=status.HTTP_201_CREATED)
def create_property(
    draft: PropertyDraft,
    request: Request,
    db: Session = Depends(get_db),
) -> PropertyOut:
    current_admin(request, db)
    prop_id = (draft.id or "").strip() or f"skyra-{uuid.uuid4()}"
    if db.get(Property, prop_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Property id exists")

    row = Property(id=prop_id, view_count=0)
    apply_draft(row, draft, keep_views=False)
    db.add(row)
    db.commit()
    db.refresh(row)
    return property_to_out(row)


@router.put("/{property_id}", response_model=PropertyOut)
def update_property(
    property_id: str,
    draft: PropertyDraft,
    request: Request,
    db: Session = Depends(get_db),
) -> PropertyOut:
    current_admin(request, db)
    row = db.get(Property, property_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    apply_draft(row, draft, keep_views=True)
    db.commit()
    db.refresh(row)
    return property_to_out(row)


@router.delete("/{property_id}")
def delete_property(
    property_id: str,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    current_admin(request, db)
    row = db.get(Property, property_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    db.delete(row)
    db.commit()
    return {"ok": True}
