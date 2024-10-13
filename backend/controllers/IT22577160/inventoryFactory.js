// inventoryFactory.js

import Inventory from "../../models/IT22577160/inventory.model.js";

// Factory class for creating inventory items
class InventoryFactory {
  // Factory method to create an inventory item
  static createInventoryItem(data, userId) {
    return new Inventory({
      itemName: data.itemName,
      description: data.description,
      category: data.category || "Uncategorized",
      quantity: data.quantity,
      condition: data.condition,
      location: data.location,
      type: data.type,
      offer: data.offer,
      regularPrice: data.regularPrice,
      discountPrice: data.discountPrice,
      slug: data.slug,
      userId: userId, // userId is passed separately to ensure security
      image: data.image || "https://image.made-in-china.com/2f0j00RoUzLfprRcql/120L-Wheelie-Garbage-Bin-Rubbish-Container-Waste-Pedal-Trash-Can-Plastic-Dustbin.webp", // Optional default image
    });
  }
}

export default InventoryFactory;
