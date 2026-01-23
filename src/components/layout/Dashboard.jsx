import { useState } from "react";
import { Trash2, Edit3, Check, X } from "lucide-react";

export default function Dashboard({
  open,
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onRenameChat,
  onClearAll,
  onClose
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");

  function startRename(chat) {
    setEditingId(chat.id);
    setTitle(chat.title);
  }

  function saveRename(chatId) {
    onRenameChat(chatId, title.trim() || "New Chat");
    setEditingId(null);
  }

  return (
    <>
      {/* SIDEBAR */}
      <aside className={`dashboard ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="dashboard-header">
          <h3>Chats</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* New Chat */}
        <button className="new-chat-btn" onClick={onCreateChat}>
          + New Chat
        </button>

        {/* Chat List */}
        <div className="dashboard-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`dashboard-item ${
                chat.id === activeChatId ? "active" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              {/* Title */}
              <div className="chat-title-area">
                {editingId === chat.id ? (
                  <input
                    className="rename-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span className="chat-title">{chat.title}</span>
                )}
              </div>

              {/* Actions */}
              <div className="chat-actions">
                {editingId === chat.id ? (
                  <>
                    <button
                      className="icon-btn success"
                      title="Save"
                      onClick={e => {
                        e.stopPropagation();
                        saveRename(chat.id);
                      }}
                    >
                      <Check size={16} />
                    </button>

                    <button
                      className="icon-btn"
                      title="Cancel"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="icon-btn"
                      title="Rename"
                      onClick={e => {
                        e.stopPropagation();
                        startRename(chat);
                      }}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      className="icon-btn danger"
                      title="Delete"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Clear all */}
        {chats.length > 0 && (
          <button className="clear-btn bottom" onClick={onClearAll}>
            Clear all chats
          </button>
        )}
      </aside>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={onClose} />}
    </>
  );
}
