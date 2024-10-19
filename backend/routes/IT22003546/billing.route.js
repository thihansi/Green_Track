import express from 'express';
import { createBilling, getBillings, getBillingById, updateBilling, deleteBilling} from '../../controllers/IT22003546/billing.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

//error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Create new Inventory
router.post('/create', verifyToken, createBilling);

// Get all Inventory
router.get('/get', verifyToken, getBillings);

// Get single Inventory
router.get('/fetch/:Billingid', getBillingById);

// Update Inventory
router.put('/update/:Billingid', verifyToken, updateBilling);

// Delete Inventory
router.delete('/delete/:Billingid', verifyToken, deleteBilling);

export default router;