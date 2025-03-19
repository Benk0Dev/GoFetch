import React, { useEffect, useState } from "react";
import axios from "axios";
import MinderCard from "./MinderCard";
import FilterBar from "./FilterBar";
import "./Browse.css";

// Correct Minder interface matching mapped structure
interface Minder {
  id: number;
  fullName: string;
  bio: string;
  rating: number;
  location: string;
  availability: string;
  distanceRange: number;
  verified: boolean;
  pictures: string[];
}

const BrowsePage: React.FC = () => {
  const [allMinders, setAllMinders] = useState<Minder[]>([]);
  const [filteredMinders, setFilteredMinders] = useState<Minder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/minders");
        console.log("Fetched data:", response.data);

        const minders: Minder[] = response.data.map((user: any) => ({
          id: user.userDetails.id,
          fullName: `${user.userDetails.fname} ${user.userDetails.lname}`,
          bio: user.minderRoleInfo.bio,
          rating: user.minderRoleInfo.rating,
          location: user.primaryUserInfo.location.name,
          availability: user.minderRoleInfo.availability,
          distanceRange: user.minderRoleInfo.distanceRange,
          verified: user.minderRoleInfo.verified,
          pictures: user.minderRoleInfo.pictures,
        }));

        setAllMinders(minders);
        setFilteredMinders(minders); // Show all by default
      } catch (error) {
        console.error("Error fetching minders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinders();
  }, []);

  // This runs when Search button is clicked in FilterBar
  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters);

    const filtered = allMinders.filter((minder) => {
      const searchText = filters.location?.toLowerCase() || "";

      const nameMatch = minder.fullName.toLowerCase().includes(searchText);
      const locationMatch = minder.location.toLowerCase().includes(searchText);

      return (
        (nameMatch || locationMatch) && minder.rating >= (filters.rating || 0)
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
            filteredMinders.map((minder) => (
              <MinderCard key={minder.id} minder={minder} />
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
