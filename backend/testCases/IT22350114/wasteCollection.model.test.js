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

    /**
     * Positive Case: Create a valid waste collection record
     */
    it('should create a valid waste collection record with valid data', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5), // Using WasteFactory
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

    /**
     * Negative Case: Invalid wasteType in garbage array
     */
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

    /**
     * Negative Case: Invalid category for recyclable waste
     */
    it('should throw an error when trying to create a waste collection record with an invalid category for recyclable waste', () => {
        expect(() => {
            WasteFactory.createWaste('Recyclable', 'Food Waste', 2.5); // Food Waste is invalid for recyclable
        }).toThrow(/Invalid waste type or category: Recyclable, Food Waste/);
    });

    /**
     * Negative Case: Weight is less than minimum (negative weight)
     */
    it('should throw an error when trying to create a waste collection record with a negative weight', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', -1), // Negative weight
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        await expect(wasteCollection.save()).rejects.toThrow(/Path `weight` \(-1\) is less than minimum allowed value \(0\)/);
    });

    /**
     * Positive Case: Valid non-recyclable waste item
     */
    it('should create a waste collection record with a valid non-recyclable waste item', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12347',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Non-Recyclable', 'Food Waste', 3), // Valid non-recyclable item
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection._id).toBeDefined();
        expect(savedWasteCollection.garbage[0].wasteType).toBe('Non-Recyclable');
        expect(savedWasteCollection.garbage[0].category).toBe('Food Waste');
        expect(savedWasteCollection.garbage[0].weight).toBe(3);
    });

    /**
     * Positive Case: Check if createdAt field is automatically generated
     */
    it('should create a waste collection record with default createdAt date', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5),
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection.createdAt).toBeDefined();
        expect(savedWasteCollection.createdAt).toBeInstanceOf(Date);
    });

    /**
     * Negative Case: Missing required field (residentId)
     */
    it('should throw an error when trying to create a waste collection without residentId', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5),
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        await expect(wasteCollection.save()).rejects.toThrow(/Path `residentId` is required/);
    });

    /**
     * Positive Case: Update a waste collection record successfully
     */
    it('should update an existing waste collection record successfully', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5),
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        savedWasteCollection.status = 'Collected';
        const updatedWasteCollection = await savedWasteCollection.save();

        expect(updatedWasteCollection.status).toBe('Collected');
    });

    /**
     * Negative Case: Update with invalid status value
     */
    it('should throw an error when trying to update a waste collection with an invalid status', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                WasteFactory.createWaste('Recyclable', 'Plastic', 2.5),
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        savedWasteCollection.status = 'InvalidStatus'; // Invalid status
        await expect(savedWasteCollection.save()).rejects.toThrow(/is not a valid enum value for path `status`/);
    });
});
