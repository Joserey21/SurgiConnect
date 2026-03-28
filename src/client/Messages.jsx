function Messages({ messages = [], setMessages = () => {} }) {
  const markAsRead = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status: "Read" } : msg
      )
    );
  };

  const markAllAsRead = () => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.status === "Unread" ? { ...msg, status: "Read" } : msg
      )
    );
  };

  const deleteMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
  };

  const unreadCount = messages.filter((msg) => msg.status === "Unread").length;

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
          <p style={{ margin: "0 0 8px 0" }}>
            Total: {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
          <p style={{ margin: 0 }}>
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
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
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
              No messages
            </p>
          ) : (
            messages.map((message) => (
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
                      From: <strong>{message.patientName}</strong>
                    </p>
                  </div>
                  <p style={{ margin: 0, color: "#999", fontSize: "13px" }}>
                    {message.timestamp}
                  </p>
                </div>

                <p style={{ message: 0, color: "#555", lineHeight: "1.6", marginBottom: "15px" }}>
                  {message.message}
                </p>

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