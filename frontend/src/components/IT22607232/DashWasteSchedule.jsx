
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";
import Schedule from "./S_images/Schedule.png";


const DashWasteSchedule = () => {
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
      showScheduleError(true);
    }
  };

  return (
    <div className="p-3 max-w-full mx-auto">

<div className="relative min-h-screen"> {/* Set to min-h-screen to cover the full viewport height */}
  {/* Background Image */}
  <img
    src={Schedule}
    alt="Background Schedule"
    className="absolute inset-0 w-full h-full object-cover opacity-50" 
    style={{
      transform: "scale(1.3)", 
     
    }}
  />
      
        <div
          className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7"
          style={{ position: "relative", zIndex: 1 }}
        >
          <h1 className="text-center mt-7 font-extrabold text-3xl underline text-black dark:text-white">
            Request Waste Collection
          </h1>
       
          <Button className="rounded-md" gradientDuoTone="tealToLime">
                <Link to="/create-request" >Request Waste collection</Link>
            </Button>

            <Button className="rounded-md" gradientDuoTone='tealToLime'>
              <Link to="/request-table">Show Placed Requests</Link>
            </Button>

            <Button className="rounded-md" gradientDuoTone='tealToLime'>
              <Link to="/">Track Request Status</Link>
            </Button>
          </div>

        </div>
      </div>
   
  );
};

export default DashWasteSchedule;
