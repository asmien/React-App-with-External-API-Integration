// src/App.jsx

import { useMemo, useState } from "react";
import "./App.css";

import NavBar from "./components/NavBar";
import SearchHero from "./components/SearchHero";
import FilterBar from "./components/FilterBar";
import EventGrid from "./components/EventGrid";

import { REGIONS, CATEGORIES } from "./utils/constants";

import { useEvents } from "./hooks/useEvents";
import { useDebounce } from "./hooks/useDebounce";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {

  const [keyword, setKeyword] =
    useState("");

  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState("global");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("general");

  // SAVED EVENTS
  const [
    savedEvents,
    setSavedEvents,
  ] = useLocalStorage(
    "saved-events",
    []
  );

  const debouncedKeyword =
    useDebounce(keyword, 500);

  // ACTIVE REGION
  const activeRegion = useMemo(
    () =>
      REGIONS.find(
        (r) => r.value === selectedRegion
      ) || REGIONS[0],
    [selectedRegion]
  );

  // ACTIVE CATEGORY
  const activeCategory = useMemo(
    () =>
      CATEGORIES.find(
        (c) =>
          c.value === selectedCategory
      ) || CATEGORIES[0],
    [selectedCategory]
  );

  // FETCH EVENTS
  const {
    events,
    loading,
    error,
    loadingMore,
    hasMore,
    loadMore,
  } = useEvents({
    keyword: debouncedKeyword,
    countryCode:
      activeRegion.countryCode,
    segmentName:
      activeCategory.segmentName,
  });

  // SAVE / UNSAVE EVENT
  function toggleSave(event) {

    const alreadySaved =
      savedEvents.some(
        (saved) =>
          saved.id === event.id
      );

    if (alreadySaved) {

      setSavedEvents(
        savedEvents.filter(
          (saved) =>
            saved.id !== event.id
        )
      );

    } else {

      setSavedEvents([
        ...savedEvents,
        event,
      ]);

    }
  }

  return (
    <>

      <NavBar />

      <SearchHero
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <FilterBar
        selectedRegion={
          selectedRegion
        }
        setSelectedRegion={
          setSelectedRegion
        }
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
      />

      <EventGrid
        events={events}
        loading={loading}
        error={error}
        hasMore={hasMore}
        loadMore={loadMore}
        loadingMore={loadingMore}
        regionLabel={
          activeRegion.label
        }
        categoryLabel={
          activeCategory.label
        }

        savedEvents={savedEvents}
        toggleSave={toggleSave}
      />

      {/* SAVED EVENTS */}

      {savedEvents.length > 0 && (
        <section className="saved-section">

          <h2>
            Saved Events
          </h2>

          <EventGrid
            events={savedEvents}
            loading={false}
            error=""
            hasMore={false}
            loadingMore={false}
            loadMore={() => {}}

            savedEvents={savedEvents}
            toggleSave={toggleSave}
          />

        </section>
      )}

    </>
  );
}