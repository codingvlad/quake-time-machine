# Postgres Docker Image

This folder contains the necessary files to build a Docker image for the Postgres component of the Quake Time Machine web application. The Docker image includes the Postgres instance, data, and scripts required for initialization and data ingestion.

## Building the Docker Image

To build the Docker image, follow these steps:

1. Navigate to the `postgres` folder in the repository.

```bash
cd postgres
```

2. Run the following command:

```bash
docker build --no-cache  -t postgres-quake-data .
```

## Running the Docker Container

Once the Docker image is built, you can run a Docker container using the following command:

```bash
docker run -p 5432:5432 --name postgres-quake-data -d postgres-quake-data
```

## Ingesting Data

The Docker image includes scripts for initializing and ingesting data. To perform these actions, run the command:

```bash
docker exec postgres-quake-data python3 /tmp/bin/ingest_geodata.py
```

This script uses the data included in the /tmp directory.
Now, the Postgres component should be initialized and populated with earthquakes data.

## Notes

Ensure that Docker is installed on your machine before following these steps.
