// payment.controller.js
import PaymentRepository from '../../repository/IT22003546/payment.repository.js';

export const createPayment = async (req, res) => {
    try {
        const payment = await PaymentRepository.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        const payments = await PaymentRepository.findAll();
        res.status(200).json(payments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPaymentById = async (req, res) => {
    const { Paymentid } = req.params;
    try {
        const payment = await PaymentRepository.findById(Paymentid);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePayment = async (req, res) => {
    const { Paymentid } = req.params;
    try {
        const payment = await PaymentRepository.update(Paymentid, req.body);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }
        res.status(200).json({
            success: true,
            payment,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deletePayment = async (req, res) => {
    const { Paymentid } = req.params;
    try {
        const payment = await PaymentRepository.delete(Paymentid);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Payment deleted successfully",
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPaymentByResidentId = async (req, res) => {
    const { residentId } = req.params;

    try {
        const payment = await PaymentRepository.findByResidentId(residentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
