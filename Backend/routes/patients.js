const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Maria Lopez",
      surgeryType: "Knee Surgery",
      surgeon: "Dr. Smith",
      status: "Pre-Op",
      language: "Spanish"
    }
  ]);
});

module.exports = router;