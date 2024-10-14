import React from 'react';
import { Card } from 'flowbite-react';
import { PieChart } from 'react-minimal-pie-chart'; 
import "./ChartStyles.css";

const YearlySummaryWidget = ({ yearlyRecyclable, yearlyNonRecyclable }) => {
  const data = [
    { title: 'Recyclable Waste', value: yearlyRecyclable, color: '#fde047' }, // yellow
    { title: 'Non-Recyclable Waste', value: yearlyNonRecyclable, color: '#f97316' }, // orange
  ];

  return (
    <Card className="p-4 shadow-md cartoon-card2 mb-4" style={{ maxWidth: '400px', margin: 'auto', height: '250px' }}>
      <h2 className="text-lg font-bold mb-2 text-white">Yearly Summary</h2>
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-sm text-white">
          <span>Recyclable Waste: {yearlyRecyclable} kg</span>
          <span>Non-Recyclable Waste: {yearlyNonRecyclable} kg</span>
        </div>
        <PieChart
          data={data}
          style={{ height: '100px', width: '100px' }} // Adjust height and width for better visibility
          label={({ dataEntry }) => dataEntry.title}
          labelStyle={{
            fontSize: '6px', // Increase label font size
            fill: '#fff',
          }}
          lineWidth={45} // Increased thickness for better visibility
          radius={40} // Increase radius to make the chart larger
          segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }} // Animation for hover
        />
      </div>
    </Card>
  );
};

export default YearlySummaryWidget;
