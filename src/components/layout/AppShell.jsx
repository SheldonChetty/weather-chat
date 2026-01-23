export default function AppShell({ header, sidebar, chat, input }) {
  return (
    <div className="app-shell">
      {/* Sidebar */}
      {sidebar}

      {/* Main chat area */}
      <div className="chat-app">
        {header}
        {chat}
        {input}
      </div>
    </div>
  );
}
