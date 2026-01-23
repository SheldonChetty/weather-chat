export default function Dashboard({
  open,
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onClearAll,
  onClose
}) {
  return (
    <>
      <aside className={`dashboard ${open ? "open" : ""}`}>
        <div className="dashboard-header">
          <h3>Chats</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="dashboard-newchat">
          <button onClick={onCreateChat}>+ New Chat</button>
        </div>

        <div className="dashboard-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`dashboard-item ${
                chat.id === activeChatId ? "active" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <span>{chat.title}</span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <button className="clear-btn" onClick={onClearAll}>
          Clear All
        </button>
      </aside>

      {open && <div className="overlay" onClick={onClose} />}
    </>
  );
}
