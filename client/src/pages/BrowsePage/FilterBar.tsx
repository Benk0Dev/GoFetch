import React, { useState } from "react";
import "./FilterBar.css";
import { IService, Type } from "../../models/IService";

interface FilterBarProps {
  onFilterChange: (filters: {
    location: string;
    rating: number;
    price: number;
    service: Type;
    sort: string;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);
  const [service, setService] = useState<Type>(Type.WALK);
  const [sortOption, setSortOption] = useState("rating");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onFilterChange({ location, rating, price, service, sort: sortOption });
  };

  const handleReset = () => {
    setLocation("");
    setRating(0);
    setPrice(0);
    setService(Type.WALK);
    setSortOption("rating");
  };

  const handleApply = () => {
    onFilterChange({ location, rating, price, service, sort: sortOption });
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
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <div className="filter-controls">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="rating">Highest Rating</option>
          <option value="price">Lowest Price</option>
          <option value="distance">Nearest</option>
        </select>

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

      {showAdvanced && (
        <div className="advanced-filters-modal">
          <label>Select Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value as Type)}
          >
            <option value="">All Services</option>{" "}
            <option value={Type.WALK}>Dog Walking</option>
            <option value={Type.SIT}>Pet Sitting</option>
            <option value={Type.CARE}>Day Care</option>
            <option value={Type.BOARD}>Overnight Boarding</option>
            <option value={Type.GROOM}>Grooming</option>
            <option value={Type.TRAIN}>Training</option>
            <option value={Type.VISIT}>Home Visit</option>
            <option value={Type.MEDICATE}>Medication Administration</option>
            <option value={Type.TRANSPORT}>Pet Transport</option>
            <option value={Type.OTHER}>Other Service</option>
          </select>

          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            <option value={0}>4+ Stars</option>
            <option value={1}>3+ Stars</option>
          </select>

          <label>Price Range (£): {price}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />

          <div className="filter-buttons">
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
            <button className="apply-button" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
