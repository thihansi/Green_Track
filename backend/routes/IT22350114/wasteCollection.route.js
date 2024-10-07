import express from 'express';
import { createWasteCollection, getWasteCollections, getWasteCollectionById, updateWasteCollection, deleteWasteCollection, getWasteCollectionsByResidentId, getWasteCollectionsByCollectionMonth } from '../../controllers/IT22350114/wasteCollection.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

// Apply verifyToken middleware globally to all routes except specific ones (if needed)
router.use(verifyToken);

// Define routes for Waste Collection management

// Create new Inventory
router.post('/create', createWasteCollection);

// Get all Inventory
router.get('/get', getWasteCollections);

// Get single Inventory
router.get('/fetch/:wasteCid', getWasteCollectionById);

// Update Inventory
router.put('/update/:wasteCid', verifyToken, updateWasteCollection);

// Delete Inventory
router.delete('/delete/:wasteCid', verifyToken, deleteWasteCollection);

// Get waste collections by resident ID
router.get('/getByResidentId/:residentId', verifyToken, getWasteCollectionsByResidentId);

// Get waste collections by collection date
router.get('/getByCollectionMonth/:collectionMonth', verifyToken, getWasteCollectionsByCollectionMonth);

//error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default router;