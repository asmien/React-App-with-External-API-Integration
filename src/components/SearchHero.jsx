import { useEffect, useState } from "react";
import "./SearchHero.css";
import { REGIONS, CATEGORIES } from "../utils/constants";

const heroImages = [
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565483276060-e6730c0cc6a1?w=1600&auto=format&fit=crop&q=80",
];

function SearchHero({ keyword, setKeyword, filters, onFiltersChange, onSearchSubmit }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  const handleRegionChange = (e) => {
    onFiltersChange({ ...filters, region: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onFiltersChange({ ...filters, category: e.target.value });
  };

  return (
    <section className="hero">
      <div className="hero-slides">
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="Event background"
            className={`hero-slide ${index === currentImage ? "active" : ""}`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">Discover amazing events near you</h1>

        <p className="hero-subtitle">
          Find concerts, festivals, tech meetups, sports, for unforgettable experiences.
        </p>

        <div className="hero-tabs">
          <button className="hero-tab">Festivals</button>
          <button className="hero-tab">Theater</button>
          <button className="hero-tab">Music</button>
          <button className="hero-tab">Sports</button>
        </div>

        <form className="hero-form" onSubmit={handleSubmit}>
          <div className="hero-search">
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search artist, venue, or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="hero-filters">
            <div className="hero-filter-group">
              <label htmlFor="hero-region">Region</label>
              <select
                id="hero-region"
                value={filters.region}
                onChange={handleRegionChange}
              >
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hero-filter-group">
              <label htmlFor="hero-category">Category</label>
              <select
                id="hero-category"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="hero-search-button hero-search-button--bottom">
            Find events
          </button>
        </form>
      </div>
    </section>
  );
}

export default SearchHero;