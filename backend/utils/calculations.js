const calculateMileage = (distance, fuel) => {
  return fuel > 0 ? distance / fuel : 0;
};

const calculateCostPerKm = (totalCost, distance) => {
  return distance > 0 ? totalCost / distance : 0;
};

module.exports = {
  calculateMileage,
  calculateCostPerKm
};
