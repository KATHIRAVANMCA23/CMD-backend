const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
 // Import notification routes
const http = require("http");

const activityRoutes = require("./routes/activityRoutes"); // Import Notification Model
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Routes
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", reportRoutes);

app.use("/api", activityRoutes);

// Setup Socket.io

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
