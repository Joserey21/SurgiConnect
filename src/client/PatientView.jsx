import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PatientView() {
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error("Error loading patients:", error));
  }, []);

  const fetchMessages = (patientId) => {
    fetch(`${API_BASE_URL}/messages/${patientId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error loading messages:", error));
  };

  useEffect(() => {
    fetchMessages(selectedPatientId);
  }, [selectedPatientId]);

  const selectedPatient = patients.find(
    (patient) => patient.id === selectedPatientId
  );

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() && !selectedFile) return;
    if (!selectedPatient) return;

    try {
      setIsSending(true);

      let uploadedImageUrl = "";
      let uploadedImageName = "";

      if (selectedFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", selectedFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadResult = await uploadResponse.json();
        uploadedImageName = uploadResult.file || selectedFile.name;
        uploadedImageUrl = `${API_BASE_URL}/uploads/${uploadResult.file}`;
      }

      const payload = {
        patientId: selectedPatientId,
        patientName: selectedPatient.name,
        patientLanguage:
          selectedPatient.language === "Spanish"
            ? "es"
            : selectedPatient.language === "English"
            ? "en"
            : "en",
        sender: "patient",
        from: selectedPatient.name,
        to: "Surgeon",
        subject: selectedFile ? "Patient Upload" : "Patient Message",
        message: newMessage.trim(),
        text: newMessage.trim(),
        originalLanguage:
          selectedPatient.language === "Spanish"
            ? "es"
            : selectedPatient.language === "English"
            ? "en"
            : "en",
        imageUrl: uploadedImageUrl,
        imageName: uploadedImageName,
        status: "Unread",
      };

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchMessages(selectedPatientId);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Could not send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#0576D6",
            textAlign: "center",
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          Patient Chat
        </h1>

        <div style={{ textAlign: "center", marginBottom: "30px", color: "#FFFFFF" }}>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>
            Demo Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(Number(e.target.value))}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #0576D6",
              fontSize: "16px",
            }}
          >
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "25px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
              border: "2px solid #0576D6",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#0576D6", marginTop: 0, marginBottom: "16px" }}>
              {selectedPatient.name}
            </h2>
            <p style={{ margin: "8px 0", color: "#333" }}>
              <strong>Surgery:</strong> {selectedPatient.surgeryType}
            </p>
            <p style={{ margin: "8px 0", color: "#333" }}>
              <strong>Status:</strong> {selectedPatient.status}
            </p>
            <p style={{ margin: "8px 0", color: "#333" }}>
              <strong>Surgeon:</strong> {selectedPatient.surgeon}
            </p>
            <p style={{ margin: "8px 0", color: "#333" }}>
              <strong>Language:</strong> {selectedPatient.language}
            </p>
          </div>
        )}

        <form
          onSubmit={sendMessage}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
            border: "2px solid #0576D6",
          }}
        >
          <h2
            style={{
              color: "#0576D6",
              marginTop: 0,
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            Send Message to Surgeon
          </h2>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows={5}
            style={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "15px",
              boxSizing: "border-box",
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          />

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                color: "#374151",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Attach image or file
            </label>

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setSelectedFile(file);
              }}
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "10px",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
              }}
            />

            {selectedFile && (
              <p style={{ margin: "8px 0 0 0", color: "#4b5563", fontSize: "13px" }}>
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              disabled={isSending}
              style={{
                backgroundColor: isSending ? "#7aaede" : "#0576D6",
                color: "#FFFFFF",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: isSending ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
            border: "2px solid #0576D6",
          }}
        >
          <h2
            style={{
              color: "#0576D6",
              marginTop: 0,
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            Conversation
          </h2>

          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  backgroundColor: msg.sender === "patient" ? "#d1fae5" : "#dbeafe",
                  border: `2px solid ${msg.sender === "patient" ? "#10b981" : "#0576D6"}`,
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "14px",
                }}
              >
                <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "#1f2937" }}>
                  {msg.from || msg.sender}
                </p>

                <p style={{ margin: "0 0 10px 0", color: "#374151", lineHeight: "1.5" }}>
                  {msg.sender === "surgeon"
                    ? (msg.translatedText || msg.message || msg.text)
                    : (msg.message || msg.text)}
                </p>

                {msg.sender === "surgeon" &&
                  msg.originalLanguage &&
                  msg.translatedText &&
                  msg.translatedText !== msg.message && (
                    <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#6b7280" }}>
                      Original: {msg.message}
                    </p>
                  )}

                {msg.imageUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <a href={msg.imageUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <img
                        src={msg.imageUrl}
                        alt={msg.imageName || "Upload"}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "240px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          objectFit: "cover",
                        }}
                      />
                    </a>
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                      {msg.imageName || "Attachment"}
                    </p>
                  </div>
                )}

                <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                  {msg.timestamp || ""}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientView;