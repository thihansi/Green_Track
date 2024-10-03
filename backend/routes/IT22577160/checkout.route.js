import express from 'express';
import { checkout } from '../../controllers/IT22577160/checkout.controller.js';

const router = express.Router();

router.post('/creteCheckout', checkout);

export default router;