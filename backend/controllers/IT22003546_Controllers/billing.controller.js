import Billing from '../../models/IT22003546_models/billing.model.js';

// Create a new collection billing
export const createBilling = async (req, res) => {
  const billing = new Billing(req.body);
  try {
    await billing.save();
    res.status(201).json(billing);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Get all collection billings
export const getBillings = async (req, res) => {
  try {
    const billings = await Billing.find();
    res.status(200).json(billings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a collection billing by ID
export const getBillingById = async (req, res) => {
  const { Billingid } = req.params;
  try {
    const billing = await Billing.findById(Billingid);
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

// Update a collection billing by ID
export const updateBilling = async (req, res) => {
  const { Billingid } = req.params;
  try {
    const billing = await Billing.findByIdAndUpdate(Billingid, req.body, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// Delete a collection billing by ID
export const deleteBilling = async (req, res) => {
    const { Billingid } = req.params;
    try {
      const billing = await Billing.findByIdAndDelete(Billingid);
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
