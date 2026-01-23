import { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ErrorBanner from "./ErrorBanner";
import Dashboard from "./Dashboard";
import SearchPanel from "./SearchPanel";
import { useWeatherAgent } from "../hooks/useWeatherAgent";

export default function WeatherChat() {
  /* =========================
     STATE
  ========================= */

  const [dashboardOpen, setDashboardOpen] = useState(false);

  const [chats, setChats] = useState([
    {
      id: "chat_1",
      title: "New Chat",
      date: new Date().toDateString(),
      messages: []
    }
  ]);

  const [activeChatId, setActiveChatId] = useState("chat_1");
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const messages = activeChat.messages;

  const [viewMessages, setViewMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔑 SEPARATE STATES (already correct)
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState("light");
  const [replyTo, setReplyTo] = useState(null);

  const bottomRef = useRef(null);
  const { sendMessageToAgent } = useWeatherAgent();

// ---- localStorage keys ----
    const CHAT_STORAGE_KEY = "skychat_v2_chats";
    const ACTIVE_CHAT_KEY = "skychat_v2_active_chat";


  /* =========================
     EFFECTS
  ========================= */

  useEffect(() => {
    setViewMessages(messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [viewMessages, loading]);

  // ✅ Restore theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // ---- LOAD chats on app start ----
useEffect(() => {
  const savedChats = localStorage.getItem(CHAT_STORAGE_KEY);
  const savedActiveChat = localStorage.getItem(ACTIVE_CHAT_KEY);

  if (savedChats) {
    const parsedChats = JSON.parse(savedChats);
    setChats(parsedChats);

    if (savedActiveChat) {
      setActiveChatId(savedActiveChat);
    }
  }
}, []);

// ---- SAVE chats whenever they change ----
useEffect(() => {
  if (chats.length > 0) {
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(chats)
    );
  }
}, [chats]);

// ---- SAVE active chat id ----
useEffect(() => {
  localStorage.setItem(
    CHAT_STORAGE_KEY,
    JSON.stringify(chats)
  );
}, [chats]);



  /* =========================
     HELPERS
  ========================= */

  function updateMessages(newMessages, newTitle = null) {
  setChats(prevChats =>
    prevChats.map(chat =>
      chat.id === activeChatId
        ? {
            ...chat,
            title: newTitle ?? chat.title,
            messages: newMessages
          }
        : chat
    )
  );
}


  function createNewChat() {
    const newChat = {
      id: `chat_${Date.now()}`,
      title: "New Chat",
      date: new Date().toDateString(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setDashboardOpen(false);
  }

  function selectChat(id) {
    setActiveChatId(id);
    setDashboardOpen(false);
  }

  function deleteChat(id) {
    setChats(prev => {
      const updated = prev.filter(chat => chat.id !== id);
      if (id === activeChatId && updated.length) {
        setActiveChatId(updated[0].id);
      }
      return updated.length ? updated : prev;
    });
  }

  async function handleSendMessage(text) {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: replyTo ? `Replying to: "${replyTo}"\n\n${text}` : text,
      time: new Date()
    };

    const isFirstMessage = messages.length === 0;
    const chatTitle = isFirstMessage ? text.slice(0, 40) : null;

    updateMessages([...messages, userMessage], chatTitle);
    setReplyTo(null);
    setLoading(true);
    setError(null);

    try {
      const reply = await sendMessageToAgent(text);
      updateMessages(
        [...messages, userMessage, { role: "agent", text: reply, time: new Date() }],
        chatTitle
      );
    } catch {
      setError("Unable to connect to Weather Agent.");
      updateMessages(
        [...messages, userMessage, { role: "agent", text: "Error connecting to server.", time: new Date() }],
        chatTitle
      );
    } finally {
      setLoading(false);
    }
  }

  function exportChat() {
    const content = messages
      .map(m => `${m.role.toUpperCase()} [${m.time.toLocaleTimeString()}]: ${m.text}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "weather-chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ THEME FIX (already correct)
  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="app-shell">

      <Dashboard
        open={dashboardOpen}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onClose={() => setDashboardOpen(false)}
      />

      {dashboardOpen && (
        <div className="overlay" onClick={() => setDashboardOpen(false)} />
      )}

      <div className="chat-app">

        {/* HEADER */}
        <div className="chat-header-bar">

          <div className="header-left">
            <button className="menu-btn" onClick={() => setDashboardOpen(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="header-title-group">
              <span className="app-name">SkyCast</span>
              <span className="chat-status">Weather Agent Active</span>
            </div>
          </div>

          <div className="header-right">

            {/* Desktop Search (visual only) */}
            <div className="desktop-search">
              <input
                placeholder="Search chat..."
                readOnly
                // FIX: removed onFocus to prevent duplicate search panel
              />
            </div>

            {/* DESKTOP ICONS — UNCHANGED */}
            <div className="desktop-icons">

              <button className="icon-btn" onClick={() => setShowSearch(true)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button className="icon-btn" onClick={exportChat}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button className="icon-btn" onClick={toggleTheme}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>

            </div>

            {/* MOBILE MENU */}
            <div className="mobile-menu">
              <button
                className="icon-btn"
                onClick={() => setMobileMenuOpen(v => !v)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 5h.01M12 12h.01M12 19h.01" />
                </svg>
              </button>

              {mobileMenuOpen && (
                <div className="mobile-dropdown">
                  <button onClick={() => {
                    setShowSearch(true);
                    setMobileMenuOpen(false); // FIX
                  }}>
                    Search
                  </button>
                  <button onClick={() => {
                    exportChat();
                    setMobileMenuOpen(false);
                  }}>
                    Export
                  </button>
                  <button onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}>
                    Toggle Theme
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SEARCH PANEL */}
        {showSearch && (
          <SearchPanel
            messages={messages}
            onClose={() => {
              setShowSearch(false);
              setViewMessages(messages);
            }}
            onResult={setViewMessages}
          />
        )}

        {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

        <div className="chat-body-full">
          <ChatWindow
            messages={viewMessages}
            loading={loading}
            bottomRef={bottomRef}
            onReply={m => setReplyTo(m.text)}
          />
        </div>

        {replyTo && (
          <div className="reply-preview">
            Replying to: <b>{replyTo}</b>
            <button onClick={() => setReplyTo(null)}>✖</button>
          </div>
        )}

        <div className="chat-input-fixed">
          <ChatInput onSend={handleSendMessage} loading={loading} />
        </div>

      </div>
    </div>
  );
}
