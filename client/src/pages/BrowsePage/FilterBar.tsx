import { useState, useEffect, useRef } from "react";
import styles from "@client/pages/BrowsePage/BrowsePage.module.css";
import { Type } from "@gofetch/models/IService";
import { Search, SlidersVertical, X } from "lucide-react";
import {
  getDistanceBetweenAddresses,
  loadGooglePlacesScript,
} from "@client/services/googleApi";

interface FilterBarProps {
  onFilterChange: (filters: {
    location: string;
    rating: number;
    price: number;
    service: Type | "";
    sort: string;
    distance: number;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(200);
  const [distance, setDistance] = useState(200); // NEW
  const [service, setService] = useState<Type | "">("");
  const [sortOption, setSortOption] = useState("rating");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onFilterChange({
      location,
      rating,
      price,
      service,
      sort: sortOption,
      distance,
    });
  }, [location, rating, price, service, sortOption, distance]);

  const handleSearch = () => {
    onFilterChange({
      location,
      rating,
      price,
      service,
      sort: sortOption,
      distance,
    });
  };

  const handleReset = () => {
    setLocation("");
    setRating(0);
    setPrice(200);
    setDistance(200); // RESET distance
    setService("");
    setSortOption("rating");
    onFilterChange({
      location: "",
      rating: 0,
      price: 200,
      distance: 200,
      service: "",
      sort: "rating",
    });
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newService = event.target.value as Type | "";
    setService(newService);
    onFilterChange({
      location,
      rating,
      price,
      service: newService,
      sort: sortOption,
      distance,
    });
  };

  const handleApply = () => {
    setShowAdvanced(false);
  };

  const closeModal = () => {
    setShowAdvanced(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowAdvanced(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles["filter-container"]}>
      <h2>Find a Pet Minder</h2>
      <p>
        Search for trusted pet minders in your area based on your preferences.
      </p>

      <div className={styles["inputs"]}>
        <div className={styles["search-container"]}>
          <input
            className={styles["search-input"]}
            type="text"
            placeholder="Search by location or name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search size={18} />
        </div>

        <div className={styles["filter-controls"]}>
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              onFilterChange({
                location,
                rating,
                price,
                service,
                sort: e.target.value,
                distance,
              });
            }}
            style={{ width: "fit-content" }}
          >
            <option value="rating">Highest Rating</option>
            <option value="price">Lowest Price</option>
            <option value="distance">Nearest</option>
          </select>

          <button
            className={"btn" + " " + styles["advanced-filters-button"]}
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ padding: "0 12px" }}
          >
            <SlidersVertical size={18} />
          </button>

          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div
        className={`${styles["overlay"]} ${showAdvanced ? styles["open"] : ""}`}
      ></div>

      <div
        className={`${styles["advanced-filters-modal"]} ${
          showAdvanced ? styles["open"] : ""
        }`}
        ref={modalRef}
      >
        <button
          className={styles["close-button"] + " btn"}
          onClick={closeModal}
        >
          <X size={18} />
        </button>
        <h5>Filter Results</h5>
        <p>Refine your search with these filters.</p>

        <div>
          <label>Service</label>
          <select value={service} onChange={handleServiceChange}>
            <option value="">All Services</option>
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
        </div>

        <div>
          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
          </select>
        </div>

        <div>
          <label>Maximum Price: £{price}</label>
          <input
            type="range"
            min="0"
            max="200"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label>Maximum Distance: {distance} miles</label>
          <input
            type="range"
            min="1"
            max="200"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
          />
        </div>

        <div className={styles["buttons"]}>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
