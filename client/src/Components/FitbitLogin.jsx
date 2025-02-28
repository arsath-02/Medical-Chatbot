import React from "react";
import Sidebar from "./Sidebar";
const FitbitLogin = () => {
  const CLIENT_ID = "23Q4CC";
  const REDIRECT_URI = "http://localhost:5173/callback";

  const AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=activity%20heartrate%20sleep%20profile`;

  return (
    <div>
      <Sidebar />
      <h2>Connect with Fitbit</h2>
      <a href={AUTH_URL}>
        <button>Login with Fitbit</button>
      </a>
    </div>
  );
};

export default FitbitLogin;
