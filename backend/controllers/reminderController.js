const ServiceReminder = require("../models/ServiceReminder");

exports.addReminder = async (req, res) => {
  const reminder = new ServiceReminder(req.body);
  await reminder.save();
  res.json(reminder);
};

exports.getReminders = async (req, res) => {
  const reminders = await ServiceReminder.find({
    bikeId: req.params.bikeId,
    isActive: true
  });
  res.json(reminders);
};
