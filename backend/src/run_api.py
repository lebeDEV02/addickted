import uvicorn

from addickted.api.core import app



if __name__ == "__main__":
    uvicorn.run(app, port=1337)