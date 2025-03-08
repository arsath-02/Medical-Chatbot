import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";
import Sidebar from "./Sidebar";
// Heart Rate Component
export const HeartRateComponent = () => {
  const [heartRateData, setHeartRateData] = useState([]);
  const [heartRateZones, setHeartRateZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeframe = "1d"; // You can change this to "1w" for week, "1m" for month

  useEffect(() => {
    const fetchHeartRateData = async () => {
      const token = localStorage.getItem("fitbit_access_token");
      if (!token) {
        console.log("No access token, redirecting to login...");
        window.location.href = "/";
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Heart Rate Data
        const heartRateResponse = await axios.get(
          `https://api.fitbit.com/1/user/-/activities/heart/date/today/${timeframe}.json`,
          { headers }
        );

        console.log("Heart Rate Data:", heartRateResponse.data);

        // Process daily summary data for zones
        const heartData = heartRateResponse.data["activities-heart"].map((item) => ({
          date: item.dateTime,
          outOfRange: item.value.heartRateZones[0]?.minutes || 0,
          fatBurn: item.value.heartRateZones[1]?.minutes || 0,
          cardio: item.value.heartRateZones[2]?.minutes || 0,
          peak: item.value.heartRateZones[3]?.minutes || 0,
          restingHeartRate: item.value.restingHeartRate || 0
        }));

        setHeartRateZones(heartData);

        // Try to get intraday data if available (requires special permission)
        try {
          const intradayResponse = await axios.get(
            `https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json`,
            { headers }
          );

          console.log("Intraday Heart Rate:", intradayResponse.data);

          // If intraday data is available, process it
          if (intradayResponse.data["activities-heart-intraday"]?.dataset) {
            const intradayData = intradayResponse.data["activities-heart-intraday"].dataset.map(item => ({
              time: item.time,
              value: item.value
            }));

            setHeartRateData(intradayData);
          }
        } catch (intradayError) {
          console.log("Intraday data not available:", intradayError);
          // This is expected if the app doesn't have intraday permission
        }
      } catch (error) {
        console.error("Error fetching Fitbit heart rate data:", error);
        setError("Failed to load heart rate data");
      } finally {
        setLoading(false);
      }
    };

    fetchHeartRateData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2 className="text-white text-xl font-semibold mb-4">Heart Rate Data</h2>
        <div className="text-white">Loading heart rate data...</div>
      </div>
    );
  }

  if (error && heartRateZones.length === 0) {
    return (
      <div className="dashboard-container">
        <h2 className="text-white text-xl font-semibold mb-4">Heart Rate Data</h2>
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-white text-xl font-semibold mb-4">Heart Rate Data</h2>

      {/* Heart Rate Zones Chart */}
      <div className="chart-container mb-8">
        <h3 className="text-white text-lg font-medium mb-2">Time in Heart Rate Zones (minutes)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={heartRateZones}>
            <XAxis dataKey="date" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Legend />
            <Bar dataKey="outOfRange" fill="#ff4757" name="Out of Range" />
            <Bar dataKey="fatBurn" fill="#FFA500" name="Fat Burn" />
            <Bar dataKey="cardio" fill="#1e90ff" name="Cardio" />
            <Bar dataKey="peak" fill="#32cd32" name="Peak" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resting Heart Rate */}
      {heartRateZones.length > 0 && heartRateZones[0].restingHeartRate > 0 && (
        <div className="mb-8">
          <h3 className="text-white text-lg font-medium mb-2">Resting Heart Rate</h3>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-5xl font-bold text-red-400">
              {heartRateZones[0].restingHeartRate}
            </div>
            <div className="text-white mt-2">BPM</div>
          </div>
        </div>
      )}

      {/* Intraday Heart Rate Chart (if available) */}
      {heartRateData.length > 0 && (
        <div className="chart-container">
          <h3 className="text-white text-lg font-medium mb-2">Intraday Heart Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={heartRateData}>
              <XAxis
                dataKey="time"
                tick={{ fill: "#fff" }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                tick={{ fill: "#fff" }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff4757"
                strokeWidth={2}
                name="Heart Rate (BPM)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
export const StepsComponent = () => {
  const [stepsData, setStepsData] = useState([]);
  const timeframe = "1w"; // 1 week of data

  useEffect(() => {
    const fetchStepsData = async () => {
      const token = localStorage.getItem("fitbit_access_token");
      if (!token) {
        console.log("No access token, redirecting to login...");
        window.location.href = "/";
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Steps Data - this endpoint works based on your logs
        const stepsResponse = await axios.get(
          `https://api.fitbit.com/1/user/-/activities/steps/date/today/${timeframe}.json`,
          { headers }
        );

        console.log("Steps Data:", stepsResponse.data);

        const formattedStepsData = stepsResponse.data["activities-steps"].map((item) => ({
          date: item.dateTime,
          steps: parseInt(item.value, 10)
        }));

        setStepsData(formattedStepsData);
      } catch (error) {
        console.error("Error fetching Fitbit steps data:", error);
      }
    };

    fetchStepsData();
  }, [timeframe]);

  return (
    <div className="dashboard-container">
      <h2 className="text-white text-xl font-semibold mb-4">Daily Steps</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stepsData}>
            <XAxis dataKey="date" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Bar dataKey="steps" fill="#4F98CA" name="Steps" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Sleep Component - Fixing to handle empty sleep data
const SleepComponent = () => {
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      const token = localStorage.getItem("fitbit_access_token");
      if (!token) {
        console.log("No access token, redirecting to login...");
        window.location.href = "/";
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const today = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(new Date().getDate() - 7);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];

        // Fetch weekly data
        const sleepRangeResponse = await axios.get(
          `https://api.fitbit.com/1.2/user/-/sleep/date/${formattedSevenDaysAgo}/${today}.json`,
          { headers }
        );

        const formattedSleepData = sleepRangeResponse.data.sleep?.map((sleep) => ({
          date: sleep.dateOfSleep,
          deep: sleep.levels?.summary.deep?.minutes / 60 || 0,
          light: sleep.levels?.summary.light?.minutes / 60 || 0,
          rem: sleep.levels?.summary.rem?.minutes / 60 || 0,
          wake: sleep.levels?.summary.wake?.minutes / 60 || 0,
          totalHours: sleep.duration / (1000 * 60 * 60),
        }));

        if (formattedSleepData?.length > 0) {
          setSleepData(formattedSleepData);
        } else {
          setError("No sleep data available for the past week.");
        }
      } catch (error) {
        console.error("Error fetching Fitbit sleep data:", error);
        setError("Failed to load sleep data");
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, []);
  if (loading) {
    return (
      <div className="dashboard-container mt-8">
        <h2 className="text-white text-xl font-semibold mb-4">Sleep Analysis</h2>
        <div className="text-white">Loading sleep data...</div>
      </div>
    );
  }

  if (error && sleepData.length === 0) {
    return (
      <div className="dashboard-container mt-8">
        <h2 className="text-white text-xl font-semibold mb-4">Sleep Analysis</h2>
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container mt-8">
      <h2 className="text-white text-xl font-semibold mb-4">Sleep Analysis</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sleepData}>
            <XAxis dataKey="date" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#fff' }} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Legend />
            <Area type="monotone" dataKey="totalHours" stroke="#8884d8" fill="#8884d8" name="Total Sleep" />
            {sleepData[0] && sleepData[0].deep > 0 && (
              <>
                <Area type="monotone" dataKey="deep" stackId="1" stroke="#0047AB" fill="#0047AB" name="Deep" />
                <Area type="monotone" dataKey="light" stackId="1" stroke="#6495ED" fill="#6495ED" name="Light" />
                <Area type="monotone" dataKey="rem" stackId="1" stroke="#B0C4DE" fill="#B0C4DE" name="REM" />
                <Area type="monotone" dataKey="wake" stackId="1" stroke="#D3D3D3" fill="#D3D3D3" name="Awake" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Activity Component - Using working endpoints based on your logs
export const ActivityComponent = () => {
  const [caloriesData, setCaloriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeframe = "1w";

  useEffect(() => {
    const fetchActivityData = async () => {
      const token = localStorage.getItem("fitbit_access_token");
      if (!token) {
        console.log("No access token, redirecting to login...");
        window.location.href = "/";
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // From your logs, I can see this endpoint worked
        const caloriesResponse = await axios.get(
          `https://api.fitbit.com/1/user/-/activities/tracker/calories/date/today/${timeframe}.json`,
          { headers }
        );

        console.log("Tracker Calories Data:", caloriesResponse.data);

        // Get additional activity metrics
        const distanceResponse = await axios.get(
          `https://api.fitbit.com/1/user/-/activities/tracker/distance/date/today/${timeframe}.json`,
          { headers }
        );

        console.log("Distance Data:", distanceResponse.data);

        // Combine the data
        if (caloriesResponse.data["activities-tracker-calories"]) {
          const combinedData = caloriesResponse.data["activities-tracker-calories"].map((caloriesItem) => {
            const dateMatch = distanceResponse.data["activities-tracker-distance"]?.find(
              distanceItem => distanceItem.dateTime === caloriesItem.dateTime
            );

            return {
              date: caloriesItem.dateTime,
              calories: parseInt(caloriesItem.value, 10),
              distance: dateMatch ? parseFloat(dateMatch.value) : 0
            };
          });

          setCaloriesData(combinedData);
        }
      } catch (error) {
        console.error("Error fetching Fitbit activity data:", error);
        setError("Failed to load activity data");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="dashboard-container mt-8">
        <h2 className="text-white text-xl font-semibold mb-4">Activity & Calories</h2>
        <div className="text-white">Loading activity data...</div>
      </div>
    );
  }

  if (error && caloriesData.length === 0) {
    return (
      <div className="dashboard-container mt-8">
        <h2 className="text-white text-xl font-semibold mb-4">Activity & Calories</h2>
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container mt-8">
      <h2 className="text-white text-xl font-semibold mb-4">Activity & Calories</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caloriesData}>
            <XAxis dataKey="date" tick={{ fill: "#fff" }} />
            <YAxis yAxisId="left" tick={{ fill: "#fff" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#fff" }} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="calories"
              stroke="#FF6B6B"
              strokeWidth={2}
              name="Calories Burned"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="distance"
              stroke="#48CFAD"
              strokeWidth={2}
              name="Distance (km)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
// Updated Main Dashboard Component
const Dashboard = () => {
  return (
    <div className="flex bg-gray-900 min-h-screen  overflow-y-auto custom-scrollbar">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 pl-20 p-6 ">
      <h1 className="text-white text-2xl font-bold mb-6">Fitness Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Card */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <HeartRateComponent />
        </div>

        {/* Steps Card */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <StepsComponent />
        </div>

        {/* Sleep Analysis Card */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <SleepComponent />
        </div>

        {/* Activity Card */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <ActivityComponent />
        </div>
      </div>
    </div>
  </div>

  );
};

export default Dashboard;