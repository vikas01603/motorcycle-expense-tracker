const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const Service = require("../models/Service");
const Bike = require("../models/Bike");

exports.getDashboard = async (req, res) => {
  try {
    const bikeId = req.params.bikeId;

    const bike = await Bike.findById(bikeId);

    // ✅ SAFETY CHECK (THIS FIXES YOUR ERROR)
    if (!bike) {
      return res.status(404).json({
        message: "Bike not found for this ID"
      });
    }

    const fuelLogs = await FuelLog.find({ bikeId });
    const expenses = await Expense.find({ bikeId });
    const services = await Service.find({ bikeId });

    const fuelSpent = fuelLogs.reduce((s, f) => s + (f.totalCost || 0), 0);
    const expenseSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const serviceSpent = services.reduce((s, sv) => s + (sv.totalCost || 0), 0);

    const totalSpent = fuelSpent + expenseSpent + serviceSpent;

    const avgMileage =
      fuelLogs.length > 0
        ? fuelLogs.reduce((s, f) => s + (f.calculatedMileage || 0), 0) / fuelLogs.length
        : 0;

    const firstOdo = fuelLogs.length > 0 ? fuelLogs[0].odometer : bike.currentOdometer;
    const distance = bike.currentOdometer - firstOdo;

    const costPerKm = distance > 0 ? totalSpent / distance : 0;

    res.json({
      bikeName: bike.bikeName,
      totalSpent,
      fuelSpent,
      expenseSpent,
      serviceSpent,
      avgMileage: avgMileage.toFixed(2),
      costPerKm: costPerKm.toFixed(2),
      totalDistance: distance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
