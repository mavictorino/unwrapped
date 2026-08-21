import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import PersonCard from "./components/PersonCard";
import AddPersonForm from "./components/AddPersonForm";
import EditPersonForm from "./components/EditPersonForm";

function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/people")
      .then((response) => response.json())
      .then((data) => {
        setPeople(data);
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
      });
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  function handleAddPerson(newPerson) {
    setPeople((currentPeople) => [...currentPeople, newPerson]);

    setShowForm(false);
  }

  function handleEditPerson(id) {
    const person = people.find((person) => person.id === id);

    setEditingPerson(person);
    setShowForm(false);
  }

  async function handleDeletePerson(id) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/people/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete person");
      }

      setPeople((currentPeople) =>
        currentPeople.filter((person) => person.id !== id),
      );
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  }

  async function handleUpdatePerson(updatedPerson) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/people/${updatedPerson.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedPerson.name,
            interests: updatedPerson.interests,
            budget: updatedPerson.budget,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update person");
      }

      const savedPerson = await response.json();

      setPeople((currentPeople) =>
        currentPeople.map((person) =>
          person.id === savedPerson.id ? savedPerson : person,
        ),
      );

      setEditingPerson(null);
    } catch (error) {
      console.error("Error updating person:", error);
    }
  }

  return (
    <>
      <Header onAddPerson={() => setShowForm(true)} />

      <main>
        <section className="hero">
          <p className="eyebrow">THE ART OF GIFTING</p>

          <h1>
            Thoughtful gifts,
            <br />
            without the guesswork.
          </h1>

          <p>Find something they'll actually love!</p>

          <button>Find a gift ✨</button>
        </section>

        {showForm && (
          <section className="form-section">
            <AddPersonForm
              onAddPerson={handleAddPerson}
              onCancel={() => setShowForm(false)}
            />
          </section>
        )}

        {editingPerson && (
          <section>
            <EditPersonForm
              person={editingPerson}
              onUpdatePerson={handleUpdatePerson}
              onCancel={() => setEditingPerson(null)}
            />
          </section>
        )}

        <section className="people-section">
          <h2>Your people</h2>

          <div className="people-grid">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                id={person.id}
                name={person.name}
                interests={person.interests}
                budget={person.budget}
                onEdit={handleEditPerson}
                onDelete={handleDeletePerson}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
