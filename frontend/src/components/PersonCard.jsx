function PersonCard({
  id,
  name,
  interests,
  budget,
  onEdit,
  onDelete,
  onFindGift,
}) {
  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${name}?`,
    );

    if (!confirmed) {
      return;
    }

    await onDelete(id);
  }

  return (
    <article className="person-card">
      <h3>{name}</h3>

      <div className="interests">
        {interests.map((interest) => (
          <span key={interest}>{interest}</span>
        ))}
      </div>

      <p>Gift budget: €{budget}</p>

      <div className="card-actions">
        <button onClick={() => onEdit(id)}>Edit</button>

        <button onClick={handleDelete}>Delete</button>
      </div>

      <button className="gift-button" onClick={() => onFindGift(id)}>
        Find a gift →
      </button>
    </article>
  );
}

export default PersonCard;
