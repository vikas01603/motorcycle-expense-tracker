const Bike = require("../models/Bike");

exports.addBike = async (req, res) => {
  const bike = new Bike(req.body);
  await bike.save();
  res.json(bike);
};

exports.getBikeByUser = async (req, res) => {
  // userId comes from JWT, NOT URL
  const bikes = await Bike.find({ userId: req.userId });
  res.json(bikes);
};


