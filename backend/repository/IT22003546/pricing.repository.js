// repositories/IT22003546/pricing.repository.js
import Pricing from '../../models/IT22003546/pricing.model.js';

class PricingRepository {
    async create(pricingData) {
        const pricing = new Pricing(pricingData);
        return await pricing.save();
    }

    async findAll() {
        return await Pricing.find();
    }

    async findById(pricingId) {
        return await Pricing.findById(pricingId);
    }

    async update(pricingId, pricingData) {
        return await Pricing.findByIdAndUpdate(pricingId, pricingData, { new: true, runValidators: true });
    }

    async delete(pricingId) {
        return await Pricing.findByIdAndDelete(pricingId);
    }
}

export default new PricingRepository();
