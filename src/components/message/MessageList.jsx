import MessageItem from "./MessageItem";

export default function MessageList({ messages }) {
  return (
    <>
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </>
  );
}
