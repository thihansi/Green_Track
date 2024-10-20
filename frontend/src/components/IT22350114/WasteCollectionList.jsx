import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Alert, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const WasteCollectionList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [wasteCollections, setWasteCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchWasteCollections = async () => {
      try {
        const response = await fetch(
          `/api/wasteCollection/getByResidentId/${currentUser.username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch waste collections");
        }
        const data = await response.json();
        setWasteCollections(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteCollections();
  }, [currentUser.username]);

  const handleDelete = async (collectionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this waste collection record?"
      )
    ) {
      try {
        const response = await fetch(
          `/api/wasteCollection/delete/${collectionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || "Failed to delete the waste collection"
          );
        }

        // Remove the deleted item from the state
        setWasteCollections((prev) =>
          prev.filter((collection) => collection._id !== collectionId)
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleStatusChange = async (collection, newStatus) => {
    try {
      const response = await fetch(
        `/api/wasteCollection/update/${collection._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update the local state with the new status
      setWasteCollections((prev) =>
        prev.map((item) =>
          item._id === collection._id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = (collection) => {
    // Navigate to the update form with the collection ID
    navigate(`/update/${collection._id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert color="failure">{error}</Alert>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Waste Collections</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border px-4 py-2">Collection ID</th>
              <th className="border px-4 py-2">Collection Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Garbage Items</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wasteCollections.map((collection) => (
              <tr key={collection.collectionId} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{collection.collectionId}</td>
                <td className="border px-4 py-2">
                  {new Date(collection.collectionDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <Select
                    value={collection.status}
                    onChange={(e) => handleStatusChange(collection, e.target.value)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Collected">Collected</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                </td>
                <td className="border px-4 py-2">
                  <ul>
                    {collection.garbage.map((item, index) => (
                      <li key={index}>
                        {item.weight} kg of {item.category}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2">
                  <Button onClick={() => handleUpdate(collection)} color="info">
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDelete(collection._id)}
                    color="failure"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WasteCollectionList;
