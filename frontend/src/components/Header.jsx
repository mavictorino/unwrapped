function Header({ onAddPerson }) {
    return (
        <header className="header">
            <a href="/" className="logo"> 🎁 Unrapped </a>

            <button className="header-button" onClick={onAddPerson}>
                + Add person
            </button>
        </header>
    )
}

export default Header