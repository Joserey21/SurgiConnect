const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const patientRoutes = require("./routes/patients");
const messageRoutes = require("./routes/messages");
const alertRoutes = require("./routes/alerts");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/patients", patientRoutes);
app.use("/messages", messageRoutes);
app.use("/alerts", alertRoutes);
app.use("/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});