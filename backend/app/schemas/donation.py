from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.common import GeoJSONPoint


class DonationCreate(BaseModel):
    foodName: str = Field(..., min_length=2, description="Name of the food item or batch")
    category: str = Field(..., description="Food category (e.g. Cooked Meals, Bakery)")
    dietary: Optional[str] = "Vegetarian"
    quantity: float = Field(..., gt=0, description="Quantity of food items/portions")
    unit: str = Field(default="meals", description="Unit (e.g. meals, boxes, kg)")
    description: Optional[str] = ""
    preparedAt: str = Field(..., description="ISO datetime or string when food was prepared")
    expiresAt: str = Field(..., description="ISO datetime or string for safe consumption expiry")
    
    # Snapshot of the restaurant's location at time of donation
    pickupAddress: str = Field(..., min_length=5, description="Registered pickup address snapshot")
    pickupLocation: GeoJSONPoint = Field(..., description="GeoJSON coordinates snapshot [longitude, latitude]")
    
    pickupInstructions: Optional[str] = Field(default="", description="Specific gate, floor, dock or contact instructions")
    freshnessDeclaration: bool = Field(default=True, description="Certification of food safety")
    restaurantId: Optional[str] = None
    restaurantName: Optional[str] = None


class DonationResponse(DonationCreate):
    id: str
    status: str = "available"  # 'available' | 'claimed' | 'picked_up' | 'cancelled'
    claimedBy: Optional[Dict[str, Any]] = None
    claimedAt: Optional[str] = None
    createdAt: str

