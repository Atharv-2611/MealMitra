from typing import Literal, List
from pydantic import BaseModel, Field, field_validator


class GeoJSONPoint(BaseModel):
    """
    Standard GeoJSON Point model.
    Must always follow [longitude, latitude] order per RFC 7946 and MongoDB specifications.
    """
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(
        ...,
        description="Coordinates in [longitude, latitude] order",
        examples=[[73.8567, 18.5204]]
    )

    @field_validator("coordinates")
    @classmethod
    def validate_coords(cls, v: List[float]) -> List[float]:
        if len(v) != 2:
            raise ValueError("Coordinates must contain exactly 2 elements: [longitude, latitude]")
        lon, lat = v[0], v[1]
        if not (-180.0 <= lon <= 180.0):
            raise ValueError(f"Longitude {lon} must be between -180 and 180")
        if not (-90.0 <= lat <= 90.0):
            raise ValueError(f"Latitude {lat} must be between -90 and 90")
        return [float(lon), float(lat)]

