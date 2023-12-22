CREATE DATABASE quakedata;

\c quakedata

CREATE TABLE quakes_geodata (
    id varchar PRIMARY KEY,
    instant timestamp, 
    cluster integer,
    geojson jsonb
);