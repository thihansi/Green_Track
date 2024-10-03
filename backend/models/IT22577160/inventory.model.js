import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    image: {
      type: String,
      default:
        "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp",
    },
    quantity: {
      type: Number,
      required: true,
    },
    condition: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
