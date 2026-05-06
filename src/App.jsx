// src/App.jsx
import { useMemo, useState } from 'react';
import { REGIONS, CATEGORIES } from './utils/constants';
import { useEvents } from './hooks/useEvents';
import { useDebounce } from './hooks/useDebounce';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SearchHero } from './components/SearchHero';
import { EventGrid } from './components/EventGrid';
import { Loader, ErrorState, EmptyState } from './components/ui/StateViews';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [savedEvents, setSavedEvents] = useLocalStorage('saved-events', []);

  const debouncedSearch = useDebounce(search, 500);

  const activeRegion = useMemo(
    () => REGIONS.find((region) => region.value === selectedRegion) || REGIONS[0],
    [selectedRegion]
  );

  const activeCategory = useMemo(
    () =>
      CATEGORIES.find((category) => category.value === selectedCategory) ||
      CATEGORIES[0],
    [selectedCategory]
  );

  const { events, loading, error, loadingMore, hasMore, loadMore } = useEvents({
    keyword: debouncedSearch,
    countryCode: activeRegion.countryCode,
    segmentName: activeCategory.segmentName,
  });

  function handleSave(event) {
    const exists = savedEvents.some((item) => item.id === event.id);
    if (!exists) {
      setSavedEvents((prev) => [...prev, event]);
    }
  }

  return (
    <main>
      <h1>Events</h1>

      <SearchHero
        search={search}
        setSearch={setSearch}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        regions={REGIONS}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      {loading && <Loader />}
      {error && <ErrorState message={error} />}
      {!loading && !error && events.length === 0 && (
        <EmptyState
          regionLabel={activeRegion.label}
          categoryLabel={activeCategory.label}
        />
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <EventGrid
            events={events}
            savedEvents={savedEvents}
            onSave={handleSave}
          />

          {hasMore && (
            <button onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading more...' : 'Load More'}
            </button>
          )}
        </>
      )}
    </main>
  );
}