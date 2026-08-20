import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import PersonCard from "./components/PersonCard";
import AddPersonForm from "./components/AddPersonForm";

function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/people")
    .then((response) => response.json())
    .then((data) => {
      setPeople(data);
    })
    .catch((error) => {
      console.error("Error fetching people:", error)
    });
  }, []);

  const [showForm, setShowForm] = useState(false);

  function handleAddPerson(newPerson) {
    setPeople((currentPeople) => [...currentPeople, newPerson]);

    setShowForm(false);
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

        <section className="people-section">
          <h2>Your people</h2>

          <div className="people-grid">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                interests={person.interests}
                budget={person.budget}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
