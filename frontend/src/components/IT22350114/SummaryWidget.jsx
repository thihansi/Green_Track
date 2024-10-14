import React, { useState } from 'react';
import { Card } from 'flowbite-react';
import { PieChart } from 'react-minimal-pie-chart'; 
import "./ChartStyles.css";

const SummaryWidget = ({ totalWaste, totalRecyclable, totalNonRecyclable, yearlyRecyclable, yearlyNonRecyclable, selectedMonth }) => {
  const [hovered, setHovered] = useState(null);

  const data = [
    { title: 'Recyclable Waste', value: totalRecyclable, color: '#4caf50' }, // Green
    { title: 'Non-Recyclable Waste', value: totalNonRecyclable, color: '#f44336' }, // Red
  ];

  return (
    <Card className="p-4 shadow-md cartoon-card relative">
      <h2 className="text-xl font-bold mb-4 text-white">Waste Summary for the month of {selectedMonth}</h2> {/* Display selected month */}
      <div className="flex justify-between">
        <div className="flex flex-col text-white"> {/* Change text color to white */}
          <span className="text-lg">Total Waste Collected:</span>
          <span className="text-2xl font-semibold">{totalWaste} kg</span>
        </div>
        <div>
          <PieChart
            data={data}
            style={{ height: '100px' }} // Adjust height as needed
            label={(data) => data.dataEntry.title}
            labelStyle={{
              fontSize: '5px',
              fill: '#fff',
            }}
            onMouseOver={(e, index) => setHovered(index)}
            onMouseOut={() => setHovered(null)}
          />
          {hovered !== null && (
            <div className="absolute p-2 bg-gray-800 text-white rounded">
              <span>{data[hovered].title}: {data[hovered].value} kg</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-white"> {/* Change text color to white */}
        <div className="flex justify-between">
          <span className="text-lg">Recyclable Waste:</span>
          <span className="text-lg">{totalRecyclable} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg">Non-Recyclable Waste:</span>
          <span className="text-lg">{totalNonRecyclable} kg</span>
        </div>
      </div>
      {/* Yearly Summary Section */}

      <div className="mt-4 border-t border-gray-200 pt-4 text-white"> {/* Change text color to white */}
        {/* <h3 className="text-lg font-semibold">Yearly Summary</h3>
        <div className="flex justify-between">
          <span className="text-lg">Yearly Recyclable Waste:</span>
          <span className="text-lg">{yearlyRecyclable} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg">Yearly Non-Recyclable Waste:</span>
          <span className="text-lg">{yearlyNonRecyclable} kg</span>
        </div> */}
      </div>
      
    </Card>
  );
};

export default SummaryWidget;
