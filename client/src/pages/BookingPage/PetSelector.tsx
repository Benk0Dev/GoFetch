import React from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { IPet } from "@gofetch/models/IPet";
import styles from "@client/pages/BookingPage/BookingPage.module.css";
import { useAuth } from "@client/context/AuthContext";

interface PetSelectorProps {
  selectedPet: IPet | null;
  setSelectedPet: (pet: IPet) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ selectedPet, setSelectedPet }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.petsContainer}>
      <label>Select a Pet</label>
      <div className={styles.pets}>
        {user.ownerRoleInfo.pets.map((pet: IPet) => (
          <div
            key={pet.id}
            onClick={() => setSelectedPet(pet)}
            className={`${styles.petCard} ${selectedPet?.id === pet.id ? styles.selected : ""}`}
          >
            <img
              src={pet.picture}
              alt={pet.name}
            />
            <div className={styles.petDetails}>
              <h6 className={styles.petName}>{pet.name}</h6>
              <p className={styles.petBreed}>{pet.breed}</p>
            </div>
          </div>
        ))}

        <div onClick={() => navigate("/add-pet")} className={`${styles.petCard} ${styles.addPetCard}`}>
          <PawPrint className={styles.addPetIcon} />
          <p className={styles.addPetText}>Add Pet</p>
        </div>
      </div>
    </div>
  );
};

export default PetSelector;