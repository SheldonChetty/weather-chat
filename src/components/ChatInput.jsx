import { useState, useRef } from "react";
import micIcon from "../assets/mic.png";

export default function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const isTyping = message.trim().length > 0;

  function handleSend() {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
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
      setMessage(speechText);
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  return (
    <div className="chat-input-bar">
      <input
        type="text"
        placeholder="Ask about the weather..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        disabled={loading}
      />

      {isTyping ? (
        <button onClick={handleSend} disabled={loading} className="send-btn">
          ➤
        </button>
      ) : (
        <button onClick={startListening} disabled={loading} className="mic-btn">
          {!listening && (
            <img
              src={micIcon}
              alt="Mic"
              className="mic-icon"
            />
          )}

          {listening && (
            <div className="listening-bars-only">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
