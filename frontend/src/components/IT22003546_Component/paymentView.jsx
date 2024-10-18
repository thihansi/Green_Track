import React, { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import { useSelector } from 'react-redux';

const PaymentDetails = ({ isAdmin }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold text-center">{isAdmin ? 'Payment Details for All Residents' : 'Your Payment Details'}</h2>
            {payments.length > 0 ? (
                <Table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-4">
                    <Table.Head>
                        <Table.HeadCell>Payment ID</Table.HeadCell>
                        {isAdmin && <Table.HeadCell>Resident ID</Table.HeadCell>} {/* Show Resident ID only for Admins */}
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Payment Date</Table.HeadCell>
                        <Table.HeadCell>Payment Method</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {payments.map((payment, index) => (
                            <Table.Row key={index} className="hover:bg-gray-100 transition duration-200">
                                <Table.Cell>{payment.paymentID}</Table.Cell>
                                {isAdmin && <Table.Cell>{payment.customerID}</Table.Cell>} {/* Show Resident ID only for Admins */}
                                <Table.Cell>${payment.amount.toFixed(2)}</Table.Cell>
                                <Table.Cell>{new Date(payment.paymentDate).toLocaleDateString('en-CA')}</Table.Cell>
                                <Table.Cell>{payment.paymentMethod}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <p>No payment records found.</p>
            )}
        </div>
    );
};

export default PaymentDetails;
