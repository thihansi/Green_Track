import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import wasteDash from "/wasteDash.png";

// Register ChartJS elements
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WasteRequestSchedulePage() {
  const { currentUser } = useSelector((state) => state.user);
  const [showScheduleError, setShowScheduleError] = useState(false);
  const [showSchedules, setShowSchedules] = useState([]);

  useEffect(() => {
    handleShowPlacements();
  }, [currentUser._id]);

  const handleShowPlacements = async () => {
    try {
      const res = await fetch("/api/wasteSchedule/allschedules");
      const data = await res.json();
      if (data.success === false) {
        setShowScheduleError(true);
        return;
      }
      setShowSchedules(data);
    } catch (error) {
      setShowScheduleError(true);
    }
  };

  const pieData = {
    labels: ["Malabe", "Battaramulla", "Wellampitiya", "Nugegoda"],
    datasets: [
      {
        data: [30, 50, 20, 70],
        backgroundColor: ["#4BC0C0", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  const lineData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Waste In/Out",
        data: [300, 500, 200, 450, 320],
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-white p-8">
      {/* Buttons on top */}
      <div className="flex justify-center gap-6 mb-6">
        <Button className="rounded-md" gradientDuoTone="tealToLime">
          <Link to="/create-request">Request Waste Collection</Link>
        </Button>
        <Button className="rounded-md" gradientDuoTone="tealToLime">
          <Link to="/request-table">Show Placed Requests</Link>
        </Button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center w-full gap-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="p-6 bg-slate-300 text-black shadow-md rounded-lg">
            <h3 className="font-bold text-lg">Requests📝🚛</h3>
            <p className="text-3xl">21</p>
          </div>
          <div className="p-6 bg-slate-300 text-black shadow-md rounded-lg">
            <h3 className="font-bold text-lg">Pending🔖📜</h3>
            <p className="text-3xl">2</p>
          </div>
          <div className="p-6 bg-slate-300 text-black shadow-md rounded-lg">
            <h3 className="font-bold text-lg">Achieved⏳🎉</h3>
            <p className="text-3xl">19</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-row gap-6 w-full">
          {/* Pie Chart */}
          <div className="flex-1 p-6 bg-emerald-300 text-black shadow-md rounded-lg">
            <h3 className="font-bold text-lg">Customer Based Region</h3>
            <Pie data={pieData} />
          </div>

          {/* Line Chart */}
          <div className="flex-1 p-6  bg-emerald-300 text-black shadow-md rounded-lg">
            <h3 className="font-bold text-lg">Waste In & Out (7 Days)</h3>
            <Line data={lineData} />
          </div>

          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="wasteDash.png"
              alt="Waste Dashboard"
              className="w-64 h-auto shadow-md rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
