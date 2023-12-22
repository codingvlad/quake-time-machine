# Earthquake Data Backend

This Python project serves as the backend for a web application that provides an API for managing earthquake data. The application supports basic CRUD operations for earthquake records, listing earthquakes, and serving static files for the frontend implemented in Angular. Additionally, it serves static files for GeoJSON countries data.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Static Files](#static-files)

## Features

1. **CRUD Operations:**
   - Create, Read, Update, and Delete earthquake data through the API.
2. **Listing Earthquakes:**
   - Retrieve a list of earthquakes with details.
3. **Static Files for Frontend:**
   - Serve static files for the Angular frontend.
4. **Static Files for GeoJSON Countries Data:**
   - Provide static GeoJSON files containing countries' geographic data.

## Setup

### Prerequisites

- Python 3.x installed
- Poetry installed
- Virtual environment (optional but recommended)

### Installation

1. Change working directory:

   ```bash
   cd earthquake-backend
   ```

2. Create a virtual environment (optional but recommended):

   ```bash
   python3 -m venv venv

   ```

3. Activate the virtual environment:
   On Windows:

   ```bash
   venv\Scripts\activate
   ```

   On macOS/Linux:

   ```bash
   source venv/bin/activate
   ```

4. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

### Running the Application

```bash
   poetry run python app.py
```

Visit http://localhost:8000/frontend.

### API Endpoints

GET /earthquakes: Get a list of all earthquakes.
GET /earthquakes/{id}: Get details of a specific earthquake.
POST /earthquakes: Create a new earthquake record.
PUT /earthquakes/{id}: Update details of a specific earthquake.
DELETE /earthquakes/{id}: Delete a specific earthquake record.

### Static Files

#### Frontend Files:

Hosted at http://localhost:8000/frontend

#### GeoJSON Countries Data:

Hosted at http://localhost:5000/geojson-data
