import React, { useEffect, useState } from "react";
import MinderCard from "@client/pages/BrowsePage/MinderCard";
import FilterBar from "@client/pages/BrowsePage/FilterBar";
import styles from "@client/pages/BrowsePage/BrowsePage.module.css";
import { getAllMindersWithPictures } from "@client/services/MinderRegistry";

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
        const filteredMinders = [...minders];
        filteredMinders.sort(
          (a, b) => b.minderRoleInfo.rating - a.minderRoleInfo.rating
        );
        setFilteredMinders(filteredMinders);
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

    switch (filters.sort) {
      case "rating":
        filtered.sort(
          (a, b) => b.minderRoleInfo.rating - a.minderRoleInfo.rating
        );
        break;

      case "price":
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.minderRoleInfo.services.map((service: any) => service.price)) || 1000000;
          const priceB = Math.min(...b.minderRoleInfo.services.map((service: any) => service.price)) || 1000000;
          return priceA - priceB;
        });
        break;

      case "distance":
        // filtered.sort(
        //   (a, b) =>
        //     a.minderRoleInfo.distanceRange - b.minderRoleInfo.distanceRange
        // );
        break;

      default:
        break;
    }

    setFilteredMinders(filtered);
  };

  return (
    <div className={`container ${styles["browse-page-container"]}`}>
      <div className={styles["browse-page"]}>
        <FilterBar onFilterChange={handleFilterChange} />

        {loading ? (
          <p>Loading minders...</p>
        ) : (
          <div className={styles["minders-grid"]}>
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
    </div>
  );
};

export default BrowsePage;
