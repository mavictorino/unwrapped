from fastapi import FastAPI

app = FastAPI()


people = [
    {
        "id": 1,
        "name": "Ana",
        "interests": ["Coffee", "Books", "Travel"],
        "budget": 40,
    },
    {
        "id": 2,
        "name": "João",
        "interests": ["Gaming", "Music", "Sports"],
        "budget": 50,
    },
]


@app.get("/")
def home():
    return {"message": "Welcome to Unwrapped API"}


@app.get("/people")
def get_people():
    return people