const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  bikeId: mongoose.Schema.Types.ObjectId,
  totalSpent: Number,
  fuelSpent: Number,
  serviceSpent: Number,
  avgMileage: Number,
  costPerKm: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StatsCache", statsSchema);
