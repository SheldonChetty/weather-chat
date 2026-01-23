import { useState, useRef, useEffect } from "react";

export default function TopMenu({ onSearchToggle, onExport, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Menu"
        style={{
          background: "transparent",
          border: "none",
          fontSize: "22px",
          cursor: "pointer"
        }}
      >
        ⋮
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "36px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 8px 20px rgba(0,0,0,.12)",
            overflow: "hidden",
            minWidth: "180px",
            zIndex: 100
          }}
        >
          <MenuItem
            label="Search Messages"
            onClick={() => {
              setOpen(false);
              onSearchToggle();
            }}
          />

          <MenuItem
            label="Export Chat"
            onClick={() => {
              setOpen(false);
              onExport();
            }}
          />

          <MenuItem
            label="Toggle Theme"
            onClick={() => {
              setOpen(false);
              onToggleTheme();
            }}
          />
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
