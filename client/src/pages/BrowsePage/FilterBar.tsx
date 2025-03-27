import React, { useState } from "react";
import "@client/pages/BrowsePage/FilterBar.css";

interface FilterBarProps {
  onFilterChange: (filters: {
    location: string;
    rating: number;
    price: number;
    availability: string;
  }) => void;
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

      {/* 🔎 Location or Name */}
      <input
        className="search-input"
        type="text"
        placeholder="Search by location or name"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 🔥 Optional: Search on Enter
      />

      <div className="filter-controls">
        {/* ⭐ Rating */}
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        >
          <option value={0}>Highest Rating</option>
          <option value={4}>4+ Stars</option>
          <option value={3}>3+ Stars</option>
        </select>

        {/* ⚙️ Toggle Advanced */}
        <button
          className="filter-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          ⚙️
        </button>

        {/* 🔎 Search */}
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ✅ Advanced Filters */}
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
