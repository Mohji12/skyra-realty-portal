from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Admin(Base):
    __tablename__ = "admins"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    sessions: Mapped[list["SessionToken"]] = relationship(
        back_populates="admin", cascade="all, delete-orphan"
    )


class SessionToken(Base):
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    admin_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("admins.id", ondelete="CASCADE"), nullable=False, index=True
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    admin: Mapped[Admin] = relationship(back_populates="sessions")


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    locality: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    area_sqft: Mapped[float] = mapped_column(Float, nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bathrooms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    furnishing: Mapped[str] = mapped_column(String(64), nullable=False)
    possession_status: Mapped[str] = mapped_column(String(64), nullable=False)
    age_of_property: Mapped[str] = mapped_column(String(64), nullable=False)
    facing: Mapped[str] = mapped_column(String(32), nullable=False)
    floor_number: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_floors: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    amenities: Mapped[list] = mapped_column(JSON, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    images: Mapped[list] = mapped_column(JSON, nullable=False)
    listed_date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    owner_contact_name: Mapped[str] = mapped_column(String(128), nullable=False)
    owner_contact_phone: Mapped[str] = mapped_column(String(32), nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
