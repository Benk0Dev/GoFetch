import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/AuthService";

function DashboardPage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <div className="container">
                <h1>Dashboard</h1>
            </div>
        </>
    );
}

export default DashboardPage;