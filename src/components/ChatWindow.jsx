import MessageList from "./MessageList";

export default function ChatWindow({ messages, loading, bottomRef, onReact, onReply }) {
  return (
    <div className="chat-body">
      <MessageList messages={messages} onReact={onReact} onReply={onReply} />
      {loading && <div className="typing">Agent is typing...</div>}
      <div ref={bottomRef}></div>
    </div>
  );
}
