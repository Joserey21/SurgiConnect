const express = require("express");
const router = express.Router();

// dummy messages
let messages = [
  {
    id: 1,
    patientId: 1,
    patientName: "Maria Lopez",
    sender: "surgeon",
    from: "Surgeon",
    to: "Maria Lopez",
    subject: "Surgery Reminder",
    message: "Your surgery is scheduled tomorrow.",
    text: "Your surgery is scheduled tomorrow.",
    status: "Unread",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  },
  {
    id: 2,
    patientId: 1,
    patientName: "Maria Lopez",
    sender: "patient",
    from: "Maria Lopez",
    to: "Surgeon",
    subject: "Thank You",
    message: "Thank you doctor.",
    text: "Thank you doctor.",
    status: "Unread",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  },
  {
    id: 3,
    patientId: 2,
    patientName: "John Carter",
    sender: "surgeon",
    from: "Surgeon",
    to: "John Carter",
    subject: "Recovery Update",
    message: "Recovery is going well.",
    text: "Recovery is going well.",
    status: "Read",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  },
  {
    id: 4,
    patientId: 3,
    patientName: "Ana Martinez",
    sender: "patient",
    from: "Ana Martinez",
    to: "Surgeon",
    subject: "Progress Update",
    message: "I am feeling better today.",
    text: "I am feeling better today.",
    status: "Unread",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  }
];

// GET all messages
router.get("/", (req, res) => {
  res.json(messages);
});

// GET messages by patient id
router.get("/:patientId", (req, res) => {
  const patientId = parseInt(req.params.patientId);
  const patientMessages = messages.filter((m) => m.patientId === patientId);
  res.json(patientMessages);
});

// POST new message
router.post("/", (req, res) => {
  const {
    patientId,
    patientName,
    sender,
    from,
    to,
    subject,
    message,
    text,
    status,
    imageUrl,
    imageName
  } = req.body;

  const newMessage = {
    id: messages.length + 1,
    patientId: Number(patientId),
    patientName: patientName || "Unknown Patient",
    sender: sender || "surgeon",
    from: from || (sender === "patient" ? patientName : "Surgeon"),
    to: to || (sender === "patient" ? "Surgeon" : patientName),
    subject: subject || "No Subject",
    message: message || text || "",
    text: text || message || "",
    status: status || "Unread",
    timestamp: new Date().toLocaleString(),
    imageUrl: imageUrl || "",
    imageName: imageName || ""
  };

  messages.unshift(newMessage);

  const fetch = global.fetch;

  fetch("http://localhost:5000/alerts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "message",
      text: `New message received from ${newMessage.patientName}`,
    }),
  }).catch((error) => {
    console.error("Could not create message alert", error);
  });

  res.status(201).json(newMessage);
});

// PATCH mark one message as read
router.patch("/:id/read", (req, res) => {
  const messageId = parseInt(req.params.id);
  const foundMessage = messages.find((m) => m.id === messageId);

  if (!foundMessage) {
    return res.status(404).json({ message: "Message not found" });
  }

  foundMessage.status = "Read";

  res.json(foundMessage);
});

// PATCH mark all messages as read
router.patch("/read-all", (req, res) => {
  messages = messages.map((message) => ({
    ...message,
    status: "Read"
  }));

  res.json({ message: "All messages marked as read" });
});

// DELETE one message
router.delete("/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  const existingLength = messages.length;

  messages = messages.filter((m) => m.id !== messageId);

  if (messages.length === existingLength) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.status(204).send();
});

module.exports = router;