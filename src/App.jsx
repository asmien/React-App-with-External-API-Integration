// src/App.jsx
import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import SearchHero from "./components/SearchHero";
import EventGrid from "./components/EventGrid";
import { useEvents } from "./hooks/useEvents";
import { useDebounce } from "./hooks/useDebounce";
import { REGIONS, CATEGORIES } from "./utils/constants";

function App() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [selectedCategory, setSelectedCategory] = useState("general");

  const filters = {
    region: selectedRegion,
    category: selectedCategory,
  };

  const activeRegion = REGIONS.find((r) => r.value === selectedRegion) || REGIONS[0];
  const activeCategory = CATEGORIES.find((c) => c.value === selectedCategory) || CATEGORIES[0];

  const { events, loading, error, loadingMore, hasMore, loadMore } = useEvents(debouncedKeyword, filters);

  const handleSearchSubmit = () => {
    const section = document.getElementById("results-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="app">
      <NavBar />
      <main>
        <SearchHero
          keyword={keyword}
          setKeyword={setKeyword}
          filters={filters}
          onFiltersChange={(nextFilters) => {
            setSelectedRegion(nextFilters.region);
            setSelectedCategory(nextFilters.category);
          }}
          onSearchSubmit={handleSearchSubmit}
        />
        <section id="results-section" className="results-section">
          <div className="results-status">
            {loading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>
                Found {events.length} events for {activeCategory.label} in {activeRegion.label}
              </p>
            )}
          </div>

          <EventGrid
            events={events}
            isLoading={loading}
            error={error}
            hasMore={hasMore}
            loadMore={loadMore}
            loadingMore={loadingMore}
          />
        </section>
      </main>
    </div>
  );
}

export default App;