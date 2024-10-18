import { describe, it, expect, beforeEach } from 'vitest'; // Use Vitest
import mongoose from 'mongoose';
import Payment from '../../models/IT22003546_models/payment.model.js';

describe('Payment Model', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/test'); // Connect to test DB
        await Payment.deleteMany({}); // Clear the test database before each test
    });

    it('should create a payment record with valid data', async () => {
        const paymentData = {
            paymentID: 'PAY12345',
            customerID: 'CUS12345',
            paymentDate: new Date(),
            amount: 100,
            paymentMethod: 'Credit Card',
        };
        const payment = new Payment(paymentData);
        const savedPayment = await payment.save();

        expect(savedPayment._id).toBeDefined();
        expect(savedPayment.paymentID).toBe(paymentData.paymentID);
        expect(savedPayment.amount).toBe(paymentData.amount);
    });

    it('should not create a payment record without a paymentID', async () => {
        const paymentData = {
            customerID: 'CUS12345',
            paymentDate: new Date(),
            amount: 100,
            paymentMethod: 'Credit Card',
        };

        const payment = new Payment(paymentData);
        try {
            await payment.save();
        } catch (error) {
            expect(error.errors.paymentID).toBeDefined();
        }
    });

    it('should not create a payment record with a negative amount', async () => {
        const paymentData = {
            paymentID: 'PAY12345',
            customerID: 'CUS12345',
            paymentDate: new Date(),
            amount: -50, // Invalid value
            paymentMethod: 'Credit Card',
        };

        const payment = new Payment(paymentData);
        try {
            await payment.save();
        } catch (error) {
            expect(error.errors.amount).toBeDefined();
        }
    });

    it('should not create a payment record without a customerID', async () => {
        const paymentData = {
            paymentID: 'PAY12346',
            paymentDate: new Date(),
            amount: 100,
            paymentMethod: 'Credit Card',
        };

        const payment = new Payment(paymentData);
        try {
            await payment.save();
        } catch (error) {
            expect(error.errors.customerID).toBeDefined();
        }
    });

    it('should not create a payment record without a paymentDate', async () => {
        const paymentData = {
            paymentID: 'PAY12347',
            customerID: 'CUS12347',
            amount: 100,
            paymentMethod: 'Credit Card',
        };

        const payment = new Payment(paymentData);
        try {
            await payment.save();
        } catch (error) {
            expect(error.errors.paymentDate).toBeDefined();
        }
    });

    it('should create a payment record with default createdAt date', async () => {
        const paymentData = {
            paymentID: 'PAY12348',
            customerID: 'CUS12348',
            paymentDate: new Date(),
            amount: 100,
            paymentMethod: 'Credit Card',
        };
        const payment = new Payment(paymentData);
        const savedPayment = await payment.save();

        expect(savedPayment.createdAt).toBeDefined();
        expect(savedPayment.createdAt).toBeInstanceOf(Date);
    });
});
