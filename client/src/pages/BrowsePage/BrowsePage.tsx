import React, { useEffect, useState } from "react";
import MinderCard from "@client/pages/BrowsePage/MinderCard";
import FilterBar from "@client/pages/BrowsePage/FilterBar";
import styles from "@client/pages/BrowsePage/BrowsePage.module.css";
import { getAllMindersWithPictures } from "@client/services/MinderRegistry";
import { useAuth } from "@client/context/AuthContext";
import {
  getDistanceBetweenAddresses,
  loadGooglePlacesScript,
} from "@client/services/googleApi";

const BrowsePage: React.FC = () => {
  const { user } = useAuth();
  const [allMinders, setAllMinders] = useState<any[]>([]);
  const [filteredMinders, setFilteredMinders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinders = async () => {
      try {
        const minders = await getAllMindersWithPictures();
        if (!minders) throw new Error("Failed to fetch minders.");

        let filteredMinders = [...minders];
        if (user) {
          filteredMinders = filteredMinders.filter(
            (minder) => minder.id !== user.id
          );
        }
        filteredMinders = filteredMinders.filter(
          (minder) => minder.minderRoleInfo.services.length > 0
        );
        setAllMinders(filteredMinders);
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

  const handleFilterChange = async (filters: any) => {
    if (!user) return;

    await loadGooglePlacesScript();

    const searchText = filters.location.toLowerCase();
    const filteredWithDistance = await Promise.all(
      allMinders.map(async (minder) => {
        try {
          const distInMeters = await getDistanceBetweenAddresses(
            user.primaryUserInfo.address,
            minder.primaryUserInfo.address
          );
          const distInMiles = distInMeters / 1609.34;
          return { minder, distance: distInMiles };
        } catch (err) {
          return { minder, distance: Infinity }; // treat failure as far away
        }
      })
    );

    let filtered = filteredWithDistance
      .filter(({ minder, distance }) => {
        const fullName =
          `${minder.name.fname} ${minder.name.sname}`.toLowerCase();
        const location = minder.primaryUserInfo.address.city.toLowerCase();
        const rating = minder.minderRoleInfo.rating || 0;

        const nameMatch = fullName.includes(searchText);
        const locationMatch = location.includes(searchText);
        const ratingMatch = rating >= (filters.rating || 0);
        const priceMatch = minder.minderRoleInfo.services.some(
          (s: any) => s.price <= filters.price
        );
        const serviceMatch =
          !filters.service ||
          minder.minderRoleInfo.services.some(
            (s: any) => s.type === filters.service
          );
        const distanceMatch = distance <= filters.distance;

        return (
          (nameMatch || locationMatch) &&
          ratingMatch &&
          priceMatch &&
          serviceMatch &&
          distanceMatch
        );
      })
      .map(({ minder, distance }) => ({
        ...minder,
        __distance: distance,
      }));

    switch (filters.sort) {
      case "rating":
        filtered.sort(
          (a, b) => b.minderRoleInfo.rating - a.minderRoleInfo.rating
        );
        break;

      case "price":
        filtered.sort((a, b) => {
          const priceA = Math.min(
            ...a.minderRoleInfo.services.map((s: any) => s.price)
          );
          const priceB = Math.min(
            ...b.minderRoleInfo.services.map((s: any) => s.price)
          );
          return priceA - priceB;
        });
        break;

      case "distance":
        filtered.sort((a, b) => a.__distance - b.__distance);
        break;

      default:
        break;
    }

    setFilteredMinders(filtered);
  };

  return (
    <div className={`container ${styles["browse-page"]}`}>
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
  );
};

export default BrowsePage;
