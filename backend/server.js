require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bikes", require("./routes/bikeRoutes"));
app.use("/api/fuel", require("./routes/fuelRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/rides", require("./routes/rideRoutes"));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
