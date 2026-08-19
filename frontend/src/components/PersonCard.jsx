function PersonCard({ name, interests, budget }) {
    return (
        <article className="person-card">
            <h3>{name}</h3>

            <div className="interests">
                {interests.map((interest) => (
                    <span key={interest}>{interest}</span>
                ))}
            </div>

            <p>Gift budget: €{budget}</p>

            <button>Find a gift →</button>
        </article>
    )
}

export default PersonCard