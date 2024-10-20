import React, { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import { useSelector } from 'react-redux';

const PaymentDetails = ({ isAdmin }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedResidents, setExpandedResidents] = useState({}); // Track expanded residents

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // If the user is an admin, fetch all payments
                const response = isAdmin
                    ? await fetch(`/api/payment/get`) // API endpoint to get all payments
                    : await fetch(`/api/payment/getByResidentId/${currentUser.username}`); // API endpoint for a specific user

                if (!response.ok) {
                    throw new Error('Failed to fetch payment data.');
                }
                const data = await response.json();
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [isAdmin, currentUser._id]);

    if (loading) return <p>Loading payments...</p>;
    if (error) return <p>Error: {error}</p>;

    // Group payments by resident ID
    const groupedPayments = payments.reduce((acc, payment) => {
        if (!acc[payment.customerID]) {
            acc[payment.customerID] = [];
        }
        acc[payment.customerID].push(payment);
        return acc;
    }, {});

    const toggleExpand = (residentId) => {
        setExpandedResidents((prev) => ({
            ...prev,
            [residentId]: !prev[residentId], // Toggle the expanded state for this resident
        }));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold text-center mt-6">{isAdmin ? 'Payment Details for All Residents' : 'Your Payment Details'}</h2>
            {Object.keys(groupedPayments).length > 0 ? (
                <div>
                    {Object.keys(groupedPayments).map((residentId) => (
                        <div key={residentId} className="mt-4">
                            <h3 className="text-lg font-semibold cursor-pointer" onClick={() => toggleExpand(residentId)}>
                                Resident ID: {residentId} {expandedResidents[residentId] ? '▲' : '▼'}
                            </h3>
                            {expandedResidents[residentId] && ( // Conditionally render the payment table
                                <Table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-2">
                                    <Table.Head>
                                        <Table.HeadCell>Payment ID</Table.HeadCell>
                                        <Table.HeadCell>Amount</Table.HeadCell>
                                        <Table.HeadCell>Payment Date</Table.HeadCell>
                                        <Table.HeadCell>Payment Method</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {groupedPayments[residentId].map((payment, index) => (
                                            <Table.Row key={index} className="hover:bg-gray-100 transition duration-200">
                                                <Table.Cell>{payment.paymentID}</Table.Cell>
                                                <Table.Cell>LKR {payment.amount.toFixed(2)}</Table.Cell>
                                                <Table.Cell>{new Date(payment.paymentDate).toLocaleDateString('en-CA')}</Table.Cell>
                                                <Table.Cell>{payment.paymentMethod}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No payment records found.</p>
            )}
        </div>
    );
};

export default PaymentDetails;
