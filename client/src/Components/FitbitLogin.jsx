import React from "react";
import Sidebar from "./Sidebar";

const FitbitLogin = () => {
  const CLIENT_ID = "23Q4CC";
  const REDIRECT_URI = "http://localhost:5173/callback";

  const AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=activity%20heartrate%20sleep%20profile`;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-blue-950">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Connect with Fitbit
          </h2>
          <p className="text-gray-600 mb-6">
            Sync your activity, heart rate, and sleep data.
          </p>
          <a href={AUTH_URL}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Login with Fitbit
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FitbitLogin;
