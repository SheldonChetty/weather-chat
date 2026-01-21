import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-27599a8fa1462.mastra.cloud/api/agents/weatherAgent/stream",
        {
          method: "POST",
          headers: {
            "Accept": "*/*",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "x-mastra-dev-playground": "true"
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: userMessage
              }
            ],
            runId: "weatherAgent",
            maxRetries: 2,
            maxSteps: 5,
            temperature: 0.5,
            topP: 1,
            runtimeContext: {},
            threadId: "222017",
            resourceId: "weatherAgent"
          })
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let agentReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        agentReply += chunk;

        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "agent") {
            return [...prev.slice(0, -1), { role: "agent", text: agentReply }];
          } else {
            return [...prev, { role: "agent", text: agentReply }];
          }
        });
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: "agent", text: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: "400px",
      margin: "20px auto",
      padding: "10px"
    }}>
      <h2>Weather Agent</h2>

      <div style={{
        border: "1px solid #ccc",
        width: "100%",
        height: "60vh",
        padding: "10px",
        overflowY: "auto",
        marginBottom: "10px"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.role === "user" ? "right" : "left",
            marginBottom: "8px"
          }}>
            <b>{msg.role === "user" ? "You" : "Agent"}:</b> {msg.text}
          </div>
        ))}

        {loading && <p>Agent is typing...</p>}
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Ask about weather..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px"
          }}
        />

        <button
          onClick={sendMessage}
          style={{ padding: "10px 15px", fontSize: "16px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
