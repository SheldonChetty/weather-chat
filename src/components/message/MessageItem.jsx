import { formatTime } from "../../utils/timeFormatter";

export default function MessageItem({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "agent"}`}>
      <div className={`message-bubble ${isUser ? "user-bubble" : "agent-bubble"}`}>
        <div>{message.content}</div>
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
