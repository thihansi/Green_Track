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
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    RequestID: "",
    CustomerName: "",
    Category: "",
    ScheduleDate: "",
    email: "",
    Additional_Note: "",
    Location: "",
    Status: "Pending", // Default status
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.RequestID === currentUser.RequestID)
        return setError("RequestID already exists");
      setLoading(true);
      setError("");

      const res = await fetch("/api/wasteSchedule/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const subject = data.RequestID;

        const text = `RequestID: ${data.RequestID}\nCustomerName: ${data.CustomerName}\nScheduleDate: ${data.ScheduleDate}\nLocation: ${data.Location}\nCategory: ${data.Category}\nStatus: ${data.Status}`;
        await handleEmailSending(data.email, subject, text);
        toast.success(
          "Waste Collection Request Placed successfully! Email sent"
        );
        navigate("/dashboard?tab=waste-schedule");
      } else {
        toast.error(data.message || "Failed to place schedule!");
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const generatedID = generateRequestId();
    setFormData((prevFormData) => ({
      ...prevFormData,
      RequestID: generatedID,
    }));
  }, []);

  const handleEmailSending = async (to, subject, text) => {
    try {
      await fetch(`/api/wasteSchedule/sendEmail/${to}/${subject}/${text}`, {
        method: "POST",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-white dark:bg-gray-800">
      <main>
        <h1 className="text-3xl text-center mt-6 font-extrabold  text-lime-600 dark:text-lime-300">
          🚛 Request Waste Collection🚛
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
              onChange={(e) =>
                setFormData({ ...formData, Category: e.target.value })
              }
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
