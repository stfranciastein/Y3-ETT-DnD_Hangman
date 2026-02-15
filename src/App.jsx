import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GameBoard from './components/GameBoard';
import './App.css';

export default function App() {
  const [category, setCategory] = useState('spells');
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [joke, setJoke] = useState('');
  const [driverError, setDriverError] = useState(false);
  const [theme, setTheme] = useState('light');
  const [gameControls, setGameControls] = useState({
    onHintClick: () => {},
    onRevealLetter: () => {},
    hintDisabled: true,
    revealDisabled: true,
    hintTitle: 'Reveal Hint 1/3',
    maxRevealedHintLevel: 0,
    maxHints: 3
  });

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchCategoryData = async (selectedCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.dnd5eapi.co/api/2014/${selectedCategory}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      
      // Get random item from the list
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const selectedItem = data.results[randomIndex];
        
        // Fetch details for the selected item
        const detailResponse = await fetch(`https://www.dnd5eapi.co${selectedItem.url}`);
        if (!detailResponse.ok) throw new Error('Failed to fetch item details');
        const detailData = await detailResponse.json();
        
        setGameData({
          name: selectedItem.name,
          details: detailData
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch joke and show initial loading screen for 5 seconds
    const fetchJoke = async () => {
      try {
        const response = await fetch('https://icanhazdadjoke.com/', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        setJoke(data.joke);
      } catch (err) {
        setJoke('Why did the wizard stay in school? To improve their spell-ing! 🧙‍♂️');
      }
    };

    fetchJoke();
    
    const timer = setTimeout(() => {
      // 50% chance to show driver error
      if (Math.random() < 0.5) {
        setDriverError(true);
      } else {
        setInitialLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      fetchCategoryData(category);
    }
  }, [category, initialLoading]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleNewGame = () => {
    fetchCategoryData(category);
  };

  const handleRetry = () => {
    setDriverError(false);
    setInitialLoading(false);
  };

  if (driverError) {
    return (
      <div className="app">
        <div className="driver-error-screen">
          <div className="driver-error-content">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '80px', height: '80px', color: '#ff6b6b'}}>
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h1 className="error-title">Critical System Error</h1>
            <div className="error-box">
              <p className="error-code">ERROR CODE: 0xD20FAILED</p>
              <p className="error-message">
                Graphics drivers are out of date or corrupted.
                <br />
                <br />
                The arcane energies required to render the TOME cannot be channeled properly.
              </p>
              <div className="error-details">
                <p><strong>Required:</strong> Mystical Graphics Driver v20.24 or higher</p>
                <p><strong>Detected:</strong> Ancient Driver v1.0 (deprecated)</p>
                <p><strong>Component:</strong> SPELLBOOK_RENDERER.dll</p>
              </div>
            </div>
            <button className="retry-btn" onClick={handleRetry}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px', display: 'inline', verticalAlign: 'middle'}}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z" />
              </svg>
              Try Anyway (Not Recommended)
            </button>
            <p className="error-disclaimer">
              Please update your graphics drivers before continuing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="app">
        <div className="initial-loading">
          <div className="initial-loading-content">
            <h1 className="loading-title">TOME</h1>
            <div className="book-loader">
              <svg viewBox="0 0 100 120" className="book-svg">
                {/* Book outline */}
                <rect x="20" y="10" width="60" height="80" fill="none" stroke="#dc2626" strokeWidth="2" rx="2"/>
                {/* Book spine */}
                <line x1="35" y1="10" x2="35" y2="90" stroke="#dc2626" strokeWidth="2"/>
                {/* Pages */}
                <line x1="40" y1="25" x2="70" y2="25" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                <line x1="40" y1="35" x2="65" y2="35" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                <line x1="40" y1="45" x2="70" y2="45" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                <line x1="40" y1="55" x2="68" y2="55" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                <line x1="40" y1="65" x2="70" y2="65" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                <line x1="40" y1="75" x2="65" y2="75" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                
                {/* Filling effect */}
                <defs>
                  <linearGradient id="bookFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8">
                      <animate attributeName="offset" from="0" to="1" dur="5s" fill="freeze"/>
                    </stop>
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0">
                      <animate attributeName="offset" from="0" to="1" dur="5s" fill="freeze"/>
                    </stop>
                  </linearGradient>
                </defs>
                <rect x="20" y="10" width="60" height="80" fill="url(#bookFill)" rx="2"/>
              </svg>
            </div>
            <div className="joke-container">
              <p className="joke-text">{joke || 'Fetching a joke...'}</p>
            </div>
            <p className="loading-subtitle">Preparing your adventure...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar 
        currentCategory={category} 
        onCategoryChange={handleCategoryChange}
        gameControls={gameControls}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <main className="main-content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && gameData && (
          <GameBoard 
            gameData={gameData}
            category={category}
            onNewGame={handleNewGame}
            setGameControls={setGameControls}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
}
