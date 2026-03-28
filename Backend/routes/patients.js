const express = require("express");
const router = express.Router();

// Temporary dummy data
let patients = [
  {
    id: 1,
    name: "Maria Lopez",
    surgeryType: "Knee Surgery",
    surgeon: "Dr. Smith",
    status: "Pre-Op",
    language: "Spanish",
    surgeryDate: "2026-03-30",
    notes: ""
  },
  {
    id: 2,
    name: "John Carter",
    surgeryType: "Shoulder Repair",
    surgeon: "Dr. Brown",
    status: "Post-Op",
    language: "English",
    surgeryDate: "2026-03-25",
    notes: ""
  },
  {
    id: 3,
    name: "Ana Martinez",
    surgeryType: "ACL Reconstruction",
    surgeon: "Dr. Lee",
    status: "Recovered",
    language: "Spanish",
    surgeryDate: "2026-03-20",
    notes: ""
  }
];

// GET all patients
router.get("/", (req, res) => {
  res.json(patients);
});

// GET one patient by id
router.get("/:id", (req, res) => {
  const patientId = parseInt(req.params.id);
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  res.json(patient);
});

// POST create patient
router.post("/", (req, res) => {
  const {
    name,
    surgeryType,
    surgeon,
    status,
    language,
    surgeryDate,
    notes
  } = req.body;

  if (!name || !surgeryType) {
    return res.status(400).json({
      message: "Name and surgery type are required"
    });
  }

  const newPatient = {
    id: patients.length + 1,
    name,
    surgeryType,
    surgeon: surgeon || "Dr. Smith",
    status: status || "Pre-Op",
    language: language || "English",
    surgeryDate: surgeryDate || "",
    notes: notes || ""
  };

  patients.push(newPatient);

  res.status(201).json(newPatient);
});

// PATCH update patient status
router.patch("/:id/status", (req, res) => {
  const patientId = parseInt(req.params.id);
  const { status } = req.body;

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  patient.status = status;

  const fetch = global.fetch;

fetch("http://localhost:5000/alerts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "status",
    text: `${patient.name} status changed to ${status}`,
  }),
}).catch((error) => {
  console.error("Could not create status alert", error);
});

  res.json({
    message: "Patient status updated successfully",
    patient
  });
});

module.exports = router;