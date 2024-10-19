import { describe, it, expect, beforeEach } from 'vitest'; // Use Vitest
import mongoose from 'mongoose';
import Pricing from '../../models/IT22003546/pricing.model.js';

describe('Pricing Model', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/test'); // Connect to test DB
        await Pricing.deleteMany({}); // Clear the test database before each test
    });

    it('should create a pricing record with valid data', async () => {
        const pricingData = {
            item: 'Plastic Bottle',
            pricePerUnit: 2.5,
        };
        const pricing = new Pricing(pricingData);
        const savedPricing = await pricing.save();

        expect(savedPricing._id).toBeDefined();
        expect(savedPricing.item).toBe(pricingData.item);
        expect(savedPricing.pricePerUnit).toBe(pricingData.pricePerUnit);
    });

    it('should not create a pricing record without an item', async () => {
        const pricingData = {
            pricePerUnit: 2.5,
        };

        const pricing = new Pricing(pricingData);
        try {
            await pricing.save();
        } catch (error) {
            expect(error.errors.item).toBeDefined();
        }
    });

    it('should not create a pricing record with a negative pricePerUnit', async () => {
        const pricingData = {
            item: 'Glass Jar',
            pricePerUnit: -1, // Invalid value
        };

        const pricing = new Pricing(pricingData);
        try {
            await pricing.save();
        } catch (error) {
            expect(error.errors.pricePerUnit).toBeDefined();
        }
    });

    it('should not create a pricing record with a non-unique item', async () => {
        const pricingData1 = {
            item: 'Metal Can',
            pricePerUnit: 1.5,
        };
        const pricingData2 = {
            item: 'Metal Can', // Duplicate item
            pricePerUnit: 1.8,
        };

        const pricing1 = new Pricing(pricingData1);
        await pricing1.save(); // Save the first entry

        const pricing2 = new Pricing(pricingData2);
        try {
            await pricing2.save();
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.name).toBe('MongoServerError'); // Expect MongoServerError
            expect(error.message).toMatch(/duplicate key error/); // Check for duplicate key error
        }
    });

    it('should create a pricing record with default createdAt date', async () => {
        const pricingData = {
            item: 'Cardboard Box',
            pricePerUnit: 0.5,
        };
        const pricing = new Pricing(pricingData);
        const savedPricing = await pricing.save();

        expect(savedPricing.createdAt).toBeDefined();
        expect(savedPricing.createdAt).toBeInstanceOf(Date); // Ensure it's a Date instance
    });
});
