import React from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { IPet } from "../../models/IPet";
import { IUser } from "../../models/IUser";
import getFullFilePath from "../../utils/FullFilePath";
import styles from "./PetSelector.module.css";

interface PetSelectorProps {
  user: IUser | null;
  selectedPet: IPet | null;
  setSelectedPet: (pet: IPet) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ user, selectedPet, setSelectedPet }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Select a Pet</h2>
      <div className={styles.petGrid}>
        {user?.ownerRoleInfo?.pets?.map((pet) => (
          <div
            key={pet.id}
            onClick={() => setSelectedPet(pet)}
            className={`${styles.petCard} ${selectedPet?.id === pet.id ? styles.selected : ""}`}
          >
            <img
              src={pet.picture ? getFullFilePath(`dog_images/${pet.picture}`) : "/placeholder.svg"}
              alt={pet.name}
              className={styles.petImage}
            />
            <div className={styles.petDetails}>
              <h3 className={styles.petName}>{pet.name}</h3>
              <p className={styles.petBreed}>{pet.breed}</p>
            </div>
          </div>
        ))}

        <div onClick={() => navigate("/pet")} className={`${styles.petCard} ${styles.addPetCard}`}>
          <PawPrint className={styles.addPetIcon} />
          <span className={styles.addPetText}>Add Pet</span>
        </div>
      </div>
    </div>
  );
};

export default PetSelector;