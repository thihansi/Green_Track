import mongoose from "mongoose";

// Define allowed waste item types for each category
const RECYCLABLE_TYPES = ["Paper", "Plastic", "Glass", "Metal"];
const NON_RECYCLABLE_TYPES = ["Food Waste", "Organic", "Hazardous", "Other"];

const wasteCollectionSchema = new mongoose.Schema(
  {
    collectionId: { type: String, required: true }, // Unique identifier for each collection

    residentId: {
      type: String, // Reference to the resident's ID
      required: true,
    },
    collectionDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Collected", "Cancelled"],
      default: "Scheduled",
      required: true,
    }, // Current status of the waste collection

    garbage: [
      {
        wasteType: {
          type: String,
          enum: ["Recyclable", "Non-Recyclable"],
          required: true,
        },
        category: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              // Validate that itemType matches the wasteType category
              if (
                this.wasteType === "Recyclable" &&
                RECYCLABLE_TYPES.includes(value)
              ) {
                return true;
              }
              if (
                this.wasteType === "Non-Recyclable" &&
                NON_RECYCLABLE_TYPES.includes(value)
              ) {
                return true;
              }
              return false; // Invalid itemType for the given wasteType
            },
            message: (props) =>
              `${props.value} is not a valid item type for the category ${props.instance.wasteType}`,
          },
        },
        weight: {
          type: Number,
          required: true,
          min: 0, // Weight must be non-negative
        },
      },
    ],
  },
  { timestamps: true }
);

// Add indexes for performance optimization
//wasteCollectionSchema.index({ collectionId: 1 });
//wasteCollectionSchema.index({ residentId: 1, collectionDate: -1 });

// Create the WasteCollection model
const WasteCollection = mongoose.model(
  "WasteCollection",
  wasteCollectionSchema
);
export default WasteCollection;