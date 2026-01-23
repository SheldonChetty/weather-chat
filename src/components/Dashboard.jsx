import { useEffect, useRef } from "react";

export default function Dashboard({
  open,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onClose,
  onDeleteChat
}) {
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (open && panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <aside className={`dashboard ${open ? "open" : ""}`} ref={panelRef}>

      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">S</div>
          <h3>SkyCast</h3>
        </div>

        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {/* New Chat */}
      <div className="dashboard-newchat">
        <button onClick={onNewChat}>
          ＋ New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="dashboard-list">
        {chats.length === 0 && (
          <div className="empty-state">No conversations yet</div>
        )}

        {chats.map(chat => (
          <div
            key={chat.id}
            className={`dashboard-item ${chat.id === activeChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="dashboard-item-content">
              <div className="chat-title">{chat.title}</div>
              <div className="chat-date">{chat.date}</div>
            </div>

            {/* Delete button */}
            <button
              className="delete-chat-btn"
              title="Delete chat"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

    </aside>
  );
}
