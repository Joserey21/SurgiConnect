const express = require("express");
const router = express.Router();

// dummy messages
let messages = [
  { id: 1, patientId: 1, sender: "surgeon", text: "Your surgery is scheduled tomorrow." },
  { id: 2, patientId: 1, sender: "patient", text: "Thank you doctor." },
  { id: 3, patientId: 2, sender: "surgeon", text: "Recovery is going well." }
];

// GET messages by patient id
router.get("/:patientId", (req, res) => {
  const patientId = parseInt(req.params.patientId);
  const patientMessages = messages.filter(m => m.patientId === patientId);
  res.json(patientMessages);
});

// POST new message
router.post("/", (req, res) => {
  const { patientId, sender, text } = req.body;

  const newMessage = {
    id: messages.length + 1,
    patientId,
    sender,
    text
  };

  messages.push(newMessage);

  res.status(201).json(newMessage);
});

module.exports = router;