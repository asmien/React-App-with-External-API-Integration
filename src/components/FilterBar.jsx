import {
  REGIONS,
  CATEGORIES,
} from "../utils/constants";

function FilterBar({
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
}) {

  return (
    <section className="filter-bar">

      <div className="filter-group">

        <label>Region</label>

        <select
          value={selectedRegion}
          onChange={(e) =>
            setSelectedRegion(e.target.value)
          }
        >

          {REGIONS.map((region) => (
            <option
              key={region.value}
              value={region.value}
            >
              {region.label}
            </option>
          ))}

        </select>

      </div>

      <div className="filter-group">

        <label>Category</label>

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >

          {CATEGORIES.map((category) => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}

        </select>

      </div>

    </section>
  );
}

export default FilterBar;