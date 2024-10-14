import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Select,
  TextInput,
  Textarea,
  Alert,
} from "flowbite-react";
import { toast } from "react-toastify";

const generateRequestId = () =>
  `GTWCRID-${Math.floor(10000 + Math.random() * 90000)}`;

const ScheduleRequest = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user); // Ensure currentUser has the logged-in user's data
  
  const [formData, setFormData] = useState({
    RequestID: "",
    CustomerName: "",
    Category: "",
    ScheduleDate: "",
    email: "",
    Additional_Note: "",
    Location: "",
    Status: "Initialized", // Default 
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error on submit
    setError("");

    try {
      setLoading(true);

      // Log form data and user ID for debugging purposes
      console.log("Payload:", {
        ...formData,
        userId: currentUser._id,
      });

      // Make the API request to create the waste collection request
      const res = await fetch("/api/wasteSchedule/create-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // Ensure the authorization token is passed
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser._id, // Add userId from logged-in user
        }),
      });

      const data = await res.json();

      // Log API response for debugging
      console.log("API Response:", data);

      // Check if request was successful
      if (res.ok && data.success) {
        // Success toast notification
        toast.success("Waste Collection Request Placed successfully! Email sent");

        // Reset form or navigate back
        navigate("/waste-schedule");
      } else {
        // Handle specific error status codes for better user feedback
        if (res.status === 400) {
          toast.error("Bad request. Please check your input.");
        } else if (res.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(data.message || "Failed to place schedule!");
        }
      }

    } catch (error) {
      setError(error.message || "An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  // Set the generated request ID 
  useEffect(() => {
    const generatedID = generateRequestId();
    setFormData((prevFormData) => ({
      ...prevFormData,
      RequestID: generatedID,
    }));
  }, []);

  return (
    <div className="min-h-screen mt-20 bg-white dark:bg-gray-800">
      <main>
        <h1 className="text-3xl text-center mt-6 font-extrabold text-lime-600 dark:text-lime-300">
          🚛 Request Waste Collection 🚛
        </h1>
      </main>
      <div className="flex p-3 w-full max-w-lg mx-auto flex-col mt-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-lime-300 dark:border-lime-600">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div>
            <Label value="RequestID" />
            <TextInput
              type="text"
              name="RequestID"
              required
              onChange={handleChange}
              value={formData.RequestID}
              readOnly
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="CustomerName" />
            <TextInput
              type="text"
              name="CustomerName"
              required
              onChange={handleChange}
              value={formData.CustomerName}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="Category" />
            <Select
              name="Category"
              onChange={handleChange}
              value={formData.Category}
              className="border-lime-300 dark:border-lime-600"
            >
              <option value="">Select a Category</option>
              <option value="Regular">Regular</option>
              <option value="Special">Special</option>
            </Select>
          </div>

          <div>
            <Label value="ScheduleDate" />
            <TextInput
              type="date"
              name="ScheduleDate"
              min={new Date().toISOString().split("T")[0]}
              required
              onChange={handleChange}
              value={formData.ScheduleDate}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="Email Address" />
            <TextInput
              type="email"
              name="email"
              required
              onChange={handleChange}
              value={formData.email}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="Additional Note" />
            <Textarea
              name="Additional_Note"
              placeholder="Add a Description..."
              rows="3"
              maxLength="200"
              onChange={handleChange}
              value={formData.Additional_Note}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="Location" />
            <TextInput
              type="text"
              name="Location"
              required
              onChange={handleChange}
              value={formData.Location}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="Status" />
            <TextInput
              type="text"
              name="Status"
              value={formData.Status}
              readOnly
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <Button
            type="submit"
            gradientDuoTone="tealToLime"
            className="uppercase"
            disabled={loading}
          >
            {loading ? "Scheduling..." : "Place Request"}
          </Button>

          {error && (
            <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-md text-center text-red-600 text-base tracking-wide animate-bounce">
              {error}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default ScheduleRequest;
