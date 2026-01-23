import { Search, Trash2, Download, X } from "lucide-react";
import { useState } from "react";

export default function Header({
  onMenuClick,
  onDeleteChat,
  onExportChat,     // ✅ ADD PROP
  theme,
  onToggleTheme,
  onSearch
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearchChange(e) {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }

  function closeSearch() {
    setQuery("");
    onSearch("");
    setSearchOpen(false);
  }

  return (
    <header className="chat-header-bar">
      {/* LEFT */}
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>☰</button>
        <h3 className="app-title">SkyCast</h3>
      </div>

      {/* CENTER */}
      <div className="header-actions">
        {searchOpen ? (
          <>
            <input
              className="header-search"
              placeholder="Search messages..."
              value={query}
              onChange={handleSearchChange}
              autoFocus
            />
            <button
              className="header-icon-btn"
              onClick={closeSearch}
              title="Close search"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            {/* SEARCH */}
            <button
              className="header-icon-btn"
              title="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            {/* EXPORT */}
            <button
              className="header-icon-btn"
              title="Export chat"
              onClick={onExportChat}
            >
              <Download size={18} />
            </button>

            {/* DELETE */}
            <button
              className="header-icon-btn danger"
              title="Delete current chat"
              onClick={onDeleteChat}
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <label className="theme">
          <input
            className="theme__toggle"
            type="checkbox"
            checked={theme === "dark"}
            onChange={onToggleTheme}
          />
          <span className="theme__icon"></span>
          <span className="theme__fill"></span>
        </label>
      </div>
    </header>
  );
}
