import { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ErrorBanner from "./ErrorBanner";
import { useWeatherAgent } from "../hooks/useWeatherAgent";

export default function WeatherChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const { sendMessageToAgent } = useWeatherAgent();

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSendMessage(text) {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      text,
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null); // clear old error

    try {
      const agentReply = await sendMessageToAgent(text);

      const agentMessage = {
        role: "agent",
        text: agentReply,
        time: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch {
      setError("Unable to connect to Weather Agent. Please try again later.");

      setMessages(prev => [
        ...prev,
        {
          role: "agent",
          text: "Error connecting to server.",
          time: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError(null);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "10px" }}>
      <h2>Weather Agent</h2>

      {error && (
        <ErrorBanner
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <ChatWindow
        messages={messages}
        loading={loading}
        bottomRef={bottomRef}
      />

      <ChatInput onSend={handleSendMessage} loading={loading} />

      <button
        onClick={clearChat}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "8px",
          background: "#f44336",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Clear Chat
      </button>
    </div>
  );
}
