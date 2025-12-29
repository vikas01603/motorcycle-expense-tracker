const Expense = require("../models/Expense");
const Bike = require("../models/Bike");

exports.addExpense = async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
};

exports.getExpenses = async (req, res) => {
  const bike = await Bike.findOne({
    _id: req.params.bikeId,
    userId: req.userId
  });

  if (!bike) {
    return res.status(403).json({ message: "Unauthorized bike access" });
  }

  const expenses = await Expense.find({ bikeId: bike._id });
  res.json(expenses);
};