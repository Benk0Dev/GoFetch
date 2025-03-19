import React, { useState } from "react";
import "./FilterBar.css";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onFilterChange({ location, rating, price, availability });
  };

  return (
    <div className="filter-container">
      <h2>Find a Pet Minder</h2>
      <p>
        Search for trusted pet minders in your area based on your preferences.
      </p>

      <input
        className="search-input"
        type="text"
        placeholder="Search by location or name"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <div className="filter-controls">
        <select onChange={(e) => setRating(parseInt(e.target.value))}>
          <option value={0}>Highest Rating</option>
          <option value={4}>4+ Stars</option>
          <option value={3}>3+ Stars</option>
        </select>

        {/* ⚙️ Gear button to toggle advanced filters */}
        <button
          className="filter-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          ⚙️
        </button>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ✅ Advanced Filters Modal */}
      {showAdvanced && (
        <div className="advanced-filters-modal">
          <label>Price Range (£): {price}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />

          <input
            type="text"
            placeholder="Availability (Today, Tomorrow, etc.)"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default FilterBar;
