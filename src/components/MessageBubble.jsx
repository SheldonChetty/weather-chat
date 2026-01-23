import { formatTime } from "../utils/timeFormatter";
import MessageActionsMenu from "./MessageActionsMenu";

export default function MessageBubble({ message, onReact, onReply }) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "agent"}`}>
      <div
        className={`message-bubble ${isUser ? "user-bubble" : "agent-bubble"}`}
        style={{
          position: "relative",
          paddingRight: "36px" // space for the arrow on the right
        }}
      >
        {/* Text */}
        <div style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>

        {/* Time */}
        <div className="message-time">{formatTime(message.time)}</div>

        {/* Down arrow for BOTH desktop & mobile (only on agent messages) */}
        {!isUser && (
          <MessageActionsMenu
            onReact={() => onReact(message)}
            onReply={() => onReply(message)}
          />
        )}
      </div>
    </div>
  );
}
