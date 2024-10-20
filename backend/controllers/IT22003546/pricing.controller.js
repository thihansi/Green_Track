// controllers/IT22003546/pricing.controller.js
import PricingRepository from '../../repository/IT22003546/pricing.repository.js';

// Create a new collection pricing
export const createPricing = async (req, res) => {
    try {
        const pricing = await PricingRepository.create(req.body);
        res.status(201).json(pricing);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Get all collection pricings
export const getPricings = async (req, res) => {
    try {
        const pricings = await PricingRepository.findAll();
        res.status(200).json(pricings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get a collection pricing by ID
export const getPricingById = async (req, res) => {
    const { Pricingid } = req.params;
    try {
        const pricing = await PricingRepository.findById(Pricingid);
        if (!pricing) {
            return res.status(404).json({ success: false, message: "Pricing not found" });
        }
        res.status(200).json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a collection pricing by ID
export const updatePricing = async (req, res) => {
    const { Pricingid } = req.params;
    try {
        const pricing = await PricingRepository.update(Pricingid, req.body);
        if (!pricing) {
            return res.status(404).json({ success: false, message: "Pricing not found" });
        }
        res.status(200).json({ success: true, pricing });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a collection pricing
export const deletePricing = async (req, res) => {
    const { Pricingid } = req.params;
    try {
        const pricing = await PricingRepository.delete(Pricingid);
        if (!pricing) {
            return res.status(404).json({ success: false, message: "Pricing not found" });
        }
        res.status(200).json({ success: true, message: "Pricing deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
