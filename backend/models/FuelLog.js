const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema({
  bikeId: mongoose.Schema.Types.ObjectId,
  date: Date,
  odometer: Number,
  fuelQuantity: Number,
  pricePerLiter: Number,
  totalCost: Number,
  fuelStation: String,
  calculatedMileage: Number,
  costPerKm: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FuelLog", fuelLogSchema);
