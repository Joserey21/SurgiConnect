const express = require("express");
const router = express.Router();
const translateText = require("../utils/translate");

// Temporary dummy messages
let messages = [
  {
    id: 1,
    patientId: 1,
    patientName: "Maria Lopez",
    patientLanguage: "es",
    sender: "surgeon",
    from: "Surgeon",
    to: "Maria Lopez",
    subject: "Surgery Reminder",
    message: "Your surgery is scheduled tomorrow.",
    text: "Your surgery is scheduled tomorrow.",
    originalLanguage: "en",
    translatedText: "Tu cirugía está programada para mañana.",
    translatedLanguage: "es",
    status: "Unread",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  },
  {
    id: 2,
    patientId: 1,
    patientName: "Maria Lopez",
    patientLanguage: "es",
    sender: "patient",
    from: "Maria Lopez",
    to: "Surgeon",
    subject: "Thank You",
    message: "Gracias doctor.",
    text: "Gracias doctor.",
    originalLanguage: "es",
    translatedText: "Thank you doctor.",
    translatedLanguage: "en",
    status: "Unread",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  },
  {
    id: 3,
    patientId: 2,
    patientName: "John Carter",
    patientLanguage: "en",
    sender: "surgeon",
    from: "Surgeon",
    to: "John Carter",
    subject: "Recovery Update",
    message: "Recovery is going well.",
    text: "Recovery is going well.",
    originalLanguage: "en",
    translatedText: "Recovery is going well.",
    translatedLanguage: "en",
    status: "Read",
    timestamp: new Date().toLocaleString(),
    imageUrl: "",
    imageName: ""
  }
];

function normalizeLanguageCode(language) {
  if (!language) return "en";

  const value = language.toLowerCase().trim();

  if (value === "spanish" || value === "es") return "es";
  if (value === "english" || value === "en") return "en";
  if (value === "french" || value === "fr") return "fr";
  if (value === "mandarin" || value === "zh") return "zh";

  return "en";
}

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

// POST new message with translation
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      patientLanguage,
      sender,
      from,
      to,
      subject,
      message,
      text,
      status,
      imageUrl,
      imageName,
      originalLanguage
    } = req.body;

    const originalText = (message || text || "").trim();
    const senderType = sender || "surgeon";
    const normalizedOriginalLanguage = normalizeLanguageCode(originalLanguage);
    const normalizedPatientLanguage = normalizeLanguageCode(patientLanguage);

    let translatedText = originalText;
    let translatedLanguage = normalizedOriginalLanguage;

    if (originalText) {
      if (senderType === "patient") {
        if (normalizedOriginalLanguage !== "en") {
          translatedText = await translateText(originalText, "en");
          translatedLanguage = "en";
        }
      } else if (senderType === "surgeon") {
        if (normalizedPatientLanguage !== "en") {
          translatedText = await translateText(originalText, normalizedPatientLanguage);
          translatedLanguage = normalizedPatientLanguage;
        }
      }
    }

    const newMessage = {
      id: messages.length + 1,
      patientId: Number(patientId),
      patientName: patientName || "Unknown Patient",
      patientLanguage: normalizedPatientLanguage,
      sender: senderType,
      from: from || (senderType === "patient" ? patientName : "Surgeon"),
      to: to || (senderType === "patient" ? "Surgeon" : patientName),
      subject: subject || "No Subject",
      message: originalText,
      text: originalText,
      originalLanguage: normalizedOriginalLanguage,
      translatedText,
      translatedLanguage,
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "message",
        text: `New message received from ${newMessage.patientName}`
      })
    }).catch((error) => {
      console.error("Could not create message alert", error);
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Translation/send error:", error);
    res.status(500).json({ message: "Could not send translated message" });
  }
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