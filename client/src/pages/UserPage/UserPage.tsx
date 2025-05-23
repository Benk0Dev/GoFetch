import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@client/context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./UserPage.module.css";
import BackButton from "@client/components/BackButton";
import { IUser, Role } from "@gofetch/models/IUser";
import { startChat } from "@client/services/ChatRegistry";
import { getUserByIdWithPictures} from "@client/services/UserRegistry";
import { MapPin, Settings, UserRound, MessageSquare, Flag, Ban } from "lucide-react";
import { removeSuspension } from "@client/services/UserRegistry";

function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [userBeingDisplayed, setUserBeingDisplayed] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getUserByIdWithPictures(Number(id));
            if (fetchedUser) {
                setUserBeingDisplayed(fetchedUser);
            }
            setLoading(false);
        };
        fetchUser();
    }, [id, navigate]);

    if (loading) {
        return null;
    }

    if (!userBeingDisplayed) {
        return <div className={`container ${styles.userDetails}`}><p>404 (Not Found)</p></div>;
    }

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    const handleMinderProfile = () => {
        navigate(`/minders/${userBeingDisplayed.id}`);
    };

    const handleMessage = async () => {
        const chat = await startChat(userBeingDisplayed.id);
        navigate(`/chats/${chat.id}`);
    };

    const handleReport = () => {
        navigate("/report", {
            state: {
                reporteeId: userBeingDisplayed.id,
                reporteeName: userBeingDisplayed.name.fname + " " + userBeingDisplayed.name.sname,
            }
        });
    };

    const handleRemoveSuspension = async () => {
        if (userBeingDisplayed.primaryUserInfo.suspension) {
            const success = await removeSuspension(userBeingDisplayed.primaryUserInfo.suspension.id);
            if (success) {
                // Update the user in the state
                const updatedUser = await getUserByIdWithPictures(userBeingDisplayed.id);
                setUserBeingDisplayed(updatedUser);
    
                // Full reload
                navigate(`/users/${userBeingDisplayed.id}`, { replace: true });
            }
        }
    };

    return (
        <div className={`container ${styles.userDetails}`}>
            <div className={styles.userDetailsContainer}>
            <BackButton />
                <div className={styles.userDetailsContent}>
                    <img src={userBeingDisplayed.primaryUserInfo.profilePic} alt={userBeingDisplayed.name.fname + " " + userBeingDisplayed.name.sname} />
                    <h3>{userBeingDisplayed.name.fname + " " + userBeingDisplayed.name.sname}</h3>
                    {user && user.id === userBeingDisplayed.id ? (
                        <p><MapPin size={16} strokeWidth={2} />{userBeingDisplayed.primaryUserInfo.address.street}, {userBeingDisplayed.primaryUserInfo.address.city}</p>
                    ) : (
                        <p><MapPin size={16} strokeWidth={2} />{userBeingDisplayed.primaryUserInfo.address.city}, {userBeingDisplayed.primaryUserInfo.address.country}</p>
                    )}
                    <div className={styles.roles}>
                        {userBeingDisplayed.roles.map((role, index) => (
                            <span key={index} className={styles.role}>{role === Role.OWNER ? "Pet Owner" : role === Role.MINDER ? "Pet Minder" : "Admin"}</span>
                        ))}
                    </div>
                    <hr />
                    <div className={styles.buttons}>
                        {user && user.id === userBeingDisplayed.id ? (
                            <button className="btn2 btn-transparent black-hover" onClick={handleEditProfile}><Settings size={18} strokeWidth={2} />Edit Profile</button>
                        ) : user && (user.currentRole === Role.OWNER || user.currentRole === Role.MINDER) ? (
                            <>
                                {userBeingDisplayed.roles.includes(Role.MINDER) && (
                                    <button className="btn2 btn-primary" onClick={handleMinderProfile}><UserRound size={18} strokeWidth={2} />Minder Profile</button>
                                )}
                                <button className="btn2 btn-secondary" onClick={handleMessage}><MessageSquare size={18} strokeWidth={2} />Message</button>
                                <button className="btn2 btn-transparent black-hover" onClick={handleReport}><Flag size={18} strokeWidth={2} />Report</button>
                            </>
                        ) : user && user.currentRole === Role.ADMIN ? (
                            <>
                                {userBeingDisplayed.roles.includes(Role.MINDER) && (
                                    <button className="btn2 btn-primary" onClick={handleMinderProfile}><UserRound size={18} strokeWidth={2} />Minder Profile</button>
                                )}
                                <button className="btn2 btn-secondary" onClick={handleMessage}><MessageSquare size={18} strokeWidth={2} />Message</button>
                                {userBeingDisplayed.primaryUserInfo.suspension && (
                                    <button className="btn2 btn-transparent black-hover" onClick={handleRemoveSuspension}><Ban size={18} strokeWidth={2} />Remove Suspension</button>
                                )}
                            </>
                        ) : (
                            <>
                            {userBeingDisplayed.roles.includes(Role.MINDER) && (
                                <button className="btn2 btn-primary" onClick={handleMinderProfile}><UserRound size={18} strokeWidth={2} />Minder Profile</button>
                            )}
                                <button className="btn2 btn-transparent black-hover" onClick={handleReport}><Flag size={18} strokeWidth={2} />Report</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
