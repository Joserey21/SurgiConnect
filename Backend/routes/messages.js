const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      patientId: 1,
      sender: "surgeon",
      text: "Your procedure is scheduled for tomorrow."
    }
  ]);
});

module.exports = router;
