import MessageBubble from "./MessageBubble";

export default function MessageList({ messages }) {
  return (
    <>
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </>
  );
}
