import "./SearchHero.css";

function SearchHero() {
  return (
    <section className="search-hero">
      <h1>Discover Amazing Events Near You</h1>
      <p>
        Find Concerts, Conferences, Festivals, Tech events and unforgettable experiences.
      </p>

      <div className="search-box">
        <input type="text" placeholder="Search events..." />
        <button>Search</button>
      </div>
    </section>
  );
}

export default SearchHero;