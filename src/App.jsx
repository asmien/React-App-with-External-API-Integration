import Navbar from "./components/Navbar";
import SearchHero from "./components/SearchHero";

function App() {
  return (
    <div>
      <Navbar />

      <h1>Discover events around you</h1>
      <p>Find concerts, hangouts, conferences and more.</p>

      <SearchHero />
    </div>
  );
}

export default App;