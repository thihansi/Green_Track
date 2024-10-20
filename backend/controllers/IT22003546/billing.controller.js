// billing.controller.js
import BillingRepository from '../../repository/IT22003546/billing.repository.js';

export const createBilling = async (req, res) => {
    try {
        const billing = await BillingRepository.create(req.body);
        res.status(201).json(billing);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getBillings = async (req, res) => {
    try {
        const billings = await BillingRepository.findAll();
        res.status(200).json(billings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getBillingById = async (req, res) => {
    const { Billingid } = req.params;
    try {
        const billing = await BillingRepository.findById(Billingid);
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found",
            });
        }
        res.status(200).json(billing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBilling = async (req, res) => {
    const { Billingid } = req.params;
    try {
        const billing = await BillingRepository.update(Billingid, req.body);
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found",
            });
        }
        res.status(200).json({
            success: true,
            billing,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteBilling = async (req, res) => {
    const { Billingid } = req.params;
    try {
        const billing = await BillingRepository.delete(Billingid);
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Billing deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
