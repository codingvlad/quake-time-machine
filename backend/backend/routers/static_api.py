from fastapi import APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

frontend_path = Path(__file__).parent.parent.parent.parent / "frontend" / "dist"
geojson_data_path = Path(__file__).parent.parent.parent / "data" / "geojson"


def mount_static_files(app):
    # Serve the Angular app from the "frontend/dist" directory
    app.mount(
        "/frontend", StaticFiles(directory=frontend_path, html=True), name="frontend"
    )
    # Serve the data from the "data" directory
    app.mount("/geojson-data", StaticFiles(directory=geojson_data_path), name="data")


apiRouter = APIRouter()


@apiRouter.get("/frontend/{path}", response_class=FileResponse)
async def serve_frontend():
    return FileResponse(frontend_path / "index.html")


@apiRouter.get("/geojson/{file_name}")
async def get_geojson(file_name: str):
    file_path = Path(geojson_data_path) / file_name
    return FileResponse(file_path, media_type="application/json")
