import MessageItem from "./MessageItem";

export default function MessageList({ messages }) {
  if (!messages || messages.length === 0) return null;

  return (
    <>
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </>
  );
}
