function AddPersonForm({ onAddPerson, onCancel }) {
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const interests = formData
    .get("interests")
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean);

    const budget = Number(formData.get("budget"));

    const newPerson = {
      name,
      interests,
      budget,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/people", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      });

      if (!response.ok) {
        throw new Error("Failed to add person");
      }
      
      const savedPerson = await response.json();

      onAddPerson(savedPerson);

      event.target.reset();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  }
  return (
    <form className="person-form" onSubmit={handleSubmit}>
      <h2>Add a person</h2>

      <label>
        Name
        <input 
        type="text" 
        name="name" 
        placeholder="ex. Maria" 
        required 
        />
      </label>

      <label>
        Interestes 
        <input 
        type="text"
        name="interests"
        placeholder="ex. Coffee, Books, Travel"
        required
        />
      </label>

      <label>
        Gift budget
        <input
        type="number"
        name="budget"
        placeholder="40"
        min="0"
        required 
        />
      </label>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
            Cancel
        </button>

        <button type="submit">
            Add person
        </button>
      </div>
    </form>
  );
}

export default AddPersonForm