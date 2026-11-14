from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from app.database.connection import get_db, check_database_connection
from app.schemas.profile import ProfileLocationUpdate, UserProfile, RestaurantLocationUpdate, RestaurantProfile

router = APIRouter()

# In-memory storage fallback if MongoDB daemon is not running locally
_FALLBACK_PROFILES = {
    "user-rest-101": {
        "id": "user-rest-101",
        "name": "Vikram Sethi",
        "email": "contact@royalkitchen.com",
        "role": "restaurant",
        "organizationName": "The Royal Kitchen & Caterers",
        "phone": "+91 98201 44521",
        "address": "42 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
        "location": {
            "type": "Point",
            "coordinates": [72.8295, 18.9986]  # [longitude, latitude]
        },
        "fssaiLicense": "11521018000452",
        "openingHours": "10:00 AM - 11:30 PM",
        "updatedAt": datetime.utcnow().isoformat()
    },
    "user-shel-202": {
        "id": "user-shel-202",
        "name": "Priya Sharma",
        "email": "info@anandamfoundation.org",
        "role": "shelter",
        "organizationName": "Anandam Food Relief Shelter",
        "phone": "+91 99302 77810",
        "address": "Plot 18, Near King Circle Railway Station, Matunga, Mumbai 400019",
        "location": {
            "type": "Point",
            "coordinates": [72.8561, 19.0269]  # [longitude, latitude]
        },
        "ngoRegistration": "NGO-MH-2022-0941",
        "beneficiaryCount": "150-200 daily meals",
        "vehicleAvailable": True,
        "operatingHours": "08:00 AM - 10:00 PM",
        "storageFacilities": "Commercial Cold Room (4°C) & Insulated Hot Cambros",
        "darpanId": "MH/2022/0319482",
        "updatedAt": datetime.utcnow().isoformat()
    }
}


@router.get("/{user_id}", response_model=UserProfile)
def get_user_profile(user_id: str):
    """
    Fetch organization profile (restaurant or shelter) including configured address and geographical coordinates.
    """
    db = get_db()
    if db is not None and check_database_connection():
        try:
            # Check users, restaurants, or shelters collection
            for coll_name in ["users", "restaurants", "shelters"]:
                doc = db[coll_name].find_one({"id": user_id})
                if doc:
                    doc["_id"] = str(doc.get("_id", ""))
                    return doc
        except Exception as e:
            pass

    if user_id in _FALLBACK_PROFILES:
        return _FALLBACK_PROFILES[user_id]

    # Return default template if user ID not yet initialized
    return {
        "id": user_id,
        "organizationName": "Partner Organization",
        "address": None,
        "location": None,
        "role": "shelter" if "shel" in user_id.lower() else "restaurant"
    }


@router.put("/{user_id}/location", response_model=UserProfile)
def update_user_location(user_id: str, payload: ProfileLocationUpdate):
    """
    Update the organization's receiving or pickup address and GeoJSON coordinates.
    GeoJSON coordinates must strictly follow [longitude, latitude] order.
    """
    if not payload.address or not payload.address.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Address cannot be empty"
        )

    coords = payload.location.coordinates
    if len(coords) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GeoJSON coordinates must be [longitude, latitude]"
        )

    lon, lat = coords[0], coords[1]
    if not (-180.0 <= lon <= 180.0) or not (-90.0 <= lat <= 90.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid coordinates range: longitude [-180, 180], latitude [-90, 90]"
        )

    update_fields = {
        "address": payload.address.strip(),
        "location": {
            "type": "Point",
            "coordinates": [float(lon), float(lat)]
        },
        "updatedAt": datetime.utcnow().isoformat()
    }

    if payload.organizationName:
        update_fields["organizationName"] = payload.organizationName
    if payload.name:
        update_fields["name"] = payload.name
    if payload.email:
        update_fields["email"] = payload.email
    if payload.phone:
        update_fields["phone"] = payload.phone
    if payload.role:
        update_fields["role"] = payload.role
    if payload.fssaiLicense is not None:
        update_fields["fssaiLicense"] = payload.fssaiLicense
    if payload.openingHours is not None:
        update_fields["openingHours"] = payload.openingHours
    if payload.ngoRegistration is not None:
        update_fields["ngoRegistration"] = payload.ngoRegistration
    if payload.beneficiaryCount is not None:
        update_fields["beneficiaryCount"] = payload.beneficiaryCount
    if payload.vehicleAvailable is not None:
        update_fields["vehicleAvailable"] = payload.vehicleAvailable
    if payload.storageFacilities is not None:
        update_fields["storageFacilities"] = payload.storageFacilities
    if payload.darpanId is not None:
        update_fields["darpanId"] = payload.darpanId

    db = get_db()
    if db is not None and check_database_connection():
        try:
            coll_name = "shelters" if "shel" in user_id.lower() or payload.role == "shelter" else "restaurants"
            db[coll_name].update_one(
                {"id": user_id},
                {"$set": update_fields, "$setOnInsert": {"id": user_id, "role": payload.role or ("shelter" if coll_name == "shelters" else "restaurant")}},
                upsert=True
            )
            saved = db[coll_name].find_one({"id": user_id})
            if saved:
                saved["_id"] = str(saved.get("_id", ""))
                _FALLBACK_PROFILES[user_id] = saved
                return saved
        except Exception as e:
            pass

    # Save to memory fallback
    if user_id not in _FALLBACK_PROFILES:
        _FALLBACK_PROFILES[user_id] = {
            "id": user_id,
            "organizationName": payload.organizationName or "Partner Organization",
            "role": payload.role or ("shelter" if "shel" in user_id.lower() else "restaurant")
        }
    _FALLBACK_PROFILES[user_id].update(update_fields)
    return _FALLBACK_PROFILES[user_id]


@router.put("/{user_id}", response_model=UserProfile)
def update_full_profile(user_id: str, payload: ProfileLocationUpdate):
    """Update complete profile details."""
    return update_user_location(user_id, payload)
