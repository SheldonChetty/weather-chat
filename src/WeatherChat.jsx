
import { useEffect, useState } from "react";

import AppShell from "./components/layout/AppShell";
import Header from "./components/layout/Header";
import Dashboard from "./components/layout/Dashboard";
import ChatWindow from "./components/chat/ChatWindow";
import ChatInput from "./components/input/ChatInput";



import useWeatherAgent from "./hooks/useWeatherAgent";

const CHAT_STORAGE_KEY = "skychat_v2_chats";
const ACTIVE_CHAT_KEY = "skychat_v2_active_chat";

export default function WeatherChat() {
  /* ────────────────
     GLOBAL STATE
     ──────────────── */
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [theme, setTheme] = useState("light");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  /* ────────────────
     WEATHER AGENT
     ──────────────── */
  const { askAgent, isTyping, error } = useWeatherAgent();

  /* ────────────────
     LOAD FROM STORAGE
     ──────────────── */
  useEffect(() => {
    const savedChats = localStorage.getItem(CHAT_STORAGE_KEY);
    const savedActiveChat = localStorage.getItem(ACTIVE_CHAT_KEY);

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);

      if (savedActiveChat) {
        const id = Number(savedActiveChat);
        const exists = parsedChats.some(c => c.id === id);
        if (exists) setActiveChatId(id);
      }
    }
  }, []);

  /* ────────────────
     SAVE TO STORAGE
     ──────────────── */
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(chats)
      );
    }
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(
        ACTIVE_CHAT_KEY,
        activeChatId
      );
    }
  }, [activeChatId]);

  /* ────────────────
     CREATE CHAT
     ──────────────── */
  function createChat() {
    const now = new Date().toISOString();

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
      createdAt: now,
      lastUpdated: now
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  /* ────────────────
     DELETE SINGLE CHAT
     ──────────────── */
  function deleteChat(chatId) {
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);

      if (chatId === activeChatId) {
        setActiveChatId(filtered.length ? filtered[0].id : null);
      }

      return filtered;
    });
  }

  function clearCurrentChat() {
  if (!activeChatId) return;

  setChats(prev =>
    prev.map(chat =>
      chat.id === activeChatId
        ? {
            ...chat,
            messages: [],
            lastUpdated: new Date().toISOString()
          }
        : chat
    )
  );
}




  /* ────────────────
   RENAME CHAT
   ──────────────── */
function renameChat(chatId, newTitle) {
  setChats(prev =>
    prev.map(chat =>
      chat.id === chatId
        ? { ...chat, title: newTitle }
        : chat
    )
  );
}
    function getQuickReply(text) {
  const msg = text.toLowerCase();

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (["hi", "hello", "hey"].some(w => msg.includes(w))) {
    return pick([
      "Hey 👋 How can I help you with the weather today?",
      "Hello 😊 Want to check today’s forecast?",
      "Hi there! ☀️ Ask me anything about the weather.",
      "Hey! 🌤️ Which city’s weather do you need?"
    ]);
  }

  if (msg.includes("how are you")) {
    return pick([
      "I'm doing great 😄 Ready to help with the weather!",
      "All good here 🌈 How can I assist you?",
      "Feeling sunny ☀️ What weather info do you need?"
    ]);
  }

  if (msg.includes("thanks") || msg.includes("thank you")) {
    return pick([
      "You're welcome 😊",
      "Anytime! ☀️",
      "Glad I could help 🌤️",
      "No problem at all!"
    ]);
  }

  if (msg.includes("bye")) {
    return pick([
      "Goodbye 👋 Have a great day!",
      "See you later 🌈",
      "Bye! Stay safe and dry ☔",
      "Take care 👋"
    ]);
  }

  return null;
}

/* export */

function exportCurrentChat() {
  if (!activeChatId) return;

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat || chat.messages.length === 0) return;

  const content = chat.messages
    .map(m => `${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleTimeString()}): ${m.content}`)
    .join("\n\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${chat.title || "chat"}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}



  /* CLEAR ALL CHATS */
  function clearAllChats() {
    setChats([]);
    setActiveChatId(null);
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_CHAT_KEY);
  }

  function toggleSearch() {
      setShowSearch(prev => !prev);
      if (showSearch) setSearchQuery("");
    }


//   Message Reactions
function reactToMessage(chatId, messageId, type) {
  setChats(prev =>
    prev.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === messageId
                ? {
                    ...msg,
                    reactions: {
                      ...msg.reactions,
                      [type]:
                        (msg.reactions?.[type] || 0) + 1
                    }
                  }
                : msg
            )
          }
        : chat
    )
  );
}


  /* ────────────────
     SEND MESSAGE
     ──────────────── */
     async function sendMessage(text) {
      let chatId = activeChatId;
    
      // 1️⃣ Create chat if none exists
      if (!chatId) {
        const now = new Date().toISOString();
        const newChat = {
          id: Date.now(),
          title: text.slice(0, 30),
          messages: [],
          createdAt: now,
          lastUpdated: now
        };
    
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        chatId = newChat.id;
      }
    
      const now = new Date().toISOString();
    
      // 2️⃣ User message
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: text,
        timestamp: now
      };
    
      // 3️⃣ Agent placeholder
      const agentMessageId = Date.now() + 1;
    
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  userMessage,
                  {
                    id: agentMessageId,
                    role: "agent",
                    content: "Thinking…",
                    timestamp: now
                  }
                ],
                lastUpdated: now
              }
            : chat
        )
      );
    
      const quickReply = getQuickReply(text);

      
      if (quickReply) {
        setChats(prev =>
          prev.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === agentMessageId
                      ? { ...msg, content: quickReply }
                      : msg
                  ),
                  lastUpdated: new Date().toISOString()
                }
              : chat
          )
        );
        return;
      }

      
      await askAgent(text, streamedText => {
        setChats(prev =>
          prev.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === agentMessageId
                      ? { ...msg, content: streamedText }
                      : msg
                  ),
                  lastUpdated: new Date().toISOString()
                }
              : chat
          )
        );
      });

    }
    
    

  /* ────────────────
     🔁 REGENERATE RESPONSE
     ──────────────── */
  async function regenerateResponse(chatId, userMessageId) {
    const now = new Date().toISOString();
    let baseMessages = [];

    // Trim messages up to selected user message
    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== chatId) return chat;

        const userIndex = chat.messages.findIndex(
          m => m.id === userMessageId
        );

        baseMessages = chat.messages.slice(0, userIndex + 1);

        return {
          ...chat,
          messages: baseMessages,
          lastUpdated: now
        };
      })
    );

    const agentMessageId = Date.now();

    // Insert empty agent message
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: agentMessageId,
                  role: "agent",
                  content: "",
                  timestamp: now
                }
              ]
            }
          : chat
      )
    );

    // Stream regenerated response
    await streamAgentResponse(baseMessages, text => {
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map(m =>
                  m.id === agentMessageId
                    ? { ...m, content: text }
                    : m
                )
              }
            : chat
        )
      );
    });
  }

  /* ────────────────
     RENDER
     ──────────────── */
     return (
  <>
     <Header
  onMenuClick={() => setDashboardOpen(true)}
  onDeleteChat={() => deleteChat(activeChatId)}
  onExportChat={exportCurrentChat}   // ✅ REQUIRED
  onSearch={setSearchQuery}
  theme={theme}
  onToggleTheme={() =>
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }
/>


    <Dashboard
      open={dashboardOpen}
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => {
        setActiveChatId(id);
        setDashboardOpen(false);
      }}
      onCreateChat={() => {
        createChat();
        setDashboardOpen(false);
      }}
      onDeleteChat={deleteChat}
      onRenameChat={renameChat}
      onClearAll={clearAllChats}
      onClose={() => setDashboardOpen(false)}
    />

    <ChatWindow
      chat={chats.find(c => c.id === activeChatId)}
      isTyping={isTyping}
      searchQuery={searchQuery}
      error={error}
      onRegenerate={regenerateResponse}
    />

    <ChatInput
      onSend={sendMessage}
      disabled={isTyping}
    />
  </>
);
}
 
 