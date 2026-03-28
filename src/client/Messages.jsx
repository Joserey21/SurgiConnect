import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Messages({ messages = [], setMessages = () => {} }) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentView, setCurrentView] = useState("surgeon");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const imageInputRef = useRef(null);
  const [composer, setComposer] = useState({
    patientId: "1",
    patientName: "Maria Lopez",
    sender: "surgeon",
    subject: "",
    body: "",
  });

  const isSurgeonView = currentView === "surgeon";

  const visibleMessages = useMemo(
    () =>
      localMessages.filter((msg) => {
        if (isSurgeonView) {
          return msg.to === "Surgeon" || msg.sender === "patient";
        }

        return msg.to !== "Surgeon" || msg.sender === "surgeon";
      }),
    [localMessages, isSurgeonView]
  );

  const unreadCount = useMemo(
    () => visibleMessages.filter((msg) => msg.status === "Unread").length,
    [visibleMessages]
  );

  const syncMessages = (updater) => {
    setLocalMessages((prevMessages) => {
      const nextMessages = typeof updater === "function" ? updater(prevMessages) : updater;
      setMessages(nextMessages);
      return nextMessages;
    });
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      syncMessages(data);
    } catch (error) {
      console.error("Unable to load messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length && localMessages.length === 0) {
      setLocalMessages(messages);
    }
  }, [messages, localMessages.length]);

  useEffect(() => {
    setComposer((prev) => ({
      ...prev,
      sender: isSurgeonView ? "surgeon" : "patient",
    }));
  }, [isSurgeonView]);

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`Failed to mark message as read: ${response.status}`);
      }

      syncMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "Read" } : msg
        )
      );
    } catch (error) {
      console.error("Unable to mark message as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/read-all`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all messages as read: ${response.status}`);
      }

      syncMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.status === "Unread" ? { ...msg, status: "Read" } : msg
        )
      );
    } catch (error) {
      console.error("Unable to mark all messages as read", error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to delete message: ${response.status}`);
      }

      syncMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      console.error("Unable to delete message", error);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!composer.body.trim() || !composer.subject.trim()) {
      return;
    }

    try {
      setIsSending(true);
      let uploadedImageUrl = "";
      let uploadedImageName = "";

      if (!isSurgeonView && selectedImageFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", selectedImageFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload image: ${uploadResponse.status}`);
        }

        const uploadResult = await uploadResponse.json();
        uploadedImageName = uploadResult.file || selectedImageFile.name;
        uploadedImageUrl = `${API_BASE_URL}/uploads/${uploadResult.file}`;
      }

      const payload = {
        patientId: Number(composer.patientId),
        patientName: composer.patientName.trim() || "Unknown Patient",
        sender: composer.sender,
        from: composer.sender === "surgeon" ? "Surgeon" : composer.patientName.trim(),
        to: composer.sender === "surgeon" ? composer.patientName.trim() : "Surgeon",
        subject: composer.subject.trim(),
        message: composer.body.trim(),
        imageUrl: uploadedImageUrl,
        imageName: uploadedImageName,
        status: "Unread",
      };

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const createdMessage = await response.json();
      syncMessages((prevMessages) => [createdMessage, ...prevMessages]);
      setComposer((prev) => ({ ...prev, subject: "", body: "" }));
      setSelectedImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Unable to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "#1a1a1a", padding: "30px 20px", textAlign: "center" }}>
        <h1
          style={{
            color: "#0576D6",
            margin: 0,
            marginBottom: "20px",
            fontSize: "48px",
          }}
        >
          Messages
        </h1>
        <div style={{ color: "#FFFFFF" }}>
          <div style={{ marginBottom: "12px" }}>
            <button
              onClick={() => setCurrentView((prev) => (prev === "surgeon" ? "client" : "surgeon"))}
              style={{
                backgroundColor: "#0576D6",
                color: "#FFFFFF",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {isSurgeonView ? "Switch to Client View" : "Switch to Surgeon View"}
            </button>
          </div>
          <p style={{ margin: "0 0 8px 0" }}>
            Viewing: {isSurgeonView ? "Surgeon" : "Client"}
          </p>
          <p style={{ margin: "0 0 8px 0" }}>
            Total: {visibleMessages.length} message{visibleMessages.length !== 1 ? "s" : ""}
          </p>
          <p style={{ margin: 0 }}>
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <form
          onSubmit={sendMessage}
          style={{
            maxWidth: "900px",
            margin: "0 auto 20px auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2 style={{ color: "#0576D6", margin: "0 0 16px 0", fontSize: "22px" }}>Write Message</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <input
              type="number"
              min="1"
              value={composer.patientId}
              onChange={(e) => setComposer((prev) => ({ ...prev, patientId: e.target.value }))}
              placeholder="Patient ID"
              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px" }}
            />
            <input
              type="text"
              value={composer.patientName}
              onChange={(e) => setComposer((prev) => ({ ...prev, patientName: e.target.value }))}
              placeholder="Patient Name"
              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px" }}
            />
            <input
              type="text"
              readOnly
              value={isSurgeonView ? "Surgeon to Patient" : "Patient to Surgeon"}
              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px" }}
            />
          </div>

          <input
            type="text"
            value={composer.subject}
            onChange={(e) => setComposer((prev) => ({ ...prev, subject: e.target.value }))}
            placeholder="Subject"
            style={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />
          <textarea
            value={composer.body}
            onChange={(e) => setComposer((prev) => ({ ...prev, body: e.target.value }))}
            placeholder="Type your message..."
            rows={4}
            style={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "12px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", color: "#374151", fontWeight: "bold", marginBottom: "6px" }}>
              {isSurgeonView ? "Client images are received in messages" : "Attach patient image"}
            </label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              disabled={isSurgeonView}
              onChange={(e) => {
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setSelectedImageFile(file);
              }}
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "10px",
                boxSizing: "border-box",
                backgroundColor: isSurgeonView ? "#f3f4f6" : "#ffffff",
              }}
            />
            {!isSurgeonView && selectedImageFile && (
              <p style={{ margin: "8px 0 0 0", color: "#4b5563", fontSize: "13px" }}>
                Selected: {selectedImageFile.name}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSending}
            style={{
              backgroundColor: isSending ? "#7aaede" : "#0576D6",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: isSending ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                backgroundColor: "#0576D6",
                color: "#FFFFFF",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Read All
            </button>
          )}
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
              Loading messages...
            </p>
          ) : visibleMessages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
              No messages in this view
            </p>
          ) : (
            visibleMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `2px solid ${message.status === "Unread" ? "#0576D6" : "#ccc"}`,
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h2 style={{ color: "#0576D6", margin: 0, fontSize: "18px" }}>
                        {message.subject}
                      </h2>
                      {message.status === "Unread" && (
                        <span
                          style={{
                            backgroundColor: "#0576D6",
                            color: "#FFFFFF",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>
                      From: <strong>{message.from || message.patientName || "Unknown"}</strong>
                      {" "}
                      To: <strong>{message.to || (message.sender === "surgeon" ? message.patientName : "Surgeon")}</strong>
                    </p>
                  </div>
                  <p style={{ margin: 0, color: "#999", fontSize: "13px" }}>
                    {message.timestamp}
                  </p>
                </div>

                <p style={{ margin: 0, color: "#555", lineHeight: "1.6", marginBottom: "15px" }}>
                  {message.message}
                </p>

                {message.imageUrl && (
                  <div style={{ marginBottom: "15px" }}>
                    <p style={{ margin: "0 0 8px 0", color: "#0576D6", fontWeight: "bold", fontSize: "13px" }}>
                      Patient Image
                    </p>
                    <a
                      href={message.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        src={message.imageUrl}
                        alt={message.imageName || "Patient upload"}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "260px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          objectFit: "cover",
                        }}
                      />
                    </a>
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  {message.status === "Unread" && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      style={{
                        backgroundColor: "#0576D6",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    style={{
                      backgroundColor: "#0576D6",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;