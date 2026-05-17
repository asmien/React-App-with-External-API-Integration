import { useState, useEffect } from 'react';
import './style/SearchHero.css';

const SearchHero = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="search-hero">
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      <div className="hero-overlay" />

      <div className="search-hero__content">
        <h1 className="search-hero__title">Discover amazing events near you</h1>
        <p className="search-hero__subtitle">
          Find concerts, festivals, tech meetups, sports, for unforgettable experiences.
        </p>

        <form className="search-hero__form" onSubmit={handleSubmit}>
          <div className="search-inputs">
            <input
              type="text"
              className="search-input"
              placeholder="Search artist, venue, or keyword"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <button type="submit" className="search-button">
            Find events
          </button>
        </form>
      </div>

      <div className="hero-indicators">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchHero;
