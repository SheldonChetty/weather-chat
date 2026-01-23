import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="chat-input-fixed">
      <div className="chat-input-bar">
        <input
          placeholder="Ask about the weather..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          disabled={disabled}
        />
        <button onClick={send} disabled={disabled}>
          ➤
        </button>
      </div>
    </div>
  );
}
