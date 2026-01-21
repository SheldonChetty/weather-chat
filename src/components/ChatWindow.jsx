import MessageList from "./MessageList";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        height: "60vh",
        padding: "10px",
        overflowY: "auto",
        marginBottom: "10px"
      }}
    >
      <MessageList messages={messages} />
      {loading && <p>Agent is typing...</p>}
      <div ref={bottomRef}></div>
    </div>
  );
}
