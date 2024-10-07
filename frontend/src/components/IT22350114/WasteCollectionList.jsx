// WasteCollectionList.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Alert } from "flowbite-react";

const WasteCollectionList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [wasteCollections, setWasteCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleUpdate = (collection) => {
    // Navigate to the update form with the collection data
    // Assuming you have a route for updating the waste collection
    // Example: navigate(`/update-waste-collection/${collection._id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Waste Collections</h2>
      <table className="min-w-full">
        <thead>
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
            <tr key={collection.collectionId}>
              <td className="border px-4 py-2">{collection.collectionId}</td>
              <td className="border px-4 py-2">
                {new Date(collection.collectionDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{collection.status}</td>
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
  );
};

export default WasteCollectionList;
