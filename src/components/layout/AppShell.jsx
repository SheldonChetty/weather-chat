export default function AppShell({ header, sidebar, chat, input }) {
  return (
    <div className="app-shell">
      {header}

      <div className="app-main">
        {sidebar}

        <div className="chat-container">
          <div className="chat-content">
            {chat}
          </div>

          <div className="chat-input-container">
            {input}
          </div>
        </div>
      </div>
    </div>
  );
}
