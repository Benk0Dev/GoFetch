import React, { useEffect, useState } from "react";
import MinderCard from "./MinderCard";
import FilterBar from "./FilterBar";
import "./Browse.css";
import { getAllMindersWithPictures } from "../../services/Registry";

const BrowsePage: React.FC = () => {
  const [allMinders, setAllMinders] = useState<any[]>([]);
  const [filteredMinders, setFilteredMinders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinders = async () => {
      try {
        const minders = await getAllMindersWithPictures();
        if (!minders) throw new Error("Failed to fetch minders.");
        setAllMinders(minders);
        setFilteredMinders(minders);
      } catch (error) {
        console.error("Error fetching minders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinders();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = allMinders.filter((minder) => {
      const searchText = filters.location.toLowerCase() || "";
      const availabilityText = filters.availability?.toLowerCase() || "";

      const fullName =
        `${minder.name.fname} ${minder.name.sname}`.toLowerCase();
      const location = minder.primaryUserInfo.address.city.toLowerCase() || "";
      const rating = minder.minderRoleInfo.rating || 0;
      const availability =
        minder.minderRoleInfo.availability.toLowerCase() || "";

      const nameMatch = fullName.includes(searchText);
      const locationMatch = location.includes(searchText);
      const ratingMatch = rating >= (filters.rating || 0);
      const availabilityMatch = availability.includes(availabilityText);
      return (
        (nameMatch || locationMatch) &&
        ratingMatch &&
        (availabilityText === "" || availabilityMatch)
      );
    });

    // 🧠 Sorting logic
    switch (filters.sort) {
      case "rating":
        filtered.sort(
          (a, b) => b.minderRoleInfo.rating - a.minderRoleInfo.rating
        );
        break;

      case "price":
        filtered.sort((a, b) => {
          const priceA = a.minderRoleInfo.services?.[0]?.price || 0;
          const priceB = b.minderRoleInfo.services?.[0]?.price || 0;
          return priceA - priceB;
        });
        break;

      case "distance":
        filtered.sort(
          (a, b) =>
            a.minderRoleInfo.distanceRange - b.minderRoleInfo.distanceRange
        );
        break;

      default:
        break;
    }

    setFilteredMinders(filtered);
  };

  return (
    <div className="browse-page">
      <h1>Available Pet Minders</h1>
      <FilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <p>Loading minders...</p>
      ) : (
        <div className="minder-grid">
          {filteredMinders.length > 0 ? (
            filteredMinders.map((minder, index) => (
              <MinderCard key={index} minder={minder} />
            ))
          ) : (
            <p>No minders available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
