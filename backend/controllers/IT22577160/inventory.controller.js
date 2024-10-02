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

// Get all the inventory items
export const getInventoryItems = async (req, res, next) => {
  try {
    // Parse query parameters for pagination and sorting
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // Build the query object based on available query parameters
    const resources = await Inventory.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.quantity && { quantity: req.query.quantity }),
      ...(req.query.type && { type: req.query.type }),
      ...(req.query.resourceId && { _id: req.query.resourceId }),
      ...(req.query.searchTerm && {
        $or: [
          { itemName: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    // Get the total number of resources in the database
    const totalResources = await Inventory.countDocuments();
    // Get the current date and calculate the date one month ago
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    // Count the number of resources created in the last month
    const lastMonthResources = await Inventory.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // Send the response with the resources, total count, and last month count
    res.status(200).json({ resources, totalResources, lastMonthResources });
  } catch (error) {
    next(error);
  }
};
