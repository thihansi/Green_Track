import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  TextInput,
  Select,
  Alert,
} from "flowbite-react";

const WasteCollectionForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    collectionId: "",
    residentId: "",
    collectionDate: "",
    status: "Scheduled",
    garbage: [
      {
        wasteType: "Recyclable",
        category: "Paper", // Set a default category value for initial render
        weight: "",
      },
    ],
  });

  const RECYCLABLE_TYPES = ["Paper", "Plastic", "Glass", "Metal"];
  const NON_RECYCLABLE_TYPES = ["Food Waste", "Organic", "Hazardous", "Other"];

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
    setFormData({ ...formData, garbage: updatedGarbage });
    console.log("Updated Garbage:", updatedGarbage);
  };

  // Add a new garbage item
  const addGarbageItem = () => {
    setFormData({
      ...formData,
      garbage: [...formData.garbage, { wasteType: 'Recyclable', category: 'Paper', weight: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final Payload before submission:", JSON.stringify(formData, null, 2)); // Log the payload with better readability

    try {
      setLoading(true);
      setError('');
      const payload = { ...formData, userRef: currentUser._id };
      const response = await fetch('/api/wasteCollection/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        return setError(data.message || 'An error occurred');
      }
      navigate('/dashboard?tab=waste-collection');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Waste Collection Form</h1>
      
      {/* Display error message */}
      {error && <Alert color="failure">{error}</Alert>}
      
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

        {/* Resident ID */}
        <div>
          <Label htmlFor="residentId">Resident ID</Label>
          <TextInput
            id="residentId"
            type="text"
            name="residentId"
            value={formData.residentId}
            onChange={handleChange}
            placeholder="e.g., 6123abc4567def8901234567"
            required
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
            <div key={index} className="border p-4 rounded-lg space-y-4 mb-4 bg-gray-50">
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
                  {(garbageItem.wasteType === 'Recyclable' ? RECYCLABLE_TYPES : NON_RECYCLABLE_TYPES).map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
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
        <Button type="submit" color="success" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default WasteCollectionForm;
