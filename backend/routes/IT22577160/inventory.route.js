import express from "express";
import { verifyToken } from "../../utils/verifyToken.js";
import { createInventory, deleteInventoryItems, getInventoryItems, updateInventoryItems } from "../../controllers/IT22577160/inventory.controller.js";

// Create a new router instance
const router = express.Router();

// Define a POST route for creating a new inventory item
router.post("/create", verifyToken, createInventory);
router.get('/getInventoryItems', getInventoryItems);
router.delete('/deleteInventoryItems/:postId/:userId', verifyToken, deleteInventoryItems);
router.put('/updateInventoryItems/:postId/:userId', verifyToken, updateInventoryItems);

export default router;