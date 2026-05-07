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

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [selectedCategory, setSelectedCategory] = useState("general");

  const debouncedKeyword = useDebounce(keyword, 500);

  // Get selected region + category objects
  const activeRegion = useMemo(
    () =>
      REGIONS.find((r) => r.value === selectedRegion) || REGIONS[0],
    [selectedRegion]
  );

  const activeCategory = useMemo(
    () =>
      CATEGORIES.find((c) => c.value === selectedCategory) ||
      CATEGORIES[0],
    [selectedCategory]
  );

  // Fetch events
  const {
    events,
    loading,
    error,
    loadingMore,
    hasMore,
    loadMore,
  } = useEvents({
    keyword: debouncedKeyword,
    countryCode: activeRegion.countryCode,
    segmentName: activeCategory.segmentName,
  });

  return (
    <>
      <NavBar />

      <SearchHero
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <FilterBar
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <EventGrid
        events={events}
        loading={loading}
        error={error}
        hasMore={hasMore}
        loadMore={loadMore}
        loadingMore={loadingMore}
        regionLabel={activeRegion.label}
        categoryLabel={activeCategory.label}
      />
    </>
  );
}