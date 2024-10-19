import { describe, it, expect, beforeEach } from 'vitest'; // Use Vitest
import mongoose from 'mongoose';
import Billing from '../../models/IT22003546/billing.model.js';

describe('Billing Model', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/test'); // Connect to test DB
        await Billing.deleteMany({}); // Clear the test database before each test
    });

    it('should create a billing record with valid data', async () => {
        const billingData = {
            billingId: 'BILL12345',
            residentId: 'RES12345',
            garbageCost: 100,
            recyclingReward: 20,
            totalPrice: 80,
            paymentStatus: 'Paid',
        };
        const billing = new Billing(billingData);
        const savedBilling = await billing.save();

        expect(savedBilling._id).toBeDefined();
        expect(savedBilling.billingId).toBe(billingData.billingId);
        expect(savedBilling.paymentStatus).toBe('Paid');
    });

    it('should not create a billing record without a billingId', async () => {
        const billingData = {
            residentId: 'RES12345',
            garbageCost: 100,
            recyclingReward: 20,
            totalPrice: 80,
            paymentStatus: 'Paid',
        };

        const billing = new Billing(billingData);
        try {
            await billing.save();
        } catch (error) {
            expect(error.errors.billingId).toBeDefined();
        }
    });

    it('should not create a billing record with a negative totalPrice', async () => {
        const billingData = {
            billingId: 'BILL12345',
            residentId: 'RES12345',
            garbageCost: 100,
            recyclingReward: 20,
            totalPrice: -10, // Invalid value
            paymentStatus: 'Paid',
        };

        const billing = new Billing(billingData);
        try {
            await billing.save();
        } catch (error) {
            expect(error.errors.totalPrice).toBeDefined();
        }
    });

    it('should not create a billing record with a negative garbageCost', async () => {
        const billingData = {
            billingId: 'BILL12346',
            residentId: 'RES12346',
            garbageCost: -50, // Invalid value
            recyclingReward: 20,
            totalPrice: 30,
            paymentStatus: 'Paid',
        };

        const billing = new Billing(billingData);
        try {
            await billing.save();
        } catch (error) {
            expect(error.errors.garbageCost).toBeDefined();
        }
    });

    it('should not create a billing record with an invalid paymentStatus', async () => {
        const billingData = {
            billingId: 'BILL12347',
            residentId: 'RES12347',
            garbageCost: 100,
            recyclingReward: 20,
            totalPrice: 80,
            paymentStatus: 'InvalidStatus', // Invalid value
        };

        const billing = new Billing(billingData);
        try {
            await billing.save();
        } catch (error) {
            expect(error.errors.paymentStatus).toBeDefined();
        }
    });

    it('should create a billing record with default createdAt date', async () => {
        const billingData = {
            billingId: 'BILL12348',
            residentId: 'RES12348',
            garbageCost: 100,
            recyclingReward: 20,
            totalPrice: 80,
            paymentStatus: 'Paid',
        };
        const billing = new Billing(billingData);
        const savedBilling = await billing.save();

        expect(savedBilling.createdAt).toBeDefined();
        expect(savedBilling.createdAt).toBeInstanceOf(Date);
    });
});
