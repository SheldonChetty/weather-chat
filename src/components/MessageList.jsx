import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, onReact, onReply }) {
  return (
    <>
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg}
          onReact={onReact}
          onReply={onReply}
        />
      ))}
    </>
  );
}
