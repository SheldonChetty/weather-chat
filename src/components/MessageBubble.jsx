import { formatTime } from "../utils/timeFormatter";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        textAlign: isUser ? "right" : "left",
        marginBottom: "10px"
      }}
    >
      <div>
        <b>{isUser ? "You" : "Agent"}:</b> {message.text}
      </div>
      <div style={{ fontSize: "12px", color: "#777" }}>
        {formatTime(message.time)}
      </div>
    </div>
  );
}
