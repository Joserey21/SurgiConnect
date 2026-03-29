const express = require("express");
const router = express.Router();

let alerts = [
  {
    id: 1,
    type: "message",
    text: "New message received from Maria Lopez",
    timestamp: new Date().toLocaleString(),
    status: "Unread",
  },
  {
    id: 2,
    type: "status",
    text: "John Carter status changed to Post-Op",
    timestamp: new Date().toLocaleString(),
    status: "Unread",
  },
];

// GET unread alerts only
router.get("/", (req, res) => {
  const unreadAlerts = alerts.filter((alert) => alert.status === "Unread");
  res.json(unreadAlerts);
});

// POST create alert
router.post("/", (req, res) => {
  const { type, text } = req.body;

  const newAlert = {
    id: alerts.length + 1,
    type: type || "general",
    text: text || "New alert",
    timestamp: new Date().toLocaleString(),
    status: "Unread",
  };

  alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

// PATCH mark one alert as read
router.patch("/:id/read", (req, res) => {
  const alertId = parseInt(req.params.id);
  const foundAlert = alerts.find((alert) => alert.id === alertId);

  if (!foundAlert) {
    return res.status(404).json({ message: "Alert not found" });
  }

  foundAlert.status = "Read";
  res.json(foundAlert);
});

// PATCH mark all alerts as read
router.patch("/read-all", (req, res) => {
  alerts = alerts.map((alert) => ({
    ...alert,
    status: "Read",
  }));

  res.json({ message: "All alerts marked as read" });
});

module.exports = router;