import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentID: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Unique identifier for the payment
    customerID: { 
        type: String, 
        required: true 
    },              // Unique identifier for the customer
    paymentDate: { 
        type: Date, 
        required: true 
    },               // Date of the payment
    amount: { 
        type: Number, 
        required: true
    },                  // Amount paid by the customer
    paymentMethod: { 
        type: String, 
        required: true 
    },           // Method of payment
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
