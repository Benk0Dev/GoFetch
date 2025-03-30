import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@client/context/AuthContext";
import { Gender, IPet } from "@gofetch/models/IPet";
import styles from "@client/pages/DashboardPage/Pets/PetDetails.module.css";
import BackButton from "@client/components/BackButton";

function PetDetails() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const petId = Number(id);

    const pet = useMemo(() => {
        return user.ownerRoleInfo.pets.find((pet: IPet) => pet.id === petId);
    }, [user, petId]);

    useEffect(() => {
        if (!pet) {
            navigate("/dashboard/pets");
        }
    }, [pet, navigate]);

    return (
        <div className={`container ${styles.petDetails}`}>
            <div className={styles.petDetailsContainer}>
            <BackButton />
                <div className={styles.petDetailsContent}>
                    {pet.picture && <img src={pet.picture} alt={pet.name} />}
                    <h3>{pet.name}</h3>
                    <h6>{pet.breed}</h6>
                    <hr />
                    <div className={styles.petDetailsGrid}>
                        <div className={styles.petDetail}>
                            <span>Date of Birth</span>
                            <p>{new Date(pet.dob).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.petDetail}>
                            <span>Gender</span>
                            <p>{pet.gender === Gender.MALE ? "Male" : "Female"}</p>
                        </div>
                        <div className={styles.petDetail}>
                            <span>Size</span>
                            <p>{pet.size}</p>
                        </div>
                        <div className={styles.petDetail}>
                            <span>Neutered/Sprayed</span>
                            <p>{pet.neutered ? "Yes" : "No"}</p>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.petDetail}>
                        <span>Behaviour</span>
                        <p>{pet.behaviour ? pet.behaviour : "N/A"}</p>
                    </div>
                    <div className={styles.petDetail} style={{marginTop: "10px"}}>
                        <span>Allergies</span>
                        <p>{pet.allergies ? pet.allergies : "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetDetails;
