export default function ErrorBanner({ message, onClose }) {
  return (
    <div
      style={{
        background: "#ffebee",
        color: "#c62828",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#c62828",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        ✖
      </button>
    </div>
  );
}
