import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.database.connection import get_db, check_database_connection
from app.schemas.donation import DonationCreate, DonationResponse

router = APIRouter()

# In-memory storage fallback if MongoDB daemon is not running locally
_FALLBACK_DONATIONS = [
    {
        "id": "DON-2026-081",
        "restaurantId": "user-rest-101",
        "restaurantName": "The Royal Kitchen & Caterers",
        "foodName": "Paneer Butter Masala & Steamed Basmati Rice",
        "category": "Cooked Meals",
        "dietary": "Vegetarian",
        "quantity": 45,
        "unit": "meals",
        "description": "Freshly prepared corporate catering surplus in insulated containers.",
        "preparedAt": "2026-11-14T13:30",
        "expiresAt": "2026-11-14T23:30",
        "pickupAddress": "42 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8295, 18.9986]
        },
        "pickupInstructions": "Report to kitchen dispatch dock Gate 2.",
        "freshnessDeclaration": True,
        "status": "available",
        "claimedBy": None,
        "claimedAt": None,
        "createdAt": "2026-11-14T14:00:00Z"
    },
    {
        "id": "DON-2026-083",
        "restaurantId": "user-rest-305",
        "restaurantName": "Taj Confectioneries & Deli",
        "foodName": "Multigrain Veg Sandwiches & Fresh Seasonal Fruit Bowls",
        "category": "Cooked Meals",
        "dietary": "Vegetarian",
        "quantity": 35,
        "unit": "packs",
        "description": "Hygienically pre-packed sandwiches and chilled fruit bowls, refrigerated at 4°C.",
        "preparedAt": "2026-11-14T12:00",
        "expiresAt": "2026-11-14T23:45",
        "pickupAddress": "Bandra West, Hill Road, Near Mehboob Studio, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8258, 19.0544]
        },
        "pickupInstructions": "Call store manager on arrival for dock release.",
        "freshnessDeclaration": True,
        "status": "available",
        "claimedBy": None,
        "claimedAt": None,
        "createdAt": "2026-11-14T13:45:00Z"
    },
    {
        "id": "DON-2026-090",
        "restaurantId": "user-rest-501",
        "restaurantName": "Amul Fresh Dairy Depot",
        "foodName": "Pasteurised Toned Milk Pouches (500ml crates)",
        "category": "Dairy",
        "dietary": "Vegetarian",
        "quantity": 40,
        "unit": "litres",
        "description": "Surplus morning distribution crates held in cold storage at 3°C.",
        "preparedAt": "2026-11-14T06:00",
        "expiresAt": "2026-11-16T18:00",
        "pickupAddress": "Kurla West, Near Kurla Railway Terminus, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8797, 19.0688]
        },
        "pickupInstructions": "Cold storage dock 3. Bring thermal carrier boxes.",
        "freshnessDeclaration": True,
        "status": "available",
        "claimedBy": None,
        "claimedAt": None,
        "createdAt": "2026-11-14T08:00:00Z"
    },
    {
        "id": "DON-2026-091",
        "restaurantId": "user-rest-502",
        "restaurantName": "Kisan Mandi Central Distribution",
        "foodName": "Farm Fresh Tomatoes, Capsicum & Golden Potatoes",
        "category": "Raw Produce",
        "dietary": "Vegetarian",
        "quantity": 65,
        "unit": "kg",
        "description": "Grade-A wholesale agricultural produce crates sorted today.",
        "preparedAt": "2026-11-14T07:00",
        "expiresAt": "2026-11-17T20:00",
        "pickupAddress": "APMC Market Yard Phase 2, Vashi, Navi Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.9982, 19.0760]
        },
        "pickupInstructions": "Wholesale Shed 14. Loading helpers will assist your van.",
        "freshnessDeclaration": True,
        "status": "available",
        "claimedBy": None,
        "claimedAt": None,
        "createdAt": "2026-11-14T08:30:00Z"
    },
    {
        "id": "DON-2026-082",
        "restaurantId": "user-rest-101",
        "restaurantName": "The Royal Kitchen & Caterers",
        "foodName": "Whole Wheat Breads & Artisan Croissant Assortment",
        "category": "Bakery",
        "dietary": "Vegetarian",
        "quantity": 28,
        "unit": "boxes",
        "description": "Unsold premium morning bake batches.",
        "preparedAt": "2026-11-14T08:00",
        "expiresAt": "2026-11-15T14:00",
        "pickupAddress": "42 Senapati Bapat Marg, Lower Parel, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8295, 18.9986]
        },
        "pickupInstructions": "Reception counter, ask for Bakery Supervisor.",
        "freshnessDeclaration": True,
        "status": "claimed",
        "claimedBy": {
            "shelterId": "user-shel-202",
            "shelterName": "Anandam Food Relief Shelter",
            "contactPhone": "+91 99302 77810",
            "expectedPickupTime": "2026-11-14T20:30"
        },
        "claimedAt": "2026-11-14T15:30:00Z",
        "createdAt": "2026-11-14T11:00:00Z"
    },
    {
        "id": "DON-2026-085",
        "restaurantId": "user-rest-507",
        "restaurantName": "Grand Hyatt Banquet Kitchen",
        "foodName": "Steamed Jeera Rice & Rajma Masala with Tawa Roti",
        "category": "Cooked Meals",
        "dietary": "Vegetarian",
        "quantity": 55,
        "unit": "meals",
        "description": "Corporate summit dinner surplus. Packed in heavy-duty food-grade insulated cambros at >65°C.",
        "preparedAt": "2026-11-14T16:00",
        "expiresAt": "2026-11-15T01:30",
        "pickupAddress": "Off Western Express Highway, Santacruz East, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8517, 19.0790]
        },
        "pickupInstructions": "Security Gate 4, inform security for Banquet Kitchen Dock 2.",
        "freshnessDeclaration": True,
        "status": "claimed",
        "claimedBy": {
            "shelterId": "user-shel-202",
            "shelterName": "Anandam Food Relief Shelter",
            "contactPhone": "+91 99302 77810",
            "expectedPickupTime": "2026-11-14T21:45"
        },
        "claimedAt": "2026-11-14T17:15:00Z",
        "createdAt": "2026-11-14T16:15:00Z"
    },
    {
        "id": "DON-2026-079",
        "restaurantId": "user-rest-101",
        "restaurantName": "The Royal Kitchen & Caterers",
        "foodName": "Yellow Dal Tadka, Whole Wheat Roti & Mixed Veg",
        "category": "Cooked Meals",
        "dietary": "Vegetarian",
        "quantity": 60,
        "unit": "meals",
        "description": "Seminar lunch surplus packed in insulated containers.",
        "preparedAt": "2026-11-13T19:00",
        "expiresAt": "2026-11-14T04:00",
        "pickupAddress": "42 Senapati Bapat Marg, Lower Parel, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8295, 18.9986]
        },
        "pickupInstructions": "Kitchen loading bay dock.",
        "freshnessDeclaration": True,
        "status": "picked_up",
        "claimedBy": {
            "shelterId": "user-shel-202",
            "shelterName": "Anandam Food Relief Shelter",
            "contactPhone": "+91 99302 77810"
        },
        "claimedAt": "2026-11-13T20:15:00Z",
        "createdAt": "2026-11-13T19:30:00Z"
    },
    {
        "id": "DON-2026-075",
        "restaurantId": "user-rest-509",
        "restaurantName": "Mayfair Banquets & Events",
        "foodName": "Shahi Paneer, Dal Makhani & Missi Roti Platter",
        "category": "Cooked Meals",
        "dietary": "Vegetarian",
        "quantity": 95,
        "unit": "meals",
        "description": "Wedding reception surplus collected and distributed at Matunga slum center.",
        "preparedAt": "2026-11-11T14:00",
        "expiresAt": "2026-11-12T01:00",
        "pickupAddress": "Dr. Annie Besant Road, Worli, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8184, 19.0144]
        },
        "pickupInstructions": "Rear banquet dispatch dock.",
        "freshnessDeclaration": True,
        "status": "picked_up",
        "claimedBy": {
            "shelterId": "user-shel-202",
            "shelterName": "Anandam Food Relief Shelter",
            "contactPhone": "+91 99302 77810"
        },
        "claimedAt": "2026-11-11T16:00:00Z",
        "createdAt": "2026-11-11T14:30:00Z"
    },
    {
        "id": "DON-2026-071",
        "restaurantId": "user-rest-512",
        "restaurantName": "Cafe Moshe's Continental",
        "foodName": "Assorted Penne Arrabiata Pasta & Garlic Herb Bread",
        "category": "Cooked Meals",
        "dietary": "Vegetarian",
        "quantity": 35,
        "unit": "meals",
        "description": "Corporate lunch buffet surplus.",
        "preparedAt": "2026-11-08T13:00",
        "expiresAt": "2026-11-08T20:30",
        "pickupAddress": "Cuffe Parade, Colaba, Mumbai",
        "pickupLocation": {
            "type": "Point",
            "coordinates": [72.8211, 18.9150]
        },
        "pickupInstructions": "Service elevator lobby.",
        "freshnessDeclaration": True,
        "status": "cancelled",
        "claimedBy": {
            "shelterId": "user-shel-202",
            "shelterName": "Anandam Food Relief Shelter",
            "contactPhone": "+91 99302 77810"
        },
        "claimedAt": "2026-11-08T14:00:00Z",
        "createdAt": "2026-11-08T13:30:00Z"
    }
]


@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(payload: DonationCreate):
    """
    Publish a new food surplus donation.
    Captures an immutable snapshot of the restaurant's pickup address and coordinates.
    """
    if not payload.pickupAddress or not payload.pickupAddress.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your restaurant pickup location is not configured. Please add your restaurant address in your Profile before publishing a donation."
        )

    coords = payload.pickupLocation.coordinates
    if len(coords) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup coordinates must be [longitude, latitude]"
        )

    lon, lat = coords[0], coords[1]
    if not (-180.0 <= lon <= 180.0) or not (-90.0 <= lat <= 90.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid coordinates range: longitude [-180, 180], latitude [-90, 90]"
        )

    donation_id = f"DON-2026-{uuid.uuid4().hex[:6].upper()}"
    now_iso = datetime.utcnow().isoformat() + "Z"

    # Full document snapshot
    doc = {
        "id": donation_id,
        "foodName": payload.foodName.strip(),
        "category": payload.category,
        "dietary": payload.dietary or "Vegetarian",
        "quantity": float(payload.quantity),
        "unit": payload.unit or "meals",
        "description": payload.description or "",
        "preparedAt": payload.preparedAt,
        "expiresAt": payload.expiresAt,
        # Immutable location snapshot
        "pickupAddress": payload.pickupAddress.strip(),
        "pickupLocation": {
            "type": "Point",
            "coordinates": [float(lon), float(lat)]
        },
        "pickupInstructions": payload.pickupInstructions or "",
        "freshnessDeclaration": payload.freshnessDeclaration,
        "restaurantId": payload.restaurantId or "user-rest-101",
        "restaurantName": payload.restaurantName or "Restaurant Partner",
        "status": "available",
        "claimedBy": None,
        "claimedAt": None,
        "createdAt": now_iso
    }

    db = get_db()
    if db is not None and check_database_connection():
        try:
            db["donations"].insert_one(dict(doc))
            # Remove MongoDB's ObjectId from response dict
            if "_id" in doc:
                del doc["_id"]
            _FALLBACK_DONATIONS.insert(0, doc)
            return doc
        except Exception as e:
            pass

    _FALLBACK_DONATIONS.insert(0, doc)
    return doc


@router.get("", response_model=List[DonationResponse])
def list_donations(
    restaurant_id: Optional[str] = Query(None, description="Filter by restaurant ID"),
    status_filter: Optional[str] = Query(None, description="Filter by status (e.g. available, claimed)")
):
    """
    List food donations with location snapshots.
    """
    db = get_db()
    if db is not None and check_database_connection():
        try:
            query = {}
            if restaurant_id:
                query["restaurantId"] = restaurant_id
            if status_filter and status_filter != "all":
                query["status"] = status_filter
            cursor = db["donations"].find(query).sort("createdAt", -1)
            results = []
            for item in cursor:
                item["_id"] = str(item.get("_id", ""))
                results.append(item)
            if results:
                return results
        except Exception:
            pass

    # Fallback filtering
    res = _FALLBACK_DONATIONS
    if restaurant_id:
        res = [d for d in res if d.get("restaurantId") == restaurant_id]
    if status_filter and status_filter != "all":
        res = [d for d in res if d.get("status") == status_filter]
    return res


@router.get("/{donation_id}", response_model=DonationResponse)
def get_donation(donation_id: str):
    """
    Retrieve single donation by ID with its location snapshot.
    """
    db = get_db()
    if db is not None and check_database_connection():
        try:
            doc = db["donations"].find_one({"id": donation_id})
            if doc:
                doc["_id"] = str(doc.get("_id", ""))
                return doc
        except Exception:
            pass

    for d in _FALLBACK_DONATIONS:
        if d.get("id") == donation_id:
            return d

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Donation {donation_id} not found"
    )

