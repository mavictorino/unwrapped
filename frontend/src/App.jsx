import "./App.css";
import Header from "./components/Header";
import PersonCard from "./components/PersonCard";

function App() {
  const people = [
    {
      name: "Ana",
      interests: ["Coffee", "Books", "Travel"],
      budget: 40,
    },
    {
      name: "Leo",
      interests: ["Gaming", "Music", "Sports"],
      budget: 50,
    },
  ];

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <p className="eyebrow">THE ART OF GIFTING</p>

          <h1>
            Thoughtful gifts,
            <br />
            without the guesswork.
          </h1>

          <p>
            Find something they'll actually love!
          </p>

          <button>Find a gift ✨</button>
        </section>

        <section className="people-section">
          <h2>Your people</h2>

          <div>
            {people.map((person) => (
              <PersonCard
              key={person.name}
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
