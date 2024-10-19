import React from 'react';
import { useNavigate } from 'react-router-dom';

const WasteCollection = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Navigate to the WasteCollectionForm page
    navigate('/wastecollection/form');
  };

  return (
    <div className="p-3 bg-amber-100 dark:bg-slate-700 min-h-screen border border-teal-500 rounded-tl-3xl rounded-br-3xl m-5">
      <h1 className='text-3xl text-center mt-6 font-extrabold underline '>Waste Collection</h1>
      
      {/* Button to navigate to the form */}
      <div className="text-center mt-8">
        <button
          onClick={handleNavigate}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Go to Waste Collection Form
        </button>
      </div>
    </div>
  );
}

export default WasteCollection;