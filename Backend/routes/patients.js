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
    language: "Spanish"
  },
  {
    id: 2,
    name: "John Carter",
    surgeryType: "Shoulder Repair",
    surgeon: "Dr. Brown",
    status: "Post-Op",
    language: "English"
  },
  {
    id: 3,
    name: "Ana Martinez",
    surgeryType: "ACL Reconstruction",
    surgeon: "Dr. Lee",
    status: "Recovered",
    language: "Spanish"
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

  res.json({
    message: "Patient status updated successfully",
    patient
  });
});

module.exports = router;