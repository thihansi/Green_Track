import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    billingId: {
        type: String,
        required: true,
        unique: true
    },
    residentId: {
        type: String,
        required: true
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
        required: true
    }
});

// Create the Billing model
const Billing = mongoose.model('Billing', billingSchema);
export default Billing;
