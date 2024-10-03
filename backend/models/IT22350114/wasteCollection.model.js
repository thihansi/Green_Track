import mongoose from 'mongoose';

const wasteCollectionSchema = new mongoose.Schema({
    residentId: {
        type: String, // Reference to the resident's ID
        required: true
    },
    garbage: [{
        category: {
            type: String,
            required: true // Category of the garbage (e.g., "Food Waste", "Paper")
        },
        weight: {
            type: Number,
            required: true,
            min: 0 // Weight must be non-negative
        },
        collectionDate: {
            type: Date,
            default: Date.now // Date of the collection
        }
    }],
    recycling: [{
        category: {
            type: String,
            required: true // Category of the recyclable waste
        },
        weight: {
            type: Number,
            required: true,
            min: 0 // Weight must be non-negative
        },
        collectionDate: {
            type: Date,
            default: Date.now // Date of the collection
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now // Date when the record is created
    }
});

// Create the WasteCollection model
const WasteCollection = mongoose.model('WasteCollection', wasteCollectionSchema);
export default  WasteCollection;