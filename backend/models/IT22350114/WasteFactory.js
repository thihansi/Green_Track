// WasteFactory.js
class WasteFactory {
  static createWaste(type, category, weight) {
    // Validate waste type and category
    if (type === "Recyclable" && RECYCLABLE_TYPES.includes(category)) {
      return new RecyclableWaste(category, weight);
    }
    if (type === "Non-Recyclable" && NON_RECYCLABLE_TYPES.includes(category)) {
      return new NonRecyclableWaste(category, weight);
    }
    throw new Error(`Invalid waste type or category: ${type}, ${category}`);
  }
}

// Define classes for each waste type
class RecyclableWaste {
  constructor(category, weight) {
    this.wasteType = "Recyclable";
    this.category = category;
    this.weight = weight;
  }
}

class NonRecyclableWaste {
  constructor(category, weight) {
    this.wasteType = "Non-Recyclable";
    this.category = category;
    this.weight = weight;
  }
}

const RECYCLABLE_TYPES = ["Paper", "Plastic", "Glass", "Metal"];
const NON_RECYCLABLE_TYPES = ["Food Waste", "Organic", "Hazardous", "Other"];

export default WasteFactory;
