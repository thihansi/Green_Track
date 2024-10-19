import Payment from "../../models/IT22003546/payment.model.js";

// Create a new collection payment
export const createPayment = async (req, res) => {
    const payment = new Payment(req.body);
    try {
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Get all collection payments
export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get a collection payment by ID
export const getPaymentById = async (req, res) => {
    const { Paymentid } = req.params;
    try {
        const payment = await Payment.findById(Paymentid);
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

// Update a collection payment by ID
export const updatePayment = async (req, res) => {
    const { Paymentid } = req.params;
    try {
        const payment = await Payment.findByIdAndUpdate (Paymentid, req.body, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// Delete a collection payment by ID
export const deletePayment = async (req, res) => {
    const { Paymentid } = req.params;
    try {
        const payment = await Payment.findByIdAndDelete(Paymentid);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

//get payment by resident id
export const getPaymentByResidentId = async (req, res) => {
    const { residentId } = req.params;
    
    try {
        const payment = await Payment.find({ customerID: residentId });
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
