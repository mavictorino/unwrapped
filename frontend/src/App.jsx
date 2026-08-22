import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import PersonCard from "./components/PersonCard";
import AddPersonForm from "./components/AddPersonForm";
import EditPersonForm from "./components/EditPersonForm";

function App() {
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [peopleError, setPeopleError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/people")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch people");
        }

        return response.json();
      })
      .then((data) => {
        setPeople(data);
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
        setPeopleError("We couldn't load your people.");
      })
      .finally(() => {
        setLoadingPeople(false);
      });
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [giftSuggestions, setGiftSuggestions] = useState(null);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [giftError, setGiftError] = useState(null);

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

  async function handleFindGift(personId) {
    setLoadingGifts(true);
    setGiftSuggestions(null);
    setGiftError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/people/${personId}/gifts`,
      );

      if (!response.ok) {
        throw new Error("Failed to find gifts");
      }

      const data = await response.json();

      setGiftSuggestions(data);
    } catch (error) {
      console.error("Error finding gifts:", error);
      setGiftError("We couldn't find gift suggestions right now.");
    } finally {
      setLoadingGifts(false);
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

        {loadingPeople && (
          <section className="people-section">
            <h2>Your people</h2>
            <p>Loading your people...</p>
          </section>
        )}

        {peopleError && (
          <section className="people-section">
            <h2>Oops, something went wrong.</h2>
            <p>{peopleError}</p>
          </section>
        )}

        {!loadingPeople && !peopleError && (
          <section className="people-section">
            <h2>Your people</h2>

            {people.length === 0 ? (
              <div className="empty-state">
                <h3>No people yet.</h3>
                <p>Add someone to start finding thoughtful gifts.</p>
              </div>
            ) : (
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
                    onFindGift={handleFindGift}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {loadingGifts && (
          <section className="gift-section">
            <div className="gift-panel">
              <p className="eyebrow">GIFT MATCH</p>
              <h2>Finding the perfect gift...</h2>
              <p>
                We're matching their interests with gifts within the budget ;)
              </p>
            </div>
          </section>
        )}

        {giftError && (
          <section className="gift-section">
            <div className="gift-panel">
              <p className="eyebrow">GIFT MATCH</p>

              <h2>Oops, something went wrong!</h2>

              <p>{giftError}</p>
            </div>
          </section>
        )}

        {giftSuggestions && (
          <section className="gift-section">
            <div className="gift-panel">
              <button
                className="close-gifts"
                onClick={() => setGiftSuggestions(null)}
              >
                x
              </button>

              <p className="eyebrow">GIFT MATCH</p>

              <h2>Gift ideas for {giftSuggestions.person.name}</h2>

              <p>
                Based on their interests and a budget of €{" "}
                {giftSuggestions.person.budget}
              </p>

              <div className="gift-list">
                {giftSuggestions.gifts.map((gift) => (
                  <article className="gift-card" key={gift.id}>
                    <div>
                      <span className="gift-match">{gift.match}</span>

                      <h3>{gift.name}</h3>

                      <span>{gift.category}</span>
                    </div>

                    <strong>€{gift.price}</strong>
                  </article>
                ))}
              </div>

              {giftSuggestions.gifts.length === 0 && (
                <div>
                  <h3>No perfect match yet.</h3>
                  <p>
                    We couldn't find a gift that matches their interests and
                    fits within this budget.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
