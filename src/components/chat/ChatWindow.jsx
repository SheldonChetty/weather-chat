import { useEffect, useRef } from "react";

export default function ChatWindow({ chat, isTyping, error, searchQuery }) {
  const bottomRef = useRef(null);

  // Auto-scroll on new messages / typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, isTyping]);

  if (!chat) {
    return (
      <div className="chat-body">
        <div className="empty-chat">Start a conversation 🌤️</div>
      </div>
    );
  }

  // 🔍 FILTER MESSAGES BASED ON SEARCH QUERY
  const filteredMessages = searchQuery
    ? chat.messages.filter(msg =>
        msg.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : chat.messages;

  return (
    <div className="chat-body">
      {filteredMessages.map(msg => (
        <div key={msg.id} className={`message-row ${msg.role}`}>
          <div className={`message-bubble ${msg.role}`}>
            <div>{msg.content}</div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="message-row agent">
          <div className="message-bubble agent typing">
            Thinking…
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {/* 🔥 SCROLL TARGET */}
      <div ref={bottomRef} />
    </div>
  );
}
