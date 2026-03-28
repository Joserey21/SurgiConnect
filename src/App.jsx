import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./client/Dashboard";
import Patients from "./client/Patients";
import Messages from "./client/Messages";
import Uploads from "./client/Uploads";
import Status from "./client/Status";
import Sidebar from "./client/Sidebar";

function App() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Maria Lopez",
      procedure: "Knee",
      language: "Spanish",
      surgeryDate: "2026-03-28",
      status: "Recovering",
      notes: "Patient uploaded recovery photo and asked about pain level.",
    },
    {
      id: 2,
      name: "John Smith",
      procedure: "Shoulder",
      language: "English",
      surgeryDate: "2026-03-30",
      status: "Monitoring",
      notes: "Monitoring instructions sent. Waiting for confirmation.",
    },
    {
      id: 3,
      name: "Ana Garcia",
      procedure: "Spine",
      language: "Spanish",
      surgeryDate: "2026-04-01",
      status: "Stable",
      notes: "Patient completed follow-up and recovery looks good.",
    },
  ]);

  const [notifications, setNotifications] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      patientId: 1,
      patientName: "Maria Lopez",
      subject: "Knee Surgery Recovery Update",
      message: "Patient reports mild pain in the incision area. Recommended ice therapy and prescribed acetaminophen. Follow-up in 2 days.",
      timestamp: "2026-03-28 10:30 AM",
      status: "Unread",
    },
    {
      id: 2,
      patientId: 2,
      patientName: "John Smith",
      subject: "Monitoring Blood Work Results",
      message: "All monitoring lab results are normal. Patient is cleared for shoulder surgery on 2026-03-30. No restrictions.",
      timestamp: "2026-03-27 2:15 PM",
      status: "Unread",
    },
    {
      id: 3,
      patientId: 3,
      patientName: "Ana Garcia",
      subject: "Spine Surgery Recovery Progress",
      message: "Patient reports excellent progress with physical therapy. Range of motion increasing steadily. Can return to light activities.",
      timestamp: "2026-03-26 9:45 AM",
      status: "Read",
    },
    {
      id: 4,
      patientId: 1,
      patientName: "Maria Lopez",
      subject: "Knee Swelling Concern",
      message: "Patient noticed increased swelling around knee. Advised to elevate leg and monitor. Will schedule ultrasound if persists.",
      timestamp: "2026-03-25 4:20 PM",
      status: "Unread",
    },
    {
      id: 5,
      patientId: 2,
      patientName: "John Smith",
      subject: "Monitoring Instructions Confirmed",
      message: "Patient confirmed receipt of monitoring instructions for shoulder procedure. Fasting from midnight. Surgical clearance obtained.",
      timestamp: "2026-03-24 11:00 AM",
      status: "Unread",
    },
  ]);

  const handleStatusChange = useCallback((patientId, newStatus) => {
    const patient = patients.find((p) => p.id === patientId);
    const updatedPatients = patients.map((patient) =>
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    );
    setPatients(updatedPatients);

    // Create notification
    const notification = {
      id: Date.now(),
      message: `${patient.name}'s status updated to ${newStatus}`,
      patientId,
      oldStatus: patient.status,
      newStatus,
    };
    setNotifications((prev) => [...prev, notification]);
  }, [patients]);

  const handleSurgeryDateChange = useCallback((patientId, newSurgeryDate) => {
    const patient = patients.find((p) => p.id === patientId);
    const updatedPatients = patients.map((patient) =>
      patient.id === patientId ? { ...patient, surgeryDate: newSurgeryDate } : patient
    );
    setPatients(updatedPatients);

    // Create notification
    const notification = {
      id: Date.now(),
      message: `${patient.name}'s surgery date updated to ${newSurgeryDate}`,
      patientId,
      oldStatus: `Surgery: ${patient.surgeryDate}`,
      newStatus: `Surgery: ${newSurgeryDate}`,
    };
    setNotifications((prev) => [...prev, notification]);

    // Create message
    const newMessage = {
      id: Date.now() + 1000,
      patientId,
      patientName: patient.name,
      subject: `Surgery Date Updated: ${patient.name}`,
      message: `Surgery date for ${patient.name} has been rescheduled from ${patient.surgeryDate} to ${newSurgeryDate}. Please ensure all monitoring preparations are aligned with the new date.`,
      timestamp: new Date().toLocaleString(),
      status: "Unread",
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [patients]);

  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const addPatient = (newPatientData) => {
    const newPatient = {
      id: Math.max(...patients.map((p) => p.id), 0) + 1,
      name: newPatientData.name || "New Patient",
      procedure: newPatientData.procedure || "Pending",
      language: newPatientData.language || "English",
      surgeryDate: newPatientData.surgeryDate || "TBD",
      status: "Monitoring",
      notes: newPatientData.notes || "Patient file uploaded",
    };
    setPatients((prev) => [...prev, newPatient]);

    // Create notification for new patient
    const notification = {
      id: Date.now(),
      message: `New patient "${newPatient.name}" added for ${newPatient.procedure}`,
      patientId: newPatient.id,
      oldStatus: "N/A",
      newStatus: newPatient.status,
    };
    setNotifications((prev) => [...prev, notification]);

    // Create message for new patient
    const newMessage = {
      id: Date.now() + 1000,
      patientId: newPatient.id,
      patientName: newPatient.name,
      subject: `New Patient Admitted: ${newPatient.name}`,
      message: `Patient ${newPatient.name} has been added to the system for ${newPatient.procedure}. Status set to ${newPatient.status}. Surgery scheduled for ${newPatient.surgeryDate}. ${newPatientData.notes ? `Notes: ${newPatientData.notes}` : ""}`,
      timestamp: new Date().toLocaleString(),
      status: "Unread",
    };
    setMessages((prev) => [...prev, newMessage]);

    return newPatient;
  };

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard patients={patients} notifications={notifications} clearNotification={clearNotification} messages={messages} />} />
            <Route path="/patients" element={<Patients patients={patients} handleStatusChange={handleStatusChange} handleSurgeryDateChange={handleSurgeryDateChange} />} />
            <Route path="/messages" element={<Messages messages={messages} setMessages={setMessages} />} />
            <Route path="/uploads" element={<Uploads addPatient={addPatient} />} />
            <Route path="/status" element={<Status patients={patients} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;