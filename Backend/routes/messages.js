const express = require("express");
const router = express.Router();

let nextId = 6;
let messages = [
  {
    id: 1,
    patientId: 1,
    patientName: "Maria Lopez",
    from: "Maria Lopez",
    to: "Surgeon",
    sender: "patient",
    subject: "Knee Surgery Recovery Update",
    message:
      "Patient reports mild pain in the incision area. Recommended ice therapy and prescribed acetaminophen. Follow-up in 2 days.",
    text:
      "Patient reports mild pain in the incision area. Recommended ice therapy and prescribed acetaminophen. Follow-up in 2 days.",
    timestamp: "2026-03-28 10:30 AM",
    status: "Unread",
  },
  {
    id: 2,
    patientId: 2,
    patientName: "John Smith",
    from: "John Smith",
    to: "Surgeon",
    sender: "patient",
    subject: "Monitoring Blood Work Results",
    message:
      "All monitoring lab results are normal. Patient is cleared for shoulder surgery on 2026-03-30. No restrictions.",
    text:
      "All monitoring lab results are normal. Patient is cleared for shoulder surgery on 2026-03-30. No restrictions.",
    timestamp: "2026-03-27 2:15 PM",
    status: "Unread",
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Ana Garcia",
    from: "Ana Garcia",
    to: "Surgeon",
    sender: "patient",
    subject: "Spine Surgery Recovery Progress",
    message:
      "Patient reports excellent progress with physical therapy. Range of motion increasing steadily. Can return to light activities.",
    text:
      "Patient reports excellent progress with physical therapy. Range of motion increasing steadily. Can return to light activities.",
    timestamp: "2026-03-26 9:45 AM",
    status: "Read",
  },
  {
    id: 4,
    patientId: 1,
    patientName: "Maria Lopez",
    from: "Maria Lopez",
    to: "Surgeon",
    sender: "patient",
    subject: "Knee Swelling Concern",
    message:
      "Patient noticed increased swelling around knee. Advised to elevate leg and monitor. Will schedule ultrasound if persists.",
    text:
      "Patient noticed increased swelling around knee. Advised to elevate leg and monitor. Will schedule ultrasound if persists.",
    timestamp: "2026-03-25 4:20 PM",
    status: "Unread",
  },
  {
    id: 5,
    patientId: 2,
    patientName: "John Smith",
    from: "John Smith",
    to: "Surgeon",
    sender: "patient",
    subject: "Monitoring Instructions Confirmed",
    message:
      "Patient confirmed receipt of monitoring instructions for shoulder procedure. Fasting from midnight. Surgical clearance obtained.",
    text:
      "Patient confirmed receipt of monitoring instructions for shoulder procedure. Fasting from midnight. Surgical clearance obtained.",
    timestamp: "2026-03-24 11:00 AM",
    status: "Unread",
  },
];

router.get("/", (req, res) => {
  res.json(messages);
});

router.get("/patient/:patientId", (req, res) => {
  const patientId = Number(req.params.patientId);
  const patientMessages = messages.filter((msg) => msg.patientId === patientId);
  res.json(patientMessages);
});

router.post("/", (req, res) => {
  const {
    patientId,
    sender,
    text,
    patientName,
    from,
    to,
    subject,
    message,
    imageUrl,
    imageName,
    status,
    timestamp,
  } = req.body;

  const normalizedPatientId = Number(patientId);
  if (!Number.isFinite(normalizedPatientId)) {
    return res.status(400).json({ error: "patientId is required and must be a number" });
  }

  const content = message || text;
  if (!content || !String(content).trim()) {
    return res.status(400).json({ error: "message text is required" });
  }

  const displayName = patientName || "Unknown Patient";
  const normalizedSender = sender === "surgeon" ? "surgeon" : "patient";
  const senderName = from || (normalizedSender === "surgeon" ? "Surgeon" : displayName);
  const recipientName = to || (normalizedSender === "surgeon" ? displayName : "Surgeon");

  const newMessage = {
    id: nextId++,
    patientId: normalizedPatientId,
    patientName: displayName,
    from: senderName,
    to: recipientName,
    sender: normalizedSender,
    subject: subject || `Message from ${displayName}`,
    message: String(content).trim(),
    text: String(content).trim(),
    imageUrl: imageUrl || "",
    imageName: imageName || "",
    timestamp: timestamp || new Date().toLocaleString(),
    status: status || "Unread",
  };

  messages.push(newMessage);
  return res.status(201).json(newMessage);
});

router.patch("/read-all", (req, res) => {
  messages = messages.map((msg) =>
    msg.status === "Unread" ? { ...msg, status: "Read" } : msg
  );
  res.json({ success: true, updatedCount: messages.filter((msg) => msg.status === "Read").length });
});

router.patch("/:id/read", (req, res) => {
  const messageId = Number(req.params.id);
  const messageIndex = messages.findIndex((msg) => msg.id === messageId);

  if (messageIndex === -1) {
    return res.status(404).json({ error: "Message not found" });
  }

  messages[messageIndex] = { ...messages[messageIndex], status: "Read" };
  return res.json(messages[messageIndex]);
});

router.delete("/:id", (req, res) => {
  const messageId = Number(req.params.id);
  const initialLength = messages.length;
  messages = messages.filter((msg) => msg.id !== messageId);

  if (messages.length === initialLength) {
    return res.status(404).json({ error: "Message not found" });
  }

  return res.status(204).send();
});

router.get("/:patientId", (req, res) => {
  const patientId = Number(req.params.patientId);
  const patientMessages = messages.filter((msg) => msg.patientId === patientId);
  res.json(patientMessages);
});

module.exports = router;
