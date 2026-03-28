const express = require("express");
const router = express.Router();

let alerts = [
  {
    id: 1,
    type: "message",
    text: "New message received from Maria Lopez",
    timestamp: new Date().toLocaleString(),
  },
  {
    id: 2,
    type: "status",
    text: "John Carter status changed to Post-Op",
    timestamp: new Date().toLocaleString(),
  },
];

// GET all alerts
router.get("/", (req, res) => {
  res.json(alerts);
});

// POST create alert
router.post("/", (req, res) => {
  const { type, text } = req.body;

  const newAlert = {
    id: alerts.length + 1,
    type: type || "general",
    text: text || "New alert",
    timestamp: new Date().toLocaleString(),
  };

  alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

module.exports = router;