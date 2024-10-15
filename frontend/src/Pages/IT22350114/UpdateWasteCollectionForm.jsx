// UpdateWasteCollectionForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WasteCollectionForm from './WasteCollectionForm'; // Import the existing form component

const UpdateWasteCollectionForm = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams(); // Get the ID from the URL
  const [initialData, setInitialData] = useState(null); // State for initial data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const response = await fetch(`/api/wasteCollection/fetch/${collectionId}`); // Fetch the existing data by ID
        if (!response.ok) {
          throw new Error('Failed to fetch collection data');
        }
        const data = await response.json();
        setInitialData(data); // Set the initial data for the form
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId]);

  const handleUpdate = async (formData) => {
    try {
      const response = await fetch(`/api/wasteCollection/update/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update the waste collection');
      }

      navigate('/WasteCollection'); // Redirect after update
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <WasteCollectionForm
      initialData={initialData}
      mode="update"
      onSubmit={handleUpdate}
    />
  );
};

export default UpdateWasteCollectionForm;
