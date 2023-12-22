import json
import psycopg2
from psycopg2.extras import Json
from pathlib import Path
from datetime import datetime


def parse_datetime(date_str, time_str):
    # The given geodata contains two date/time formats
    # Attempt to parse as %m%d%y and %H:%M:%S
    try:
        date_format = "%m/%d/%Y %H:%M:%S"
        parsed_datetime = datetime.strptime(f"{date_str} {time_str}", date_format)
        return parsed_datetime
    except ValueError:
        pass

    # Attempt to parse as ISO 8601 format
    try:
        parsed_datetime = datetime.fromisoformat(date_str)
        return parsed_datetime
    except ValueError:
        pass

    raise ValueError("Invalid date and time format", f"{date_str} {time_str}")


data_path = Path(__file__).parent.parent / "data" / "geojson"
input_file = Path(data_path) / "clustered_earthquakes.geojson"

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname="quakedata",
    user="test",
    password="test",
    host="localhost",
    port="5432",
)

# Open a cursor to perform database operations
cur = conn.cursor()

# Read GeoJSON file
with open(input_file, "r") as geojson_file:
    data = json.load(geojson_file)

# Prepare a list of tuples for bulk insert
bulk_data = [
    (
        feature["properties"]["ID"],
        parse_datetime(feature["properties"]["Date"], feature["properties"]["Time"]),
        feature["cluster"],
        Json(feature),
    )
    for feature in data["features"]
]

# Perform bulk insert
insert_query = "INSERT INTO quakes_geodata (id, instant, cluster, geojson) VALUES (%s, %s, %s, %s);"
cur.executemany(insert_query, bulk_data)

# Commit the transaction
conn.commit()

# Close communication with the database
cur.close()
conn.close()
