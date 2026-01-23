import { useState } from "react";

export default function SearchPanel({ messages, onClose, onResult }) {
  const [q, setQ] = useState("");

  function handleSearch() {
    const results = messages.filter(m =>
      m.text.toLowerCase().includes(q.toLowerCase())
    );
    onResult(results);
  }

  return (
    <div
      style={{
        padding: "10px",
        borderBottom: "1px solid #ddd",
        background: "#fff"
      }}
    >
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          placeholder="Search messages..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px 14px" }}>Search</button>
        <button onClick={onClose} style={{ padding: "10px 14px" }}>Close</button>
      </div>
    </div>
  );
}
