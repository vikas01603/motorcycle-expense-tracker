const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  bikeId: mongoose.Schema.Types.ObjectId,
  date: Date,
  category: String,
  subCategory: String,
  description: String,
  amount: Number,
  odometer: Number,
  vendor: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", expenseSchema);
