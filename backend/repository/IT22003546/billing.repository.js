// billing.repository.js
import Billing from "../../models/IT22003546/billing.model.js";

class BillingRepository {
    async create(billingData) {
        const billing = new Billing(billingData);
        return await billing.save();
    }

    async findAll() {
        return await Billing.find();
    }

    async findById(billingId) {
        return await Billing.findById(billingId);
    }

    async update(billingId, billingData) {
        return await Billing.findByIdAndUpdate(billingId, billingData, { new: true, runValidators: true });
    }

    async delete(billingId) {
        return await Billing.findByIdAndDelete(billingId);
    }
}

export default new BillingRepository();
