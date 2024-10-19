import React, { useEffect, useState } from 'react';
import { Button, Table } from 'flowbite-react'; // Import Flowbite components

const PricingTable = () => {
    const [pricingData, setPricingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [currentItem, setCurrentItem] = useState({ id: '', item: '', pricePerUnit: '' });
    const [newItem, setNewItem] = useState({ item: '', pricePerUnit: '' });

    // Function to fetch pricing data
    const fetchPricingData = async () => {
        try {
            const response = await fetch('/api/pricing/get');
            if (!response.ok) {
                throw new Error('Failed to fetch pricing data.');
            }
            const data = await response.json();
            setPricingData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricingData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/pricing/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPricingData(pricingData.filter(item => item._id !== id));
                setSuccessMessage('Item deleted successfully.');
                setError('');
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message}`);
                setSuccessMessage('');
            }
        } catch (err) {
            setError('Failed to delete item.');
            setSuccessMessage('');
        }
    };

    const handleEdit = (item) => {
        setCurrentItem({ id: item._id, item: item.item, pricePerUnit: item.pricePerUnit });
        setIsEditing(true);
        setIsCreating(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/pricing/update/${currentItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: currentItem.item,
                    pricePerUnit: parseFloat(currentItem.pricePerUnit),
                }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message}`);
                setSuccessMessage('');
            }
        } catch (err) {
            setError('Failed to update item.');
            setSuccessMessage('');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/pricing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: newItem.item,
                    pricePerUnit: parseFloat(newItem.pricePerUnit),
                }),
            });

            if (response.ok) {
                const createdData = await response.json();
                setPricingData([...pricingData, createdData]);
                setNewItem({ item: '', pricePerUnit: '' });
                setIsCreating(false);
                setSuccessMessage('Item created successfully.');
                setError('');
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message}`);
                setSuccessMessage('');
            }
        } catch (err) {
            setError('Failed to create item.');
            setSuccessMessage('');
        }
    };

    if (loading) return <p>Loading...</p>;
    // if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col md:flex-row items-start overflow-x-auto p-4"> {/* Use flex-row for larger screens */}
            <div className="flex-1"> {/* Table Section */}
                <h2 className="text-xl font-semibold mb-4">Pricing Table</h2>
                {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                <div className="overflow-x-auto w-full max-w-4xl"> {/* Set a max width for the table */}
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Item</Table.HeadCell>
                            <Table.HeadCell className="text-center w-full">Price per Unit</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {pricingData.map((item) => (
                                <Table.Row key={item._id} className="hover:bg-gray-100 transition duration-200">
                                    <Table.Cell>{item.item}</Table.Cell>
                                    <Table.Cell className="text-center w-full">
                                        <span className="font-semibold">LKR {item.pricePerUnit.toFixed(2)}</span>
                                    </Table.Cell>
                                    <Table.Cell className="flex space-x-2">
                                        <Button onClick={() => handleEdit(item)} color="blue">Edit</Button>
                                        <Button onClick={() => handleDelete(item._id)} color="red">Delete</Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                {/* Show Create New Item Button Below Table */}
                <Button 
                    onClick={() => { setIsCreating(true); setIsEditing(false); }} 
                    className="bg-blue-500 text-white rounded p-2 mb-4">
                    Create New Item 
                </Button>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-md mt-4 md:mt-0 md:ml-4"> {/* Align forms on the right */}
                {/* Create Modal or Form */}
                {isCreating && (
                    <div className="mt-4 p-4 bg-gray-200 rounded"> {/* Form for creating new item */}
                        <h2 className="text-lg font-semibold">Create New Pricing Item</h2>
                        <form onSubmit={handleCreate}>
                            <input
                                type="text"
                                value={newItem.item}
                                onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                                className="border border-gray-300 rounded p-2 w-full mb-2"
                                placeholder="Item Name"
                            />
                            <input
                                type="number"
                                value={newItem.pricePerUnit}
                                onChange={(e) => setNewItem({ ...newItem, pricePerUnit: e.target.value })}
                                className="border border-gray-300 rounded p-2 w-full mb-2"
                                placeholder="Price per Unit"
                            />
                            <Button type="submit" className="bg-blue-500 text-white rounded p-2 w-full">
                                Create Item
                            </Button>
                        </form>
                    </div>
                )}

                {/* Edit Modal or Form */}
                {isEditing && (
                    <div className="mt-4 p-4 bg-gray-200 rounded"> {/* Form for editing existing item */}
                        <h2 className="text-lg font-semibold">Edit Pricing</h2>
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                value={currentItem.item}
                                onChange={(e) => setCurrentItem({ ...currentItem, item: e.target.value })}
                                className="border border-gray-300 rounded p-2 w-full mb-2"
                                placeholder="Item Name"
                            />
                            <input
                                type="number"
                                value={currentItem.pricePerUnit}
                                onChange={(e) => setCurrentItem({ ...currentItem, pricePerUnit: e.target.value })}
                                className="border border-gray-300 rounded p-2 w-full mb-2"
                                placeholder="Price per Unit"
                            />
                            <Button type="submit" className="bg-green-500 text-white rounded p-2 w-full">
                                Update Item
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingTable;
