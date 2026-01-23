import { useState, useRef, useEffect } from "react";

export default function MessageActionsMenu({ onReact, onReply }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} style={{ position: "absolute", top: "6px", right: "6px" }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Message actions"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          padding: "4px"
        }}
      >
        ⌄
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "22px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 8px 20px rgba(0,0,0,.12)",
            minWidth: "140px",
            zIndex: 100
          }}
        >
          <MenuItem label="React" onClick={() => { setOpen(false); onReact(); }} />
          <MenuItem label="Reply" onClick={() => { setOpen(false); onReply(); }} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 14px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
      {label}
    </button>
  );
}
