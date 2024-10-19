import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; 
import { Button, Label, TextInput, Select } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const WasteCollectionForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { collectionId } = useParams(); 
  const navigate = useNavigate();  // Add navigate hook

  const RECYCLABLE_TYPES = ["Paper", "Plastic", "Glass", "Metal"];
  const NON_RECYCLABLE_TYPES = ["Food Waste", "Organic", "Hazardous", "Other"];

  // Define the initial form state
  const initialFormState = {
    collectionId: "",
    residentId: currentUser?.username || "",
    collectionDate: "",
    status: "Scheduled",
    garbage: [
      {
        wasteType: "Recyclable",
        category: "Paper",
        weight: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the waste collection data for the update
  useEffect(() => {
    const fetchWasteCollectionData = async () => {
      if (collectionId) {
        try {
          const response = await fetch(
            `/api/wasteCollection/fetch/${collectionId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch waste collection data");
          }
          const data = await response.json();

          const formattedDate = new Date(data.collectionDate).toISOString().split('T')[0];

          setFormData({
            ...data,
            collectionDate: formattedDate,
            residentId: currentUser?.username || "",
          });
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchWasteCollectionData();
  }, [collectionId, currentUser.username]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes in garbage item fields
  const handleGarbageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGarbage = [...formData.garbage];
    updatedGarbage[index] = { ...updatedGarbage[index], [name]: value };

    if (name === "wasteType") {
      const defaultCategory =
        value === "Recyclable" ? RECYCLABLE_TYPES[0] : NON_RECYCLABLE_TYPES[0];
      updatedGarbage[index].category = defaultCategory;
    }

    setFormData({ ...formData, garbage: updatedGarbage });
  };

  // Add a new garbage item
  const addGarbageItem = () => {
    setFormData({
      ...formData,
      garbage: [
        ...formData.garbage,
        { wasteType: "Recyclable", category: "Paper", weight: "" },
      ],
    });
  };

  // Reset form to initial state after submission
  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final Payload before submission:", JSON.stringify(formData, null, 2));

    try {
      setLoading(true);
      setError("");

      let url = "/api/wasteCollection/create";  
      let method = "POST";  

      if (formData._id) {
        url = `/api/wasteCollection/update/${formData._id}`;  
        method = "PUT";  
      }

      const payload = { ...formData, userRef: currentUser._id };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        return setError(data.message || "An error occurred");
      }

      // Show success toast notification
      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Clear form if it's a new entry (creation)
      if (!formData._id) {
        resetForm(); // Clear the form after successful creation
      } else {
        // Redirect to dashboard after update
        navigate("/dashboard?tab=waste-collection");
      }

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        {collectionId ? "Update Waste Collection" : "Waste Collection Form"}
      </h1>

      {error && <Alert color="failure">{error}</Alert>}

      <ToastContainer />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Collection ID */}
        <div>
          <Label htmlFor="collectionId">Collection ID</Label>
          <TextInput
            id="collectionId"
            type="text"
            name="collectionId"
            value={formData.collectionId}
            onChange={handleChange}
            placeholder="e.g., COL12345"
            required
          />
        </div>

        {/* Resident ID (read-only) */}
        <div>
          <Label htmlFor="residentId">Resident ID</Label>
          <TextInput
            id="residentId"
            type="text"
            name="residentId"
            value={formData.residentId}
            readOnly
            className="bg-gray-200"
          />
        </div>

        {/* Collection Date */}
        <div>
          <Label htmlFor="collectionDate">Collection Date</Label>
          <TextInput
            id="collectionDate"
            type="date"
            name="collectionDate"
            value={formData.collectionDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Collected">Collected</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        {/* Garbage Items */}
        <div>
          <h2 className="text-xl font-semibold">Garbage Items</h2>
          {formData.garbage.map((garbageItem, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg space-y-4 mb-4 bg-gray-50"
            >
              <h4 className="text-lg font-bold">Garbage Item {index + 1}</h4>

              {/* Waste Type */}
              <div>
                <Label htmlFor={`wasteType-${index}`}>Waste Type</Label>
                <Select
                  id={`wasteType-${index}`}
                  name="wasteType"
                  value={garbageItem.wasteType}
                  onChange={(e) => handleGarbageChange(index, e)}
                >
                  <option value="Recyclable">Recyclable</option>
                  <option value="Non-Recyclable">Non-Recyclable</option>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor={`category-${index}`}>Category</Label>
                <Select
                  id={`category-${index}`}
                  name="category"
                  value={garbageItem.category}
                  onChange={(e) => handleGarbageChange(index, e)}
                  required
                >
                  {(garbageItem.wasteType === "Recyclable"
                    ? RECYCLABLE_TYPES
                    : NON_RECYCLABLE_TYPES
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Weight */}
              <div>
                <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                <TextInput
                  id={`weight-${index}`}
                  type="number"
                  name="weight"
                  value={garbageItem.weight}
                  onChange={(e) => handleGarbageChange(index, e)}
                  min="0"
                  required
                />
              </div>
            </div>
          ))}

          {/* Add Another Garbage Item */}
          <Button type="button" color="gray" onClick={addGarbageItem}>
            Add Another Garbage Item
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          color="success"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default WasteCollectionForm;
