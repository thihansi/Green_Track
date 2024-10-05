import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";

const UpdateSchedules = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    RequestID: "",
    CustomerName: "",
    Category: "",
    ScheduleDate: "",
    Location: "",
    email: "",
    Additional_Note: "",
    Status: "Initial",
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      const requestid = params.requestid;
      const res = await fetch(`/api/wasteSchedule/oneschedule/${requestid}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      const formattedDate = new Date(data.ScheduleDate)
        .toISOString()
        .split("T")[0];
      setFormData({
        RequestID: data.RequestID,
        CustomerName: data.CustomerName,
        Category: data.Category,
        ScheduleDate: formattedDate,
        Location: data.Location,
        email: data.email,
        Additional_Note: data.Additional_Note,
        Status: data.Status,
      });
    };
    fetchSchedule();
  }, []);

  const handleChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "date"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: boolean !== null ? boolean : e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.RequestID === currentUser.RequestID)
        return setError("RequestID already exists");
      setLoading(true);
      setError(false);

      const res = await fetch(
        `/api/wasteSchedule/updateschedule/${params.requestid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      //navigate(`/task-assign/${data._id}`);
      navigate("/dashboard?tab=waste-schedule");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-white dark:bg-gray-800">
      <main>
        <h1 className="text-3xl text-center mt-6 font-extrabold  text-lime-600 dark:text-lime-300">
          🗑️Update Requested Waste Collection Requests🗑️
        </h1>
      </main>
      <div className="flex p-3 w-full max-w-lg mx-auto flex-col mt-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-lime-300 dark:border-lime-600">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div>
            <Label value="RequestID" />
            <TextInput
              type="text"
              name="RequestID"
              placeholder="RequestID"
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
              placeholder="CustomerName"
              required
              onChange={handleChange}
              value={formData.CustomerName}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <Label value="Category" />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, Category: e.target.value })
            }
            value={formData.Category || ""}
            className="border-lime-300 dark:border-lime-600"
          >
            <option value="">Select a Category</option>
            <option value="Elavator">Regular</option>
            <option value="Pest Control">Special</option>
          </Select>

          <div>
            <Label htmlFor="date">ScheduleDate:</Label>
            <TextInput
              type="date"
              id="ScheduleDate"
              name="ScheduleDate"
              min={new Date().toISOString().split("T")[0]}
              value={formData.ScheduleDate || ""}
              onChange={handleChange}
               className="border-lime-300 dark:border-lime-600"
            />
          </div>

          <div>
            <Label value="Location" />
            <TextInput
              type="text"
              name="Location"
              placeholder="Location"
              required
              onChange={handleChange}
              value={formData.Location}
               className="border-lime-300 dark:border-lime-600"
            />
          </div>
          <div>
            <Label value="Additional_Note" />
            <Textarea
              type="textarea"
              name="Additional_Note"
              placeholder="Add a Additional Note..."
              rows="3"
              maxLength="200"
              required
              onChange={handleChange}
              value={formData.Additional_Note}
              className="border-lime-300 dark:border-lime-600"
            />
          </div>
          <div>
            <div></div>
          </div>
          <Button
            type="submit"
            gradientDuoTone="tealToLime"
            className="uppercase"
          >
            {loading ? "updating..." : "Update task"}
          </Button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdateSchedules;
