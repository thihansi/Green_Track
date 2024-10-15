import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Alert, Select } from "flowbite-react";
import SummaryWidget from "./SummaryWidget"; // Adjust the path as necessary
import MonthlyWasteTrends from "./MonthlyWasteTrends"; // Adjust the path as necessary


const UserWasteCollectionList = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [wasteCollections, setWasteCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [monthlySummary, setMonthlySummary] = useState({});
    const [yearlyTotals, setYearlyTotals] = useState({
      totalRecyclable: 0,
      totalNonRecyclable: 0,
    });
  
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
          calculateMonthlySummary(data); // Calculate the monthly summary
  
          // Calculate yearly totals
          const { totalRecyclable, totalNonRecyclable } = calculateYearlyTotals(data);
          setYearlyTotals({ totalRecyclable, totalNonRecyclable }); // Store in state for later use
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchWasteCollections();
    }, [currentUser.username]);
  
    const calculateMonthlySummary = (collections) => {
      const summary = {};
      collections.forEach((collection) => {
        const month = new Date(collection.collectionDate).getMonth() + 1; // Get month (1-12)
        const totalWeight = collection.garbage.reduce(
          (sum, item) => sum + item.weight,
          0
        );
  
        if (!summary[month]) {
          summary[month] = {
            totalWeight: 0,
            count: 0,
            totalRecyclable: 0,
            totalNonRecyclable: 0,
          };
        }
        summary[month].totalWeight += totalWeight;
        summary[month].count += 1;
  
        // Calculate recyclable and non-recyclable weights
        collection.garbage.forEach((item) => {
          if (item.wasteType === "Recyclable") {
            summary[month].totalRecyclable += item.weight;
          } else {
            summary[month].totalNonRecyclable += item.weight;
          }
        });
      });
      setMonthlySummary(summary);
    };
  
    const calculateYearlyTotals = (collections) => {
      let totalRecyclable = 0;
      let totalNonRecyclable = 0;
  
      collections.forEach((collection) => {
        collection.garbage.forEach((item) => {
          if (item.wasteType === "Recyclable") {
            totalRecyclable += item.weight;
          } else {
            totalNonRecyclable += item.weight;
          }
        });
      });
  
      return { totalRecyclable, totalNonRecyclable };
    };
  
    const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
    };
  
    const totalRecyclable = monthlySummary[selectedMonth]?.totalRecyclable || 0;
    const totalNonRecyclable =
      monthlySummary[selectedMonth]?.totalNonRecyclable || 0;
  
    const trendsData = Object.keys(monthlySummary).map((month) => ({
      month: new Date(0, month - 1).toLocaleString("default", { month: "long" }),
      recyclable: monthlySummary[month]?.totalRecyclable || 0,
      nonRecyclable: monthlySummary[month]?.totalNonRecyclable || 0,
    }));
  
    const filteredCollections = wasteCollections.filter((collection) => {
      const month = new Date(collection.collectionDate).getMonth() + 1;
      return month === parseInt(selectedMonth, 10);
    });
  
    if (loading) return <div>Loading...</div>;
    if (error) return <Alert color="failure">{error}</Alert>;
  
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Your Waste Collections
        </h2>
  
        {/* Summary Widgets */}
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="flex-1 mx-2">
            <SummaryWidget
              totalWaste={totalRecyclable + totalNonRecyclable} 
              totalRecyclable={totalRecyclable}
              totalNonRecyclable={totalNonRecyclable}
              yearlyRecyclable={yearlyTotals.totalRecyclable}
              yearlyNonRecyclable={yearlyTotals.totalNonRecyclable}
            />
          </div>
          <div className="flex-1 mx-2">
            <MonthlyWasteTrends data={trendsData} />
          </div>
        </div>
  
        {/* Monthly Summary Section */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Monthly Summary</h3>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full md:w-1/3"
          >
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </Select>
          <div className="mt-4">
            <h4 className="font-bold">
              Total Waste Collected in{" "}
              {new Date(0, selectedMonth - 1).toLocaleString("default", {
                month: "long",
              })}:
            </h4>
            <p className="text-lg">
              {monthlySummary[selectedMonth]?.totalWeight || 0} kg
            </p>
            <p className="text-sm text-gray-500">
              Total Collections: {monthlySummary[selectedMonth]?.count || 0}
            </p>
          </div>
        </div>
  
        {/* Waste Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <Card key={collection.collectionId} className="shadow-lg p-4">
              <h3 className="text-xl font-semibold">
                Collection ID: {collection.collectionId}
              </h3>
              <p className="text-gray-600">
                Date: {new Date(collection.collectionDate).toLocaleDateString()}
              </p>
              <p
                className={`text-sm ${
                  collection.status === "Collected"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {collection.status}
              </p>
              <h4 className="text-lg font-bold mt-2">Garbage Items</h4>
              <ul className="list-disc list-inside">
                {collection.garbage.map((item, index) => (
                  <li key={index}>
                    <span className="font-semibold">{item.weight} kg</span> of{" "}
                    {item.category}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {collection.garbage.map((item, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div
                      className={`w-4 h-4 mr-2 ${
                        item.wasteType === "Recyclable"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      } rounded-full`}
                    ></div>
                    <span>{item.wasteType}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  export default UserWasteCollectionList;
  