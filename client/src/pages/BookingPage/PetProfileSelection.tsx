import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingPage.module.css";

interface IPet {
  id: number;
  name: string;
  breed: string;
  pictures: string[];
}

interface PetProfileSelectionProps {
  userId: number;
  selectedPetId: number | null;
  onPetChange: (petId: number) => void;
  onAddPetProfile: () => void;
}

const PetProfileSelection: React.FC<PetProfileSelectionProps> = ({ userId, selectedPetId, onPetChange, onAddPetProfile }) => {
  const [pets, setPets] = useState<IPet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}/pets`);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [userId]);

  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPetChange(parseInt(e.target.value));
  };

  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  return (
    <div className={styles.formGroup}>
      <label htmlFor="petSelect">Select Pet Profile</label>
      <select id="petSelect" onChange={handlePetChange}>
        <option value="">{pets.length > 0 ? "Select a pet profile" : "You have no pet profiles, please add one"}</option>
        {pets.map(pet => (
          <option key={pet.id} value={pet.id}>{pet.name}</option>
        ))}
      </select>
      {selectedPet && (
        <div className={styles.petDetails}>
          <p><strong>Name:</strong> {selectedPet.name}</p>
          <p><strong>Breed:</strong> {selectedPet.breed}</p>
          <img src={selectedPet.pictures[0]} alt={selectedPet.name} />
        </div>
      )}
      <button className={styles.addPetButton} onClick={onAddPetProfile}>
        <span>+</span> Add Pet Profile
      </button>
    </div>
  );
};

export default PetProfileSelection;