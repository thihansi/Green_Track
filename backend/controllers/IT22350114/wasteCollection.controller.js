import WasteCollection from '../../models/IT22350114/wasteCollection.model.js';

// Create a new waste collection record
export const createWasteCollection = async (req, res) => {
  const wasteCollection = new WasteCollection(req.body);
  try {
    await wasteCollection.save();
    res.status(201).json(wasteCollection);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Get all waste collection records
export const getWasteCollections = async (req, res) => {
  try {
    const wasteCollections = await WasteCollection.find();
    res.status(200).json(wasteCollections);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a waste collection record by ID
export const getWasteCollectionById = async (req, res) => {
  const { wasteCollectionId } = req.params;
  try {
    const wasteCollection = await WasteCollection.findById(wasteCollectionId);
    if (!wasteCollection) {
      return res.status(404).json({
        success: false,
        message: "Waste collection record not found",
      });
    }
    res.status(200).json(wasteCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a waste collection record by ID
export const updateWasteCollection = async (req, res) => {
  const { wasteCollectionId } = req.params;
  try {
    const wasteCollection = await WasteCollection.findByIdAndUpdate(wasteCollectionId, req.body, { new: true, runValidators: true });
    if (!wasteCollection) {
      return res.status(404).json({
        success: false,
        message: "Waste collection record not found",
      });
    }
    res.status(200).json({
      success: true,
      wasteCollection,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a waste collection record by ID
export const deleteWasteCollection = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get waste collection records by resident ID
export const getWasteCollectionsByResidentId = async (req, res) => {
  const { residentId } = req.params;
  try {
    const wasteCollections = await WasteCollection.find({ residentId });
    res.status(200).json(wasteCollections);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get waste collection records by collection month
export const getWasteCollectionsByCollectionMonth = async (req, res) => {
    const { collectionDate } = req.params; // Expecting format 'YYYY-MM' (e.g., '2024-10')

    try {
        // Parse the year and month from the collectionDate
        const date = new Date(collectionDate + '-01'); // Add a day to create a valid date
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1); // First day of the next month

        // Find records in the specified month
        const wasteCollections = await WasteCollection.find({
            collectionDate: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        });

        res.status(200).json(wasteCollections);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};






// Apply verifyToken middleware to all routes if needed