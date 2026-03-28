import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/patients/${id}`)
      .then(res => res.json())
      .then(data => setPatient(data));

    fetchMessages();
  }, [id]);

  const fetchMessages = () => {
    fetch(`http://localhost:5000/messages/${id}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patientId: parseInt(id),
        sender: "surgeon",
        text: newMessage
      })
    });

    setNewMessage("");
    fetchMessages();
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/patients">← Back</Link>

      <h1>{patient.name}</h1>
      <p><strong>Surgery:</strong> {patient.surgeryType}</p>
      <p><strong>Status:</strong> {patient.status}</p>

      <hr />

      <h2>Messages</h2>

      <div style={{ marginBottom: "15px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "8px",
              marginBottom: "5px",
              backgroundColor: msg.sender === "surgeon" ? "#e3f2fd" : "#f1f1f1",
              borderRadius: "6px"
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
          placeholder="Type message..."
          style={{ padding: "8px", width: "70%" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px", marginLeft: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default PatientDetails;