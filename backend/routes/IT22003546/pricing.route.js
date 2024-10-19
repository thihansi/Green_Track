import express from 'express';
import { createPricing, getPricings, getPricingById, updatePricing, deletePricing } from '../../controllers/IT22003546/pricing.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

//error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Create new Inventory
router.post('/create', verifyToken, createPricing);

// Get all Inventory
router.get('/get', verifyToken, getPricings);

// Get single Inventory
router.get('/fetch/:Pricingid', getPricingById);

// Update Inventory
router.put('/update/:Pricingid', verifyToken, updatePricing);

// Delete Inventory
router.delete('/delete/:Pricingid', verifyToken, deletePricing);

export default router;