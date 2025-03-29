import React, { useEffect, useState } from "react";
import MinderCard from "@client/pages/BrowsePage/MinderCard";
import FilterBar from "@client/pages/BrowsePage/FilterBar";
import "@client/pages/BrowsePage/Browse.css";
import { getAllMindersWithPictures } from "@client/services/MinderRegistry";

const BrowsePage: React.FC = () => {
  const [allMinders, setAllMinders] = useState<any[]>([]);
  const [filteredMinders, setFilteredMinders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinders = async () => {
      try {
        const minders = await getAllMindersWithPictures(); // ✅ Should include userDetails & minderRoleInfo
        if (!minders) throw new Error("Failed to fetch minders.");
        console.log("Fetched minders:", minders);
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
    console.log("Filters applied:", filters);

    const filtered = allMinders.filter((minder) => {
    const searchText = filters.location.toLowerCase() || "";
    const availabilityText = filters.availability.toLowerCase() || "";

    // ✅ Use correct nested paths
    const fullName =
      `${minder.name.fname} ${minder.name.lname}`.toLowerCase();
    const location =
      minder.primaryUserInfo.address.city.toLowerCase() || "";
    const rating = minder.minderRoleInfo.rating || 0;
    const availability =
      minder.minderRoleInfo.availability?.toLowerCase() || "";

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

    setFilteredMinders(filtered);
  };

  console.log("Rendering Filtered Minders:", filteredMinders);

  return (
    <div className="browse-page">
      <h1>Available Pet Minders</h1>

      {/* FilterBar calls handleFilterChange when "Search" is clicked */}
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
