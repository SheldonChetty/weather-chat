export default function Header({
    onMenuClick,
    searchQuery,
    onSearchChange,
    theme,
    onToggleTheme
  }) {
    return (
      <div className="chat-header-bar">
        <div className="header-left">
          {/* ☰ MENU BUTTON */}
          <button
            className="menu-btn"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>
  
          <div className="header-title-group">
            <span className="app-name">SkyCast</span>
            <span className="chat-status">Weather Agent Active</span>
          </div>
        </div>
  
        <div className="header-right">
          <input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
  
          <button className="icon-btn" onClick={onToggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    );
  }
  