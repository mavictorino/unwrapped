from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to Unwrapped API"}


@app.get("/people")
def get_people():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT id, name, interests, budget
        FROM people
        ORDER BY id
    """)
    rows = cursor.fetchall()
    cursor.close()

    people = []

    for row in rows:
        
        person = {
            "id": row[0],
            "name": row[1],
            "interests": row[2],
            "budget": float(row[3])
        }

        people.append(person)

    return people