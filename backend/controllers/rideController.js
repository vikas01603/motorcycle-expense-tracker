const Ride = require("../models/Ride");
const Bike = require("../models/Bike");

// Create a new ride log for a bike
exports.addRide = async (req, res) => {
  try {
    const { bikeId } = req.body;

    if (!bikeId) {
      return res.status(400).json({ message: "bikeId is required" });
    }

    // Ensure the bike belongs to the authenticated user
    const bike = await Bike.findOne({ _id: bikeId, userId: req.userId });
    if (!bike) {
      return res.status(403).json({ message: "Unauthorized bike access" });
    }

    const ride = new Ride(req.body);
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all rides for a bike belonging to the current user
exports.getRides = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const bike = await Bike.findOne({ _id: bikeId, userId: req.userId });
    if (!bike) {
      return res.status(403).json({ message: "Unauthorized bike access" });
    }

    const rides = await Ride.find({ bikeId: bike._id }).sort({ date: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
