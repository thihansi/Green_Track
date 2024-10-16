import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentID: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Unique identifier for the payment from FE
    customerID: { 
        type: String, 
        required: true 
    }, // Unique identifier for the customer from parameter
    paymentDate: { 
        type: Date, 
        required: true 
    }, // Date of the payment
    amount: { 
        type: Number, 
        required: true,
        min: 0
    }, // Amount paid by the customer
    paymentMethod: { 
        type: String, 
        required: true 
    }, // Method of payment
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
