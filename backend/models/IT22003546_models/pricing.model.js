import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
    item: { 
        type: String, 
        required: true 
    },

    pricePerUnit: { 
        type: Number, 
        required: true 
    },
});

const Pricing = mongoose.model('Pricing', pricingSchema);
export default Pricing;
