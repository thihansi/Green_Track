import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import WasteFactory from "../../../../backend/models/IT22350114/wasteFactory";
import { generateCollectionId } from "../../utils";

const WasteCollectionForm = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  // Define the waste categories
  const RECYCLABLE_TYPES = ["Paper", "Plastic", "Glass", "Metal"];
  const NON_RECYCLABLE_TYPES = ["Food Waste", "Organic", "Hazardous", "Other"];

  // Define the initial form state
  const initialFormState = {
    collectionId: collectionId || generateCollectionId(),
    residentId: "",  // Leave Resident ID blank
    collectionDate: collectionId ? "" : new Date().toISOString().split('T')[0], // Set current date only if it's a new form
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
          });
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchWasteCollectionData();
  }, [collectionId]);

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

    // Reset the category based on wasteType selection
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
    setFormData({
      ...initialFormState,
      collectionId: generateCollectionId(),  // Generate a new unique ID for the new form
    });
  };

  // Handle form submission
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

      // Use Factory Method to generate garbage items
      const updatedGarbage = formData.garbage.map(item => 
        WasteFactory.createWaste(item.wasteType, item.category, item.weight)
      );

      const payload = { ...formData, garbage: updatedGarbage };

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
        resetForm();
      } else {
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

      {error && <div className="text-red-500">{error}</div>}

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
            readOnly // This makes the input non-editable
            required
          />
        </div>

        {/* Resident ID (leave blank) */}
        <div>
          <Label htmlFor="residentId">Resident ID</Label>
          <TextInput
            id="residentId"
            type="text"
            name="residentId"
            value={formData.residentId} // Will remain blank initially
            onChange={handleChange}  // Allow user input
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
