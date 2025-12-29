const mongoose = require("mongoose");

const serviceReminderSchema = new mongoose.Schema({
  bikeId: mongoose.Schema.Types.ObjectId,
  reminderType: String,      // Oil Change, Insurance, General Service
  intervalKm: Number,        // e.g. 10000
  intervalMonths: Number,    // e.g. 6
  lastServiceOdometer: Number,
  lastServiceDate: Date,
  nextDueOdometer: Number,
  nextDueDate: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceReminder", serviceReminderSchema);
