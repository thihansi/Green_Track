import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
    item: { 
        type: String, 
        required: true,
        unique: true
    }, // The name of the item being priced

    pricePerUnit: { 
        type: Number, 
        required: true,
        min: 0
    }, // Price per unit for the item

    createdAt: { // Ensure createdAt is defined here
        type: Date,
        default: Date.now // This sets the default to the current date/time
    },
});

const Pricing = mongoose.model('Pricing', pricingSchema);
export default Pricing;
