import "./Navbar.css";

function NavBar() {

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <h2>EventSphere</h2>
        </div>

        
      </div>

      <div className="navbar-right">
        <nav className="navbar-secondary-nav">
          <a href="/explore">Explore</a>
          <a href="/saved">Favorites</a>
        </nav>

        <div className="navbar-auth">
          <a href="/signin" className="navbar-signin">
            Sign in
          </a>
          <a href="/signup" className="navbar-signup">
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}

export default NavBar;