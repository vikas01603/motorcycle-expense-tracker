const FuelLog = require("../models/FuelLog");
const Bike = require("../models/Bike");

exports.addFuel = async (req, res) => {
  const fuel = new FuelLog(req.body);
  await fuel.save();
  res.json(fuel);
};

exports.getFuelLogs = async (req, res) => {
  const bike = await Bike.findOne({
    _id: req.params.bikeId,
    userId: req.userId
  });

  if (!bike) {
    return res.status(403).json({ message: "Unauthorized bike access" });
  }

  const logs = await FuelLog.find({ bikeId: bike._id });
  res.json(logs);
};