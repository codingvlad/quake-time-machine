from sqlalchemy import Column, Integer, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from datetime import datetime

Base = declarative_base()


class EarthquakeBase(BaseModel):
    id: str
    instant: datetime
    cluster: int
    geojson: dict


class EarthquakeGeodataTable(Base):
    __tablename__ = "quakes_geodata"

    id = Column(Integer, primary_key=True, index=True)
    instant = Column(DateTime)
    cluster = Column(Integer)
    geojson = Column(JSON)
