function PersonCard({ name, interests, budget }) {
    return (
        <article>
            <h3>{name}</h3>

            <div>
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