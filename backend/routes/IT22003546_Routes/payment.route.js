import express from 'express';
import { createPayment, getPayments, getPaymentById, updatePayment, deletePayment, getPaymentByResidentId } from '../../controllers/IT22003546_Controllers/payment.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

//error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Create new Payment
router.post('/create', verifyToken, createPayment);

// Get all Payments
router.get('/get', verifyToken, getPayments);

// Get single Payment
router.get('/fetch/:Paymentid', getPaymentById);

// Update Payment
router.put('/update/:Paymentid', verifyToken, updatePayment);

// Delete Payment
router.delete('/delete/:Paymentid', verifyToken, deletePayment);

// Get Payment by Resident ID
router.get('/getByResidentId/:residentId', verifyToken, getPaymentByResidentId);

export default router;