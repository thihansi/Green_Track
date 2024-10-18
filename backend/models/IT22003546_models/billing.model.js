import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    billingId: {
        type: String,
        required: true,
        unique: true // generating in the frontend
    },
    residentId: {
        type: String,
        required: true // fetching from parameter
    },
    garbageCost: {
        type: Number,
        required: true,
        min: 0 // Cost must be non-negative
    },
    recyclingReward: {
        type: Number,
        required: true,
        min: 0 // Reward must be non-negative
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0 // Total price must be non-negative
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Paid', 'Unpaid', 'Pending'] // Adding an enum (only these values are allowed)
    }
});

// Create the Billing model
const Billing = mongoose.model('Billing', billingSchema);
export default Billing;
