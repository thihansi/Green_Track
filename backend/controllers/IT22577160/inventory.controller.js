import Inventory from "../../models/IT22577160/inventory.model.js";

// create a new inventory equipment item
export const createInventory = async (req, res, next) => {
  // Check if the user has the required role to create inventory items
  if (!req.user.EquipmentInventoryManger) {
    // If the user is not authorized, pass an error to the error handler
    return next(
      errorHandler(403, "You are not authorized to create a listing")
    );
  }
  // Validate the required fields in the request body
  if (!req.body.itemName || !req.body.description) {
    // If any required fields are missing, pass an error to the error handler
    return next(errorHandler(400, "Please Provide all the required fields"));
  }
  // Generate a URL-friendly slug based on the item's name
  const slug = req.body.itemName
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  // Create a new inventory item
  const newListing = new Inventory({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    // Save the new inventory item to the database
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};
