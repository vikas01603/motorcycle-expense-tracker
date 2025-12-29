const Service = require("../models/Service");
const Bike = require("../models/Bike");
const ServiceReminder = require("../models/ServiceReminder"); // ✅ FIX 1: missing import

exports.addService = async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.json(service);
};

// 🔁 KEEP REMINDER FEATURE (UNCHANGED LOGIC)
exports.getReminders = async (req, res) => {
  const bike = await Bike.findOne({
    _id: req.params.bikeId,
    userId: req.userId
  });

  if (!bike) {
    return res.status(403).json({ message: "Unauthorized bike access" });
  }

  const reminders = await ServiceReminder.find({
    bikeId: bike._id,
    isActive: true
  });

  res.json(reminders);
};

// Return actual service history for the Services page
exports.getServices = async (req, res) => {
  const bike = await Bike.findOne({
    _id: req.params.bikeId,
    userId: req.userId
  });

  if (!bike) {
    return res.status(403).json({ message: "Unauthorized bike access" });
  }

  const services = await Service.find({ bikeId: bike._id });
  res.json(services);
};
