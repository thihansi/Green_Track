// WasteFactory.js
import { RECYCLABLE_TYPES, NON_RECYCLABLE_TYPES } from './constants.js';

class Waste {
  constructor(wasteType, category, weight) {
    this.wasteType = wasteType;
    this.category = category;
    this.weight = weight;
  }
}

class RecyclableWaste extends Waste {
  constructor(category, weight) {
    super('Recyclable', category, weight);
  }
}

class NonRecyclableWaste extends Waste {
  constructor(category, weight) {
    super('Non-Recyclable', category, weight);
  }
}

class WasteFactory {
  static createWaste(type, category, weight) {
    if (type === 'Recyclable' && RECYCLABLE_TYPES.includes(category)) {
      return new RecyclableWaste(category, weight);
    }
    if (type === 'Non-Recyclable' && NON_RECYCLABLE_TYPES.includes(category)) {
      return new NonRecyclableWaste(category, weight);
    }
    throw new Error(`Invalid waste type or category: ${type}, ${category}`);
  }
}

export default WasteFactory;
