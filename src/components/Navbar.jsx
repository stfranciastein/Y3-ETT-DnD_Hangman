import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ currentCategory, onCategoryChange, gameControls, theme, onThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = [
    { 
      id: 'spells', 
      label: 'Spells',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L15 8L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8L12 2Z" />
        </svg>
      )
    },
    { 
      id: 'monsters', 
      label: 'Monsters',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C10 2 8 3 8 5C8 7 9 8 9 10C9 11 8 12 7 12C6 12 5 11 5 10L3 12C3 14 4 15 5 16C4 17 3 18 3 20C3 21 4 22 6 22C8 22 9 21 10 20C11 21 12 22 14 22C15 22 16 21 17 20C18 21 19 22 21 22C23 22 24 21 24 20C24 18 23 17 22 16C23 15 24 14 24 12L22 10C22 11 21 12 20 12C19 12 18 11 18 10C18 8 19 7 19 5C19 3 17 2 15 2C14 2 13 3 12 4C11 3 10 2 9 2H12Z" />
        </svg>
      )
    },
    { 
      id: 'equipment', 
      label: 'Items',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6.5 2L3 5.5L8.5 11L6 13.5L8.5 16L11 13.5L16.5 19L20 15.5L14.5 10L17 7.5L14.5 5L12 7.5L6.5 2Z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <button 
            className="burger-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          
          <h1 className="navbar-title">
            TOME
          </h1>
          
          <div className="navbar-controls">
            <button 
              className="theme-toggle-btn"
              onClick={onThemeToggle}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
            <button 
              className="hint-icon-btn"
              onClick={gameControls?.onHintClick || (() => {})}
              disabled={gameControls?.hintDisabled !== false}
              title={gameControls?.hintTitle || 'Reveal Hint'}
            >
              <span className="hint-icon">?</span>
            </button>
            <button 
              className="reveal-icon-btn"
              onClick={gameControls?.onRevealLetter || (() => {})}
              disabled={gameControls?.revealDisabled !== false}
              title="Reveal a letter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="reveal-icon">
                <path d="M12 2L15 8L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8L12 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
          <div className="category-menu">
            <div className="menu-header">
              <button 
                className="close-menu-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
              <h2 className="menu-title">Categories</h2>
            </div>
            <div className="category-menu-items">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-menu-item ${currentCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    setMenuOpen(false);
                  }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
            <a 
              href="https://stfrancia.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="portfolio-link"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="portfolio-icon">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
              My Portfolio
            </a>
          </div>
        </>
      )}
    </>
  );
}