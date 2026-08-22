# 🎁 Unwrapped

**Thoughtful gifts, without the guesswork.**

Unwrapped is a full-stack gift recommendation application that helps users find personalized gift ideas based on a person's interests and budget.

![Descrição da imagem](./screenshots/print%201.png)

The application combines a **React frontend**, a **FastAPI backend**, and a **PostgreSQL database** to manage people, gifts, and personalized recommendations.

> Built as a full-stack project to practice CRUD operations, relational databases, REST APIs, recommendation logic, and frontend state management.

---

## ✨ Features

### People management

* Add a person with their interests and gift budget
* Edit existing people
* Delete people
* Store people permanently in PostgreSQL

![Descrição da imagem](./screenshots/print%202.png)

### Gift recommendations

* Store gifts in PostgreSQL
* Match gifts with a person's interests
* Filter gifts according to their budget
* Calculate a recommendation score
* Classify recommendations as:

  * **Best Match**
  * **Great Match**
  * **Good Match**
* Display recommendations dynamically in the React interface

![Descrição da imagem](./screenshots/print%203.png)

### User experience

* Loading states
* Error states
* Empty states
* Responsive design
* Mobile-friendly layout

---

## 🧠 How the recommendation algorithm works

Unwrapped uses a simple scoring system to rank potential gifts.

A gift must first satisfy two conditions:

1. Its category must match one of the person's interests.
2. Its price must be within the person's budget.

Matching gifts then receive a score based on their price relative to the person's budget.

![Descrição da imagem](./screenshots/print%204.png)


The current scoring logic starts with a base score and gives additional points to gifts that use a smaller proportion of the available budget.

The resulting scores are translated into user-friendly match classifications:

| Score | Classification |
| ----- | -------------- |
| 5     | Best Match     |
| 4     | Great Match    |
| 3     | Good Match     |

The gifts are then sorted by score so that the strongest recommendations appear first.

This approach keeps the recommendation logic transparent and easy to extend.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### Database

* PostgreSQL

---

## 🏗️ Architecture

The application follows a simple client-server architecture:

```text
┌──────────────────────┐
│      React App       │
│      Frontend        │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           ▼
┌──────────────────────┐
│      FastAPI         │
│       Backend        │
└──────────┬───────────┘
           │
           │ SQL
           ▼
┌──────────────────────┐
│     PostgreSQL       │
│                      │
│  people    gifts     │
└──────────────────────┘
```

The frontend communicates with the FastAPI API, while the backend handles database operations and recommendation logic.

---

## 🚀 Running the project locally

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd unwrapped
```

### 2. Set up PostgreSQL

Create a PostgreSQL database named:

```text
unwrapped
```

Create the required `people` and `gifts` tables and populate the `gifts` table with the available gift options.

---

### 3. Configure environment variables

Inside the `backend` directory, create a `.env` file:

```env
DB_NAME=unwrapped
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

---

### 4. Set up the backend

From the `backend` directory:

```bash
python -m venv .venv
```

Activate the virtual environment.

On Windows:

```bash
.venv\Scripts\activate
```

Install the dependencies:

```bash
pip install fastapi uvicorn psycopg python-dotenv
```

Start the API:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

### 5. Set up the frontend

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/people`                   | Retrieve all people           |
| POST   | `/people`                   | Add a person                  |
| PUT    | `/people/{person_id}`       | Update a person               |
| DELETE | `/people/{person_id}`       | Delete a person               |
| GET    | `/people/{person_id}/gifts` | Generate gift recommendations |

---

## 📸 Screenshots

Screenshots of the application will be added here.

### Main dashboard

*Add screenshot here*

### Gift recommendations

*Add screenshot here*

### Mobile view

*Add screenshot here*

---

## 🔮 Future Improvements

Possible future iterations include:

* More sophisticated recommendation scoring
* Multiple factors in the recommendation algorithm
* Gift search and filtering
* User authentication
* Persistent user accounts
* Ability to save favorite gifts
* Improved recommendation explanations
* AI integration

---

## 🎯 What I Practiced

This project helped me work across the full stack, including:

* Designing and querying a PostgreSQL database
* Building REST APIs with FastAPI
* Connecting Python applications to PostgreSQL
* Implementing CRUD operations
* Building reusable React components
* Managing asynchronous API requests
* Managing loading, error, and empty states
* Designing a basic recommendation algorithm
* Connecting frontend state to backend data

