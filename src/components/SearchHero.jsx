import { useDebounce } from "../hooks/useDebounce";

function SearchHero({
  keyword,
  setKeyword,
}) {

  const debouncedKeyword = useDebounce(keyword, 500);

  return (
    <section className="search-hero">

      <div className="hero-content">

        <h1>
          Discover Live Events Worldwide
        </h1>

        <p>
          Search concerts, sports, theatre,
          festivals, venues and artists powered
          by the Ticketmaster Discovery API.
        </p>

        <div className="search-wrapper">

          <input
            type="text"
            placeholder="Search artists, venues, cities, events..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />

        </div>

        <span className="search-status">

          {debouncedKeyword
            ? `Searching for "${debouncedKeyword}"`
            : "Trending live events"}

        </span>

      </div>

    </section>
  );
}

export default SearchHero;