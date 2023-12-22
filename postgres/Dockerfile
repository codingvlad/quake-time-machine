# Use the official Postgres image as a base image
FROM postgres:latest

ENV POSTGRES_USER=test
ENV POSTGRES_PASSWORD=test

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment
RUN python3 -m venv /venv

# Activate the virtual environment
ENV PATH="/venv/bin:$PATH"

# Install psycopg2 library
RUN pip install psycopg2-binary

# Copy initialization scripts to the container
COPY init-scripts/* /docker-entrypoint-initdb.d/

# Copy post init Python script to the container
COPY post-init-scripts/ /tmp/bin/
COPY data/ /tmp/

# Expose the default PostgreSQL port
EXPOSE 5432