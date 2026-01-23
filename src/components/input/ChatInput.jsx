import { useState, useRef } from "react";
import micIcon from "../../assets/mic.png"; // ✅ adjust path if needed

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const isTyping = text.trim().length > 0;

  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
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

        {/* 🔁 SWITCH BUTTON */}
        {isTyping ? (
          <button onClick={send} disabled={disabled} className="send-btn">
            ➤
          </button>
        ) : (
          <button
            onClick={startListening}
            disabled={disabled}
            className="mic-btn"
          >
            {!listening ? (
              <img
                src={micIcon}
                alt="Mic"
                className="mic-icon"
              />
            ) : (
              <div className="listening-bars">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
