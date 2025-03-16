import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserType } from "../../services/AuthService";

function DashboardPage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCurrentUserType()) {
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