import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { generateCSVReport, generateExcelReport, generatePDFReport } from "../../utils";

const WasteCollectionList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [wasteCollections, setWasteCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWasteCollections = async () => {
      try {
        const url = currentUser.WasteCollectionManager
          ? `/api/wasteCollection/get`
          : `/api/wasteCollection/getByResidentId/${currentUser.username}`;

        const response = await fetch(url);
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
  }, [currentUser.username, currentUser.WasteCollectionManager]);

  const handleDelete = async (collectionId) => {
    if (window.confirm("Are you sure you want to delete this waste collection record?")) {
      try {
        const response = await fetch(`/api/wasteCollection/delete/${collectionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to delete the waste collection");
        }

        setWasteCollections((prev) =>
          prev.filter((collection) => collection._id !== collectionId)
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdate = (collection) => {
    navigate(`/update/${collection._id}`);
  };

  const prepareReportData = () => {
    let totalRecyclablesWeight = 0;
    let totalNonRecyclablesWeight = 0;

    const reportData = wasteCollections.map((collection) => {
      let recyclables = [];
      let nonRecyclables = [];

      collection.garbage.forEach((item) => {
        if (["Paper", "Plastic", "Glass"].includes(item.category)) {
          recyclables.push(`${item.weight}kg of ${item.category}`);
          totalRecyclablesWeight += item.weight;
        } else if (["Food Waste", "Organic", "Hazardous", "Metal"].includes(item.category)) {
          nonRecyclables.push(`${item.weight}kg of ${item.category}`);
          totalNonRecyclablesWeight += item.weight;
        } else {
          // Handle any unrecognized waste types by categorizing them as non-recyclable (or log for review)
          nonRecyclables.push(`${item.weight}kg of ${item.category}`);
          totalNonRecyclablesWeight += item.weight;
        }
      });

      return {
        collectionId: collection.collectionId,
        residentId: collection.residentId,
        collectionDate: new Date(collection.collectionDate).toLocaleDateString(),
        recyclables: recyclables.length ? recyclables.join(', ') : '0kg',
        nonRecyclables: nonRecyclables.length ? nonRecyclables.join(', ') : '0kg',
      };
    });

    // Add totals row at the end
    reportData.push({
      collectionId: 'Total',
      residentId: '',
      collectionDate: '',
      recyclables: `${totalRecyclablesWeight}kg`,
      nonRecyclables: `${totalNonRecyclablesWeight}kg`,
    });

    return reportData;
  };




  // const handleCSVReport = () => {
  //   const headers = ["Collection ID", "Resident ID", "Collection Date", "Recyclables", "Non-Recyclables"];
  //   const rows = prepareReportData().map(row => [
  //     row.collectionId,
  //     row.residentId,
  //     row.collectionDate,
  //     row.recyclables,
  //     row.nonRecyclables,
  //   ]);

  //   generateCSVReport(headers, rows, 'WasteCollectionReport');
  // };



  const handleExcelReport = () => {
    const headers = ["Collection ID", "Resident ID", "Collection Date", "Recyclables", "Non-Recyclables"];
    const rows = prepareReportData().map(row => [
      row.collectionId,
      row.residentId,
      row.collectionDate,
      row.recyclables,
      row.nonRecyclables,
    ]);

    generateExcelReport(headers, rows, 'WasteCollectionReport');
  };

  const handlePDFReport = () => {
    const headers = ["Collection ID", "Resident ID", "Collection Date", "Recyclables", "Non-Recyclables"];
    const rows = prepareReportData().map(row => [
      row.collectionId,
      row.residentId,
      row.collectionDate,
      row.recyclables,
      row.nonRecyclables,
    ]);

    generatePDFReport(headers, rows, 'WasteCollectionReport');
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
              <th className="border px-4 py-2">Resident ID</th>
              <th className="border px-4 py-2">Collection Date</th>
              <th className="border px-4 py-2">Garbage Items</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wasteCollections.map((collection) => (
              <tr key={collection._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{collection.collectionId}</td>
                <td className="border px-4 py-2">{collection.residentId}</td>
                <td className="border px-4 py-2">
                  {new Date(collection.collectionDate).toLocaleDateString()}
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
                  <Button onClick={() => handleDelete(collection._id)} color="failure">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons to generate reports */}
      <div className="mt-6 flex space-x-4">
        <Button onClick={handlePDFReport} color="success">
          Generate PDF Report
        </Button>
        <Button onClick={handleExcelReport} color="success">
          Generate Excel Report
        </Button>
        {/* <Button onClick={handleCSVReport} color="success">
          Generate CSV Report
        </Button> */}

      </div>
    </div>
  );
};

export default WasteCollectionList;
