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

@app.post("/people")
def add_person(person: dict):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO people (name, interests, budget)
        VALUES (%s, %s, %s)
        RETURNING id, name, interests, budget
        """,
        (
            person["name"],
            person["interests"],
            person["budget"],
        ),
    )

    row = cursor.fetchone()

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "id": row[0],
        "name": row[1],
        "interests": row[2],
        "budget": float(row[3]),
    }

@app.delete("/people/{person_id}")
def delete_person(person_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM people WHERE id = %s RETURNING id", (person_id,),
    )

    deleted_person = cursor.fetchone()

    if deleted_person is None:
        cursor.close()
        connection.close()

        return {"error: Person not found!"}

    connection.commit()

    cursor.close()
    connection.close()

    return {"message": "Person deleted", "id": deleted_person[0]}

@app.put("/people/{person_id}")
def update_person(person_id: int, person: dict):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE people
        SET name = %s,
            interests = %s,
            budget = %s
        WHERE id = %s
        RETURNING id, name, interests, budget
        """,
        (
            person["name"],
            person["interests"],
            person["budget"],
            person_id,
        ),
    )

    row = cursor.fetchone()

    if row is None:
        cursor.close()
        connection.close()

        return {"error": "Person not found"}

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "id": row[0],
        "name": row[1],
        "interests": row[2],
        "budget": float(row[3]),
    }