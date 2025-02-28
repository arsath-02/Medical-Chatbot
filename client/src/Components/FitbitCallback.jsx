import { useEffect } from "react";
import axios from "axios";

const FitbitCallback = () => {
  useEffect(() => {
    const getAccessToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;


      const CLIENT_ID = "23Q4CC";
      const CLIENT_SECRET = "0270ece95e90f8910ccc89b43fdd020a";
      const REDIRECT_URI = "http://localhost:5173/callback";

      const tokenUrl = "https://api.fitbit.com/oauth2/token";
      const authHeader = `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`;

      try {
        const response = await axios.post(
          tokenUrl,
          new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: "authorization_code",
            redirect_uri: REDIRECT_URI,
            code: code,
          }),
          {
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        localStorage.setItem("fitbit_access_token", response.data.access_token);
        window.location.href = "/dashboard"; // Redirect to your main app
      } catch (error) {
        console.error("Error getting Fitbit access token:", error);
      }
    };

    getAccessToken();
  }, []);

  return <h3>Processing Fitbit Login...</h3>;
};

export default FitbitCallback;
