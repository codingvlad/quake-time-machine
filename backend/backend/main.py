from fastapi import FastAPI
from routers import earthquake_api, static_api


def start_application():
    app = FastAPI()
    static_api.mount_static_files(app)
    app.include_router(static_api.apiRouter)
    app.include_router(earthquake_api.apiRouter)
    return app


app = start_application()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
