import { useEffect, useState } from "react";

function PatientView() {
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  const fetchMessages = (patientId) => {
    fetch(`http://localhost:5000/messages/${patientId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  useEffect(() => {
    fetchMessages(selectedPatientId);
  }, [selectedPatientId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patientId: selectedPatientId,
        sender: "patient",
        text: newMessage
      })
    });

    setNewMessage("");
    fetchMessages(selectedPatientId);
  };

  const selectedPatient = patients.find(
    (patient) => patient.id === selectedPatientId
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Chat</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>
          Demo Patient:
        </label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(Number(e.target.value))}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPatient && (
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Name:</strong> {selectedPatient.name}</p>
          <p><strong>Surgery:</strong> {selectedPatient.surgeryType}</p>
          <p><strong>Status:</strong> {selectedPatient.status}</p>
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "10px",
              marginBottom: "8px",
              backgroundColor: msg.sender === "patient" ? "#d4edda" : "#e3f2fd",
              borderRadius: "8px"
            }}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message your surgeon..."
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 14px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default PatientView;