const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  bikeName: String,
  brand: String,
  model: String,
  year: Number,
  engineCC: Number,
  registrationNumber: String,
  purchaseDate: Date,
  purchasePrice: Number,
  currentOdometer: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bike", bikeSchema);
