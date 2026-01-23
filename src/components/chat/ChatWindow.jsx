import MessageList from "../message/MessageList";

export default function ChatWindow({
  chat,
  isTyping,
  searchQuery,
  error,
  onRegenerate
}) {
  if (!chat) {
    return (
      <div className="chat-body-full">
        <div style={{ textAlign: "center", marginTop: 40, opacity: 0.6 }}>
          Start a new chat to ask about the weather 🌤️
        </div>
      </div>
    );
  }

  const messages = chat.messages.filter(m =>
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-body-full">
      {error && <div className="error">{error}</div>}
      <MessageList messages={messages} />
      {isTyping && <div className="typing">Agent is typing...</div>}
    </div>
  );
}
