from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI()

gifts = [
    {
        "id": 1,
        "name": "Coffee subscription",
        "category": "Coffee",
        "price": 25,
    },
    {
        "id": 2,
        "name": "Special edition book",
        "category": "Books",
        "price": 30,
    },
    {
        "id": 3,
        "name": "Travel journal",
        "category": "Travel",
        "price": 20,
    },
    {
        "id": 4,
        "name": "Gaming headset",
        "category": "Gaming",
        "price": 45,
    },
    {
        "id": 5,
        "name": "Vinyl record",
        "category": "Music",
        "price": 35,
    },
    {
        "id": 6,
        "name": "Sports water bottle",
        "category": "Sports",
        "price": 18,
    },
]

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

@app.get("/people/{person_id}/gifts")
def get_gift_suggestions(person_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, name, interests, budget
        FROM people
        WHERE id = %s
        """,
        (person_id,),
    )

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row is None:
        return {"error": "Person not found"}

    person_interests = row[2]
    person_budget = float(row[3])

    suggestions = []

    for gift in gifts:
        if gift["category"] not in person_interests:
            continue

        if gift["price"] > person_budget:
            continue

        score = 3

        if gift["price"] <= person_budget * 0.5:
            score += 2

        if score >= 5:
            match = "Best Match"
        elif score >= 3:
            match = "Good Match"
        else:
            match = "Possible Match"

        gift_with_score = {
            **gift,
            "score": score,
            "match": match,
        }

        suggestions.append(gift_with_score)

    suggestions.sort(key=lambda gift: gift["score"], reverse=True)

    return {
        "person": {
            "id": row[0],
            "name": row[1],
            "interests": person_interests,
            "budget": person_budget,
        },
        "gifts": suggestions,
    }