// payment.repository.js
import Payment from "../../models/IT22003546/payment.model.js";

class PaymentRepository {
    async create(paymentData) {
        const payment = new Payment(paymentData);
        return await payment.save();
    }

    async findAll() {
        return await Payment.find();
    }

    async findById(paymentId) {
        return await Payment.findById(paymentId);
    }

    async update(paymentId, paymentData) {
        return await Payment.findByIdAndUpdate(paymentId, paymentData, { new: true, runValidators: true });
    }

    async delete(paymentId) {
        return await Payment.findByIdAndDelete(paymentId);
    }

    async findByResidentId(residentId) {
        return await Payment.find({ customerID: residentId });
    }
}

export default new PaymentRepository();
