import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Table, Button } from 'flowbite-react'; // Import Flowbite components
import PaymentDetails from './paymentView'; // Import the PaymentDetails component

const CalculateTotalPrice = () => {
    const [wasteData, setWasteData] = useState([]);
    const [pricingData, setPricingData] = useState([]);
    const [totalCosts, setTotalCosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const [finalAmountToPay, setFinalAmountToPay] = useState(0);
    const [pastPaymentsTotal, setPastPaymentsTotal] = useState(0);
    const [userPayments, setUserPayments] = useState([]);
    const [paymentsByResident, setPaymentsByResident] = useState({}); // To store total payments by resident

    useEffect(() => {
        const fetchWasteData = async () => {
            try {
                const response = await fetch(`/api/wasteCollection/get`);
                if (!response.ok) {
                    throw new Error('Failed to fetch waste data.');
                }
                const data = await response.json();
                setWasteData(data);
            } catch (err) {
                setError(err.message);
            }
        };

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
            }
        };

        const fetchPaymentsData = async () => {
            try {
                const response = await fetch(`/api/payment/get`);
                if (response.ok) {
                    const data = await response.json();
                    const paymentsMap = {};
                    data.forEach(payment => {
                        paymentsMap[payment.customerID] = (paymentsMap[payment.customerID] || 0) + payment.amount;
                    });
                    setPaymentsByResident(paymentsMap);
                }
            } catch (err) {
                console.error('Failed to fetch payment data:', err);
            }
        };

        fetchWasteData();
        fetchPricingData();
        fetchPaymentsData();
    }, []); // Only run on mount

    useEffect(() => {
        const calculateTotalCosts = () => {
            if (wasteData.length > 0 && pricingData.length > 0) {
                const costs = wasteData.map(residentWaste => {
                    const garbageDetails = residentWaste.garbage.filter(item => item.wasteType === "Non-Recyclable").map(item => {
                        const pricingItem = pricingData.find(p => p.item === item.category);
                        const cost = item.weight * (pricingItem ? pricingItem.pricePerUnit : 0);
                        return {
                            weight: item.weight,
                            pricePerUnit: pricingItem ? pricingItem.pricePerUnit : 0,
                            cost,
                            category: item.category,
                        };
                    });

                    const recyclingDetails = residentWaste.garbage.filter(item => item.wasteType === "Recyclable").map(item => {
                        const pricingItem = pricingData.find(p => p.item === item.category);
                        const reward = item.weight * (pricingItem ? pricingItem.pricePerUnit : 0);
                        return {
                            weight: item.weight,
                            pricePerUnit: pricingItem ? pricingItem.pricePerUnit : 0,
                            reward,
                            category: item.category,
                        };
                    });

                    const totalGarbageCost = garbageDetails.reduce((total, item) => total + item.cost, 0);
                    const totalRecyclingReward = recyclingDetails.reduce((total, item) => total + item.reward, 0);
                    const totalPrice = totalGarbageCost - totalRecyclingReward;

                    // Access collectionDate directly from residentWaste
                    const collectionDate = residentWaste.collectionDate;

                    return {
                        residentId: residentWaste.residentId,
                        garbageDetails,
                        recyclingDetails,
                        totalGarbageCost,
                        totalRecyclingReward,
                        totalPrice,
                        collectionDate: collectionDate ? new Date(collectionDate).toLocaleDateString('en-CA') : 'N/A' // Ensure it's formatted properly
                    };
                });

                setTotalCosts(costs);
            }
        };

        calculateTotalCosts();
        setLoading(false);
    }, [wasteData, pricingData]);

    // Define userTotalCosts and groupedAdminTotalCosts
    const userTotalCosts = totalCosts.filter(cost => cost.residentId === currentUser.username);
    const groupedAdminTotalCosts = totalCosts.reduce((acc, cost) => {
        if (!acc[cost.residentId]) {
            acc[cost.residentId] = {
                residentId: cost.residentId,
                garbageDetails: {},
                recyclingDetails: {},
                totalGarbageCost: 0,
                totalRecyclingReward: 0,
                totalPrice: 0,
            };
        }
        // Grouping garbage details
        cost.garbageDetails.forEach(item => {
            if (!acc[cost.residentId].garbageDetails[item.category]) {
                acc[cost.residentId].garbageDetails[item.category] = {
                    weight: 0,
                    pricePerUnit: item.pricePerUnit // Assuming all items of a category have the same price
                };
            }
            acc[cost.residentId].garbageDetails[item.category].weight += item.weight;
        });

        // Grouping recycling details
        cost.recyclingDetails.forEach(item => {
            if (!acc[cost.residentId].recyclingDetails[item.category]) {
                acc[cost.residentId].recyclingDetails[item.category] = {
                    weight: 0,
                    pricePerUnit: item.pricePerUnit // Assuming all items of a category have the same price
                };
            }
            acc[cost.residentId].recyclingDetails[item.category].weight += item.weight;
        });

        // Aggregating total costs
        acc[cost.residentId].totalGarbageCost += cost.totalGarbageCost;
        acc[cost.residentId].totalRecyclingReward += cost.totalRecyclingReward;
        acc[cost.residentId].totalPrice += cost.totalPrice;

        return acc;
    }, {});

    // Convert grouped object to array
    const groupedAdminTotalCostsArray = Object.values(groupedAdminTotalCosts);

    useEffect(() => {
        const fetchPastPayments = async () => {
            try {
                const response = await fetch(`/api/payment/getByResidentId/${currentUser.username}`);
                if (response.ok) {
                    const data = await response.json();
                    const totalPastPayments = data.reduce((sum, payment) => sum + payment.amount, 0);
                    setPastPaymentsTotal(totalPastPayments);
                    setUserPayments(data);
                } else {
                    const errorData = await response.json();
                    alert(`Failed to fetch past payments: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error fetching past payments:', error);
                alert('An error occurred while fetching past payments. Please try again.');
            }
        };

        fetchPastPayments();
    }, [currentUser._id]);

    useEffect(() => {
        const adjustedTotalAmount = (currentUser.isAdmin ? 
            groupedAdminTotalCostsArray.reduce((sum, cost) => sum + cost.totalPrice, 0) : 
            userTotalCosts.reduce((sum, cost) => sum + cost.totalPrice, 0)) - pastPaymentsTotal;
        const amountToPay = Math.max(adjustedTotalAmount, 0); // Ensure it's not negative
        setFinalAmountToPay(amountToPay);
    }, [totalCosts, pastPaymentsTotal, currentUser.isAdmin]);

    const handlePayment = async () => {
        if (finalAmountToPay <= 0) {
            alert('Total amount to be paid cannot be zero.');
            return; // Exit the function early if the amount is zero
        }

        // Prepare payment data
        const paymentData = {
            paymentID: `PAY-${Date.now()}`, // Generate a unique payment ID
            customerID: currentUser.username,     // Use the logged-in user's ID
            paymentDate: new Date(),          // Current date
            amount: finalAmountToPay,         // Amount to be paid after adjustment
            paymentMethod: 'Credit Card'      // Example payment method, may want to make this dynamic
        };

        try {
            // Send payment request to the server
            const paymentResponse = await fetch('/api/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            // Check if payment was successful
            if (paymentResponse.ok) {
                const paymentResult = await paymentResponse.json();
                alert(`Payment successful! Payment ID: ${paymentResult.paymentID}`);

                // Prepare billing information
                const billingData = {
                    billingId: `BILL-${Date.now()}`, // Generate a unique billing ID
                    residentId: currentUser.username,  // Use the logged-in user's ID
                    garbageCost: userTotalCosts.reduce((sum, cost) => sum + cost.totalGarbageCost, 0), // Total garbage cost for the user
                    recyclingReward: userTotalCosts.reduce((sum, cost) => sum + cost.totalRecyclingReward, 0), // Total recycling reward for the user
                    totalPrice: finalAmountToPay, // Adjusted total amount to be paid
                    paymentStatus: 'Paid' // Example payment status, may want to make this dynamic
                };

                // Send billing request to the server
                const billingResponse = await fetch('/api/billing/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(billingData),
                });

                // Check if billing was successful
                if (billingResponse.ok) {
                    const billingResult = await billingResponse.json();
                    alert(`Billing record created! Billing ID: ${billingResult.billingId}`);
                    window.location.reload();
                } else {
                    const billingErrorData = await billingResponse.json();
                    alert(`Failed to create billing record: ${billingErrorData.message}`);
                }
            } else {
                const errorData = await paymentResponse.json();
                alert(`Payment failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('An error occurred while processing your payment. Please try again.');
        }
    };

    return (
        <div className="p-4 flex flex-col items-center dark:bg-gray-900 dark:text-gray-100 min-h-screen">
            {currentUser.isAdmin ? (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Total Price Calculation for All Residents</h2>
                    {groupedAdminTotalCostsArray.length > 0 ? (
                        <Table className="min-w-full bg-white border border-gray-600 shadow-xl rounded-lg mt-4">
                            <Table.Head>
                                <Table.HeadCell>Resident ID</Table.HeadCell>
                                <Table.HeadCell>Garbage Details</Table.HeadCell>
                                <Table.HeadCell>Garbage Cost</Table.HeadCell>
                                <Table.HeadCell>Recycling Details</Table.HeadCell>
                                <Table.HeadCell>Recycling Reward</Table.HeadCell>
                                <Table.HeadCell>Total Price</Table.HeadCell>
                                <Table.HeadCell>Outstanding Amount</Table.HeadCell> {/* New column */}
                            </Table.Head>
                            <Table.Body>
                                {groupedAdminTotalCostsArray.map((cost, index) => {
                                    const totalPaid = paymentsByResident[cost.residentId] || 0; // Get total paid by the resident
                                    const outstandingAmount = cost.totalPrice - totalPaid; // Calculate outstanding amount
                                    return (
                                        <Table.Row key={index} className={`hover:bg-gray-200 transition duration-200 ${outstandingAmount ? 'bg-red-100' : 'bg-green-100'}`}>
                                            <Table.Cell>{cost.residentId}</Table.Cell>
                                            <Table.Cell>
                                                {Object.entries(cost.garbageDetails).map(([category, details], idx) => (
                                                    <div key={idx}>
                                                        {category}: {details.weight} kg (LKR{details.pricePerUnit.toFixed(2)})
                                                    </div>
                                                ))}
                                            </Table.Cell>
                                            <Table.Cell>LKR{cost.totalGarbageCost.toFixed(2)}</Table.Cell>
                                            <Table.Cell>
                                                {Object.entries(cost.recyclingDetails).map(([category, details], idx) => (
                                                    <div key={idx}>
                                                        {category}: {details.weight} kg (LKR{details.pricePerUnit.toFixed(2)})
                                                    </div>
                                                ))}
                                            </Table.Cell>
                                            <Table.Cell>-LKR{cost.totalRecyclingReward.toFixed(2)}</Table.Cell>
                                            <Table.Cell>LKR{cost.totalPrice.toFixed(2)}</Table.Cell>
                                            <Table.Cell>LKR{outstandingAmount.toFixed(2)}</Table.Cell> {/* Display outstanding amount */}
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    ) : (
                        <p>No data available to calculate total prices.</p>
                    )}
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Your Total Price Calculation</h2>
                    {userTotalCosts.length > 0 ? (
                        <Table className="min-w-full bg-white border border-gray-600 shadow-xl rounded-lg mt-4">
                            <Table.Head>
                                <Table.HeadCell>Garbage Details</Table.HeadCell>
                                <Table.HeadCell>Garbage Cost</Table.HeadCell>
                                <Table.HeadCell>Recycling Details</Table.HeadCell>
                                <Table.HeadCell>Recycling Reward</Table.HeadCell>
                                <Table.HeadCell>Total Price</Table.HeadCell>
                                <Table.HeadCell>Collection Date</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {userTotalCosts.map((cost, index) => (
                                    <Table.Row key={index} className={`hover:bg-gray-200 transition duration-200`}>
                                        <Table.Cell>
                                            {cost.garbageDetails.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.category}: {item.weight} kg (LKR{item.pricePerUnit.toFixed(2)})
                                                </div>
                                            ))}
                                        </Table.Cell>
                                        <Table.Cell>LKR{cost.totalGarbageCost.toFixed(2)}</Table.Cell>
                                        <Table.Cell>
                                            {cost.recyclingDetails.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.category}: {item.weight} kg (LKR{item.pricePerUnit.toFixed(2)})
                                                </div>
                                            ))}
                                        </Table.Cell>
                                        <Table.Cell>-LKR{cost.totalRecyclingReward.toFixed(2)}</Table.Cell>
                                        <Table.Cell>LKR{cost.totalPrice.toFixed(2)}</Table.Cell>
                                        <Table.Cell>{cost.collectionDate ? new Date(cost.collectionDate).toLocaleDateString('en-CA') : 'N/A'}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    ) : (
                        <p>No data available to calculate total prices.</p>
                    )}
                    <div className="mt-4 p-4 bg-white text-gray-800 rounded w-full max-w-md flex flex-col items-center shadow-lg">
                        <h2 className="text-lg font-semibold">Total Amount to be Paid</h2>
                        <p className="text-3xl font-bold">LKR{finalAmountToPay.toFixed(2)}</p>
                        <Button 
                            onClick={handlePayment} 
                            className="mt-2 w-full bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                            Pay Now
                        </Button>
                    </div>
                </>
            )}

            <PaymentDetails userPayments={userPayments} isAdmin={currentUser.isAdmin} />
        </div>
    );
};

export default CalculateTotalPrice;
