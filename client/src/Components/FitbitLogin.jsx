import React from "react";
import Sidebar from "./Sidebar";

const FitbitLogin = () => {
  const CLIENT_ID = import.meta.env.VITE_FITBIT_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_FITBIT_REDIRECT_URI;
  console.log(REDIRECT_URI);
  console.log(CLIENT_ID);
  const AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=activity%20heartrate%20sleep%20profile`;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Connect with Your Watch
          </h2>
          <p className="text-gray-600 mb-6">
            Sync your activity, heart rate, and sleep data.
          </p>
          <a href={AUTH_URL}>
            <button className="bg-gray-900 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Login 
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FitbitLogin;
