const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  bikeId: mongoose.Schema.Types.ObjectId,
  serviceDate: Date,
  serviceType: String,
  odometer: Number,
  totalCost: Number,
  serviceCenter: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", serviceSchema);
