const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  bikeId: mongoose.Schema.Types.ObjectId,
  rideName: String,
  startOdometer: Number,
  endOdometer: Number,
  distance: Number,
  rideType: String,
  notes: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ride", rideSchema);
