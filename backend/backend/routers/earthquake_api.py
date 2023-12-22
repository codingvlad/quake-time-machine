from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from models import EarthquakeBase, EarthquakeGeodataTable
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db

apiRouter = APIRouter()


@apiRouter.get("/earthquakes/", response_model=List[EarthquakeBase])
def read_earthquakes(
    skip: int = Query(0, ge=0, description="Skip items"),
    limit: int = Query(10, le=100, description="Limit items"),
    milliseconds: int = Query(
        None, title="Filter earthquakes after the given timestamp in milliseconds"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(EarthquakeGeodataTable)

    try:
        timestamp = None
        if milliseconds is not None:
            timestamp = datetime.utcfromtimestamp(milliseconds / 1000.0)

        query = db.query(EarthquakeGeodataTable).order_by(
            EarthquakeGeodataTable.instant
        )

        # Apply the timestamp filter if provided
        if timestamp is not None:
            query = query.filter(EarthquakeGeodataTable.instant >= timestamp)

        query = query.offset(skip).limit(limit)

        # Execute the query
        result = query.all()
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@apiRouter.post("/earthquakes/", response_model=EarthquakeBase)
def create_earthquake(
    earthquake: dict,
    db: Session = Depends(get_db),
):
    db_earthquake = EarthquakeGeodataTable(**earthquake)
    db.add(db_earthquake)
    db.commit()
    db.refresh(db_earthquake)
    return db_earthquake


@apiRouter.get("/earthquakes/{earthquake_id}")
def read_earthquake(earthquake_id: int, db: Session = Depends(get_db)):
    db_earthquake = (
        db.query(EarthquakeGeodataTable)
        .filter(EarthquakeGeodataTable.id == earthquake_id)
        .first()
    )

    if not db_earthquake:
        raise HTTPException(status_code=404, detail="Earthquake not found")

    return db_earthquake


@apiRouter.delete("/earthquakes/{earthquake_id}")
def delete_earthquake(earthquake_id: str, db: Session = Depends(get_db)):
    db_earthquake = (
        db.query(EarthquakeGeodataTable)
        .filter(EarthquakeGeodataTable.id == earthquake_id)
        .first()
    )

    if not db_earthquake:
        raise HTTPException(status_code=404, detail="Earthquake not found")

    db.delete(db_earthquake)
    db.commit()

    return {"message": "Earthquake deleted successfully"}


@apiRouter.put("/earthquakes/{earthquake_id}")
def update_earthquake(
    earthquake_id: str,
    earthquake_update: EarthquakeBase,
    db: Session = Depends(get_db),
):
    db_earthquake = (
        db.query(EarthquakeGeodataTable)
        .filter(EarthquakeGeodataTable.id == earthquake_id)
        .first()
    )

    if not db_earthquake:
        raise HTTPException(status_code=404, detail="Earthquake not found")

    db_earthquake.instant = earthquake_update.instant
    db_earthquake.geojson = earthquake_update.geojson

    db.commit()

    return {"message": "Earthquake updated successfully"}
