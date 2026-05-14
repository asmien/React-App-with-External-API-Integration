import "./FilterBar.css";

import {
  REGIONS,
  CATEGORIES,
} from "../utils/constants";

function FilterBar({ filters, onChange }) {
  const handleRegionChange = (e) => {
    onChange({ ...filters, region: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onChange({ ...filters, category: e.target.value });
  };

  return (
    <section className="filter-bar">
      <div className="filter-group">
        <label>Region</label>
        <select value={filters.region} onChange={handleRegionChange}>
          {REGIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select value={filters.category} onChange={handleCategoryChange}>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default FilterBar;