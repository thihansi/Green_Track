import { describe, it, expect, beforeEach, afterEach } from 'vitest'; // Use Vitest
import mongoose from 'mongoose';
import WasteCollection from '../../models/IT22350114/wasteCollection.model.js';

describe('WasteCollection Model', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/test'); // Connect to test DB
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase(); // Clean up database after each test
        await mongoose.disconnect(); // Disconnect after tests
    });

    it('should create a waste collection record with valid data', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                {
                    wasteType: 'Recyclable',
                    category: 'Plastic',
                    weight: 2.5,
                },
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection._id).toBeDefined();
        expect(savedWasteCollection.collectionId).toBe(wasteCollectionData.collectionId);
        expect(savedWasteCollection.garbage[0].weight).toBe(wasteCollectionData.garbage[0].weight);
    });

    it('should not create a waste collection record with an invalid wasteType', async () => {
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
        await expect(wasteCollection.save()).rejects.toThrow();
    });

    it('should not create a waste collection record with a negative weight', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                {
                    wasteType: 'Recyclable',
                    category: 'Plastic',
                    weight: -1, // Invalid weight
                },
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        await expect(wasteCollection.save()).rejects.toThrow();
    });

    it('should not create a waste collection record with an invalid category for recyclable waste', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                {
                    wasteType: 'Recyclable',
                    category: 'Food Waste', // Invalid category
                    weight: 2.5,
                },
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        await expect(wasteCollection.save()).rejects.toThrow();
    });

    it('should create a waste collection record with default createdAt date', async () => {
        const wasteCollectionData = {
            collectionId: 'COL12346',
            residentId: 'RES12345',
            collectionDate: new Date(),
            status: 'Scheduled',
            garbage: [
                {
                    wasteType: 'Recyclable',
                    category: 'Plastic',
                    weight: 2.5,
                },
            ],
        };

        const wasteCollection = new WasteCollection(wasteCollectionData);
        const savedWasteCollection = await wasteCollection.save();

        expect(savedWasteCollection.createdAt).toBeDefined();
        expect(savedWasteCollection.createdAt).toBeInstanceOf(Date);
    });
});
