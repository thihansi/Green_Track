import { describe, it, expect, beforeEach, afterEach } from 'vitest'; // Use Vitest
import mongoose from 'mongoose';
import WasteCollection from '../../models/IT22350114/wasteCollection.model.js';
import WasteFactory from '../../models/IT22350114/wasteFactory.js';

describe('WasteCollection Model', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/test'); // Connect to test DB
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase(); // Clean up database after each test
        await mongoose.disconnect(); // Disconnect after tests
    });

    it('should create a valid waste collection record with valid data', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5) // Using WasteFactory for object creation
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection._id).toBeDefined();
        expect(savedWasteCollection.collectionId).toBe(wasteCollectionData.collectionId);
        expect(savedWasteCollection.garbage[0].wasteType).toBe('Recyclable');
        expect(savedWasteCollection.garbage[0].category).toBe('Plastic');
        expect(savedWasteCollection.garbage[0].weight).toBe(2.5);
    });

    it('should throw an error when trying to create a waste collection record with an invalid wasteType', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                {
                    wasteType: 'InvalidWasteType', // Invalid waste type
                    category: 'Plastic',
                    weight: 2.5,
                },
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        await expect(wasteCollection.save()).rejects.toThrow(/is not a valid enum value/); // Updated error handling for invalid enum
    });

    it('should throw an error when trying to create a waste collection record with a negative weight', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', -1) // Negative weight, using WasteFactory
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        await expect(wasteCollection.save()).rejects.toThrow(/Path `weight` \(-1\) is less than minimum allowed value \(0\)/); // Updated to match Mongoose error
    });

    // Here, we directly test the Factory logic since the error originates there
    it('should throw an error when trying to create a waste collection record with an invalid category for recyclable waste', () => {
        expect(() => {
            WasteFactory.createWaste('Recyclable', 'Food Waste', 2.5);
        }).toThrow(/Invalid waste type or category: Recyclable, Food Waste/);
    });

    it('should create a waste collection record with a valid non-recyclable waste item', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12347',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Non-Recyclable', 'Food Waste', 3) // Valid non-recyclable item
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection._id).toBeDefined();
        expect(savedWasteCollection.garbage[0].wasteType).toBe('Non-Recyclable');
        expect(savedWasteCollection.garbage[0].category).toBe('Food Waste');
        expect(savedWasteCollection.garbage[0].weight).toBe(3);
    });

    it('should create a waste collection record with default createdAt date', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5)
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection.createdAt).toBeDefined();
        expect(savedWasteCollection.createdAt).toBeInstanceOf(Date);
    });

    it('should update an existing waste collection record successfully', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5)
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        savedWasteCollection.status = 'Collected';
        const updatedWasteCollection = await savedWasteCollection.save();

        expect(updatedWasteCollection.status).toBe('Collected');
    });
});
