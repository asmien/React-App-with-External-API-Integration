import { useState, useEffect } from 'react';
import './style/SearchHero.css';

const backgroundImages = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
];

const categoryPills = [
  { key: 'all', label: 'All', icon: '🌐' },
  { key: 'ticketmaster', label: 'Music', icon: '🎤' },
  { key: 'eventbrite', label: 'Experiences', icon: '🎫' },
  { key: 'local', label: 'Community', icon: '🏠' },
];

const SearchHero = ({
  onSearch,
  featuredEvent,
  previewEvents = [],
  onExploreClick,
  onCategoryClick,
  activeSource,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <section className="search-hero">
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      <div className="hero-overlay" />

      <div className="search-hero__content">
        <div className="hero-copy">
          <span className="hero-kicker">EventSphere Live</span>

          <h1 className="search-hero__title">
            Discover events that match your energy.
          </h1>

          <p className="search-hero__subtitle">
            Search concerts, festivals, community meetups, and unforgettable live
            experiences from Eventbrite, Ticketmaster, and local creators.
          </p>

          <form className="search-hero__form" onSubmit={handleSubmit}>
            <div className="search-inputs">
              <input
                type="text"
                className="search-input"
                placeholder="Search artist, venue, city, or keyword"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <button type="submit" className="search-button">
              Find events →
            </button>
          </form>

          <div className="hero-category-pills">
            {categoryPills.map((category) => (
              <button
                key={category.key}
                className={`hero-pill ${activeSource === category.key ? 'active' : ''}`}
                onClick={() => onCategoryClick?.(category.key)}
                type="button"
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          <div className="hero-stats">
            <div>
              <strong>3</strong>
              <span>Event sources</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Discovery</span>
            </div>
            <div>
              <strong>Save</strong>
              <span>Your favourites</span>
            </div>
          </div>
        </div>

        <aside className="hero-showcase">
          <div className="phone-card">
            <div className="phone-card__top">
              <span>9:41</span>
              <span>●●●</span>
            </div>

            <div className="phone-card__image">
              {featuredEvent?.image_url ? (
                <img src={featuredEvent.image_url} alt={featuredEvent.name} />
              ) : (
                <div className="phone-card__placeholder">🎤</div>
              )}
            </div>

            <div className="phone-card__body">
              <span className="phone-tag">Featured tonight</span>
              <h3>{featuredEvent?.name || 'Music Festival'}</h3>
              <p>
                {featuredEvent?.venue_name ||
                  featuredEvent?.venue_address ||
                  'Live experiences near you'}
              </p>

              <button type="button" onClick={onExploreClick}>
                Explore events
              </button>
            </div>
          </div>

        
        </aside>
      </div>

      <div className="hero-indicators">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
};

export default SearchHero;