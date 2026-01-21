import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  }

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      <input
        type="text"
        placeholder="Ask about weather..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        disabled={loading}
        style={{ flex: 1, padding: "10px", fontSize: "16px" }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          padding: "10px 15px",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
