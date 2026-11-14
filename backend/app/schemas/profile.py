from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.common import GeoJSONPoint


class ProfileLocationUpdate(BaseModel):
    """Payload for updating restaurant or shelter organization address and geographical coordinates."""
    address: str = Field(..., min_length=5, description="Full physical address")
    location: GeoJSONPoint = Field(..., description="GeoJSON Point with [longitude, latitude]")
    organizationName: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    # Restaurant-specific fields
    fssaiLicense: Optional[str] = None
    openingHours: Optional[str] = None
    # Shelter-specific fields
    ngoRegistration: Optional[str] = None
    beneficiaryCount: Optional[str] = None
    vehicleAvailable: Optional[bool] = None
    storageFacilities: Optional[str] = None
    darpanId: Optional[str] = None


# Backward-compatibility alias
RestaurantLocationUpdate = ProfileLocationUpdate


class UserProfile(BaseModel):
    id: str
    organizationName: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    location: Optional[GeoJSONPoint] = None
    role: str = "restaurant"
    fssaiLicense: Optional[str] = None
    openingHours: Optional[str] = None
    ngoRegistration: Optional[str] = None
    beneficiaryCount: Optional[str] = None
    vehicleAvailable: Optional[bool] = None
    storageFacilities: Optional[str] = None
    darpanId: Optional[str] = None


# Backward-compatibility alias
RestaurantProfile = UserProfile
