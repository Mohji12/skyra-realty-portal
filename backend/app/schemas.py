from pydantic import BaseModel, Field


class AdminOut(BaseModel):
    id: str
    email: str


class LoginRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    ok: bool = True
    admin: AdminOut


class SessionResponse(BaseModel):
    authenticated: bool
    admin: AdminOut | None = None


class PropertyDraft(BaseModel):
    id: str | None = None
    title: str = Field(min_length=1)
    type: str = Field(min_length=1)
    locality: str = Field(min_length=1)
    address: str = Field(min_length=1)
    price: float = Field(gt=0)
    areaSqft: float = Field(gt=0)
    bedrooms: int = Field(ge=0)
    bathrooms: int = Field(ge=0)
    furnishing: str = Field(min_length=1)
    possessionStatus: str = Field(min_length=1)
    ageOfProperty: str = Field(min_length=1)
    facing: str = Field(min_length=1)
    floorNumber: int = Field(ge=0)
    totalFloors: int = Field(ge=0)
    amenities: list[str]
    description: str = Field(min_length=1)
    images: list[str] = Field(min_length=1)
    listedDate: str = Field(min_length=1)
    ownerContactName: str = Field(min_length=1)
    ownerContactPhone: str = Field(min_length=1)


class PropertyOut(PropertyDraft):
    id: str
    viewCount: int = 0

    model_config = {"from_attributes": True}
