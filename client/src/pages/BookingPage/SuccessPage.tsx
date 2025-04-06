import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const minderName = location.state?.minderName || "the minder";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600">Booking Successful</h1>
        <p className="mt-4 text-gray-700">
          Your booking has successfully been made with {minderName}. They will respond to your request when they're ready.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <button onClick={() => navigate("/")} className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md">
            Back to Dashboard
          </button>
          <button onClick={() => navigate("/browse")} className="bg-gray-500 hover:bg-gray-600 text-white w-full py-2 rounded-md">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;