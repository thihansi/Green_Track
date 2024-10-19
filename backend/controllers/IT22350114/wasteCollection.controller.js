import WasteCollection from '../../models/IT22350114/wasteCollection.model.js';

// Create a new waste collection record
export const createWasteCollection = async (req, res, next) => {
  const wasteCollection = new WasteCollection(req.body);
  try {
    await wasteCollection.save();
    res.status(201).json({ success: true, data: wasteCollection });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};

// Get all waste collection records
export const getWasteCollections = async (req, res, next) => {
  try {
    const wasteCollections = await WasteCollection.find();
    res.status(200).json({ success: true, data: wasteCollections });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};

// Get a waste collection record by ID
export const getWasteCollectionById = async (req, res, next) => {
  const { wasteCollectionId } = req.params;
  try {
    const wasteCollection = await WasteCollection.findById(wasteCollectionId);
    if (!wasteCollection) {
      return res.status(404).json({
        success: false,
        message: "Waste collection record not found",
      });
    }
    res.status(200).json({ success: true, data: wasteCollection });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};

// Update a waste collection record by ID
export const updateWasteCollection = async (req, res, next) => {
  const { wasteCollectionId } = req.params;
  try {
    const wasteCollection = await WasteCollection.findByIdAndUpdate(wasteCollectionId, req.body, { new: true, runValidators: true });
    if (!wasteCollection) {
      return res.status(404).json({
        success: false,
        message: "Waste collection record not found",
      });
    }
    res.status(200).json({ success: true, data: wasteCollection });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};

// Delete a waste collection record by ID
export const deleteWasteCollection = async (req, res, next) => {
  const { wasteCollectionId } = req.params;
  try {
    const wasteCollection = await WasteCollection.findByIdAndDelete(wasteCollectionId);
    if (!wasteCollection) {
      return res.status(404).json({
        success: false,
        message: "Waste collection record not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Waste collection record deleted successfully",
    });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};

// Get waste collection records by resident ID
export const getWasteCollectionsByResidentId = async (req, res, next) => {
  const { residentId } = req.params;
  try {
    const wasteCollections = await WasteCollection.find({ residentId });
    res.status(200).json({ success: true, data: wasteCollections });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};

// Get waste collection records by collection month
export const getWasteCollectionsByCollectionMonth = async (req, res, next) => {
  const { collectionDate } = req.params; // Expecting format 'YYYY-MM' (e.g., '2024-10')
  try {
    const date = new Date(collectionDate + '-01');
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const wasteCollections = await WasteCollection.find({
      collectionDate: {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    });

    res.status(200).json({ success: true, data: wasteCollections });
  } catch (error) {
    next(error);  // Pass error to global error handler
  }
};
