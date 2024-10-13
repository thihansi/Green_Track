import Inventory from "../../models/IT22577160/inventory.model.js";
import { errorHandler } from "../../utils/error.js";
import InventoryFactory from "./inventoryFactory.js";

// Add Decorator Design Pattern to Inventory Controller 

// Authorization Decorator (Check if the user has the required role to create inventory items)
const withAuthorization = (fn) => (req, res, next) => {
  if (!req.user.EquipmentInventoryManger) {
    // If the user is not authorized, pass an error to the error handler
    return next(
      errorHandler(403, "You are not authorized to create a listing")
    );
  }
  return fn(req, res, next);
};

// Validation Decorator (Validate the required fields in the request body)
const withValidation = (fn) => (req, res, next) => {
  if (!req.body.itemName || !req.body.description) {
    // If any required fields are missing, pass an error to the error handler
    return next(errorHandler(400, "Please Provide all the required fields"));
  }
  return fn(req, res, next);
};

// Slug Generation Decorator (Generate a URL-friendly slug based on the item's name)
const withSlugGeneration = (fn) => (req, res, next) => {
  // Generate a URL-friendly slug based on the item's name
  const slug = req.body.itemName
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  req.body.slug = slug;
  return fn(req, res, next);
};

// Core Functionality to Create Inventory Item
const createInventoryCore = async (req, res, next) => {
  // Create a new inventory item based on the request body
  // const newListing = new Inventory({
  //   ...req.body,
  //   userId: req.user.id,
  // });
  try {
    // Create a new inventory item using the factory method
    const newListing = InventoryFactory.createInventoryItem(req.body, req.user.id);
    // Save the new inventory item to the database
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// Applying Decorators to Create Inventory Item
export const createInventory = withAuthorization(
  withValidation(withSlugGeneration(createInventoryCore))
);

// Validation Decorator for Update/Delete (Check if the user is authorized to modify the resource)
const withUpdateDeleteValidation = (fn) => (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to modify this resource"));
  }
  return fn(req, res, next);
};

// Pagination/Query Parsing Decorator for Get (Parse the query parameters for pagination and filtering)
const withQueryParsing = (fn) => (req, res, next) => {
  // Parse query parameters for pagination and sorting
  req.pagination = {
    startIndex: parseInt(req.query.startIndex) || 0,
    limit: parseInt(req.query.limit) || 9,
    sortDirection: req.query.order === "asc" ? 1 : -1,
  };
  // Build the query object based on available query parameters
  req.filters = {
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
  };
  return fn(req, res, next);
};

// Get all inventory items with pagination and filtering
const getInventoryCore = async (req, res, next) => {
  try {
    const { startIndex, limit, sortDirection } = req.pagination;
    const resources = await Inventory.find(req.filters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get the total number of resources in the database
    const totalResources = await Inventory.countDocuments();
    // Get the current date and calculate the date one month ago
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
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

// Applying Decorators to Get Inventory Items
export const getInventoryItems = withQueryParsing(getInventoryCore);

// Delete Inventory Item Core Functionality
const deleteInventoryCore = async (req, res, next) => {
  try {
    // Attempt to find and delete the inventory item by ID
    await Inventory.findByIdAndDelete(req.params.postId);
    res.status(200).json("The resource has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Applying Decorators to Delete Inventory Item
export const deleteInventoryItems = withAuthorization(
  withUpdateDeleteValidation(deleteInventoryCore)
);

// Update Inventory Item Core Functionality
const updateInventoryCore = async (req, res, next) => {
  try {
    // Find the inventory item by ID and update its fields with the provided data
    const updatedResource = await Inventory.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          itemName: req.body.itemName,
          description: req.body.description,
          location: req.body.location,
          category: req.body.category,
          quantity: req.body.quantity,
          type: req.body.type,
          image: req.body.image,
          condition: req.body.condition,
          regularPrice: req.body.regularPrice,
          discountPrice: req.body.discountPrice,
          offer: req.body.offer,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedResource);
  } catch (error) {
    next(error);
  }
};

// Applying Decorators to Update Inventory Items
export const updateInventoryItems = withAuthorization(
  withUpdateDeleteValidation(updateInventoryCore)
);
