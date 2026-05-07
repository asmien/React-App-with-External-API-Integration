import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-logo">
        <h2>EventSphere ✦</h2>
      </div>

      <nav className="navbar-links">
        <a href="/">Discover</a>
        <a href="/">Categories</a>
        <a href="/">Venues</a>
        <a href="/">Saved</a>
      </nav>

    </header>
  );
}

export default Navbar;