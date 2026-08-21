function EditPersonForm({ person, onUpdatePerson, onCancel }) {
    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get("name");

        const interests = formData
            .get("interests")
            .split(",")
            .map((interest) => interest.trim())
            .filter(Boolean);

        const budget = Number(formData.get("budget"));

        const updatedPerson = {
            id: person.id,
            name,
            interests,
            budget,
        };

        onUpdatePerson(updatedPerson);
    }

    return (
        <form className="person-form" onSubmit={handleSubmit}>
            <h2>Edit person</h2>

            <label>
                Name
                <input
                    type="text"
                    name="name"
                    defaultValue={person.name}
                    required 
                />
            </label>

            <label>
                Interests
                <input
                    type="text"
                    name="interests"
                    defaultValue={person.interests.join(", ")}
                    required 
                />
            </label>

            <label>
                Gift budget
                <input 
                    type="number"
                    name="budget"
                    defaultValue={person.budget}
                    min="0"
                    required
                />
            </label>

            <div className="form-actions">
                <button type="button" onClick={onCancel}>Cancel</button>

                <button type="submit">Save changes</button>
            </div>
        </form>
    );
}

export default EditPersonForm;