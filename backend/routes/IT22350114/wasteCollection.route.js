import express from 'express';
import { createWasteCollection, getWasteCollections, getWasteCollectionById, updateWasteCollection, deleteWasteCollection, getWasteCollectionsByResidentId, getWasteCollectionsByCollectionMonth } from '../../controllers/IT22350114/wasteCollection.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();


//error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Create new Inventory
router.post('/create', verifyToken, createWasteCollection);

// Get all Inventory
router.get('/get', verifyToken, getWasteCollections);

// Get single Inventory
router.get('/fetch/:wasteCollectionId', getWasteCollectionById);

// Update Inventory
router.put('/update/:wasteCollectionId', verifyToken, updateWasteCollection);

// Delete Inventory
router.delete('/delete/:wasteCollectionId', verifyToken, deleteWasteCollection);

// Get waste collections by resident ID
router.get('/getByResidentId/:residentId', verifyToken, getWasteCollectionsByResidentId);

// Get waste collections by collection date
router.get('/getByCollectionMonth/:collectionMonth', verifyToken, getWasteCollectionsByCollectionMonth);

export default router;
