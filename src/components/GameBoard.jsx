import { useState, useEffect } from 'react';
import './GameBoard.css';

export default function GameBoard({ gameData, category, onNewGame }) {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const maxWrongGuesses = 6;
  const maxHints = 3;

  const word = gameData.name.toUpperCase();
  
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  useEffect(() => {
    // Reset game state when new word is loaded
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameWon(false);
    setGameLost(false);
    setShowHint(false);
    setHintLevel(0);
  }, [gameData]);

  useEffect(() => {
    // Check win condition
    const wordLetters = word.split('').filter(char => /[A-Z]/.test(char));
    const allGuessed = wordLetters.every(letter => guessedLetters.includes(letter));
    
    if (allGuessed && wordLetters.length > 0 && guessedLetters.length > 0) {
      setGameWon(true);
    }
  }, [guessedLetters, word]);

  useEffect(() => {
    // Check lose condition
    if (wrongGuesses >= maxWrongGuesses) {
      setGameLost(true);
    }
  }, [wrongGuesses]);

  useEffect(() => {
    // Handle window resize to detect desktop/mobile
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Add keyboard support for desktop only
    if (!isDesktop) return;

    const handleKeyPress = (event) => {
      // Only accept A-Z keys
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDesktop, guessedLetters, gameWon, gameLost, word]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameWon || gameLost) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const handleRevealLetter = () => {
    if (gameWon || gameLost) return;
    
    const wordLetters = word.split('').filter(char => /[A-Z]/.test(char));
    const unguessedLetters = wordLetters.filter(letter => !guessedLetters.includes(letter));
    
    if (unguessedLetters.length > 0) {
      const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      setGuessedLetters([...guessedLetters, randomLetter]);
    }
  };

  const displayWord = () => {
    return word.split('').map((char, index) => {
      if (char === ' ') return { type: 'space', char: ' ', key: `space-${index}` };
      if (char === '-') return { type: 'dash', char: '-', key: `dash-${index}` };
      if (char === "'") return { type: 'apostrophe', char: "'", key: `apos-${index}` };
      if (char === '/') return { type: 'slash', char: '/', key: `slash-${index}` };
      if (!/[A-Z]/.test(char)) return { type: 'other', char: char, key: `other-${index}` };
      
      const isRevealed = guessedLetters.includes(char) || gameLost;
      return { type: 'letter', char: isRevealed ? char : '', revealed: isRevealed, key: `letter-${index}` };
    });
  };

  const renderWordBoxes = () => {
    const wordData = displayWord();
    return wordData.map(item => {
      if (item.type === 'space') {
        return <div key={item.key} className="word-space"></div>;
      } else if (item.type === 'dash' || item.type === 'apostrophe' || item.type === 'slash') {
        return <div key={item.key} className="word-punctuation">{item.char}</div>;
      } else if (item.type === 'letter') {
        return (
          <div key={item.key} className="letter-box">
            {item.char}
          </div>
        );
      }
      return null;
    });
  };

  const getHintText = () => {
    if (category === 'spells') {
      if (hintLevel === 1 && gameData.details.level !== undefined) {
        const level = gameData.details.level === 0 ? 'Cantrip' : gameData.details.level;
        return `Spell Level: ${level}`;
      } else if (hintLevel === 2 && gameData.details.school) {
        return `Spell School: ${gameData.details.school.name}`;
      } else if (hintLevel === 3 && gameData.details.desc) {
        return gameData.details.desc[0];
      }
    } else if (category === 'monsters') {
      if (hintLevel === 1 && gameData.details.type) {
        return `Type: ${gameData.details.type}`;
      } else if (hintLevel === 2 && gameData.details.size) {
        return `Size: ${gameData.details.size}`;
      } else if (hintLevel === 3 && gameData.details.challenge_rating !== undefined) {
        return `Challenge Rating: ${gameData.details.challenge_rating}`;
      }
    } else if (category === 'equipment') {
      if (hintLevel === 1 && gameData.details.equipment_category) {
        return `Category: ${gameData.details.equipment_category.name}`;
      } else if (hintLevel === 2 && gameData.details.cost) {
        return `Cost: ${gameData.details.cost.quantity} ${gameData.details.cost.unit}`;
      } else if (hintLevel === 3 && gameData.details.weight) {
        return `Weight: ${gameData.details.weight} lbs`;
      }
    }
    return 'No more hints available';
  };

  const handleNextHint = () => {
    if (hintLevel < maxHints) {
      setHintLevel(hintLevel + 1);
      setShowHint(true);
    }
  };

  const handlePreviousHint = () => {
    if (hintLevel > 1) {
      setHintLevel(hintLevel - 1);
    }
  };

  const toggleHint = () => {
    if (showHint) {
      setShowHint(false);
    } else {
      if (hintLevel === 0) {
        handleNextHint();
      } else {
        setShowHint(true);
      }
    }
  };

  const handleNewGame = () => {
    onNewGame();
  };

  return (
    <div className="game-board">
      <div className="game-container">
        <div className="top-controls">
          <button 
            className="hint-icon-btn"
            onClick={toggleHint}
            disabled={gameWon || gameLost}
            title={`Hint ${hintLevel}/${maxHints}`}
          >
            <span className="hint-icon">?</span>
          </button>
          <button 
            className="reveal-icon-btn"
            onClick={handleRevealLetter}
            disabled={gameWon || gameLost}
            title="Reveal a letter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="reveal-icon">
              <path d="M12 2L15 8L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8L12 2Z" />
            </svg>
          </button>
        </div>

        <div className="hangman-display">
          <svg viewBox="0 0 200 250" className="hangman-svg">
            {/* Gallows */}
            <line x1="10" y1="230" x2="150" y2="230" stroke="#8b4513" strokeWidth="4" />
            <line x1="50" y1="230" x2="50" y2="20" stroke="#8b4513" strokeWidth="4" />
            <line x1="50" y1="20" x2="130" y2="20" stroke="#8b4513" strokeWidth="4" />
            <line x1="130" y1="20" x2="130" y2="50" stroke="#8b4513" strokeWidth="4" />
            
            {/* Head */}
            {wrongGuesses >= 1 && <circle cx="130" cy="70" r="20" stroke="#fff" strokeWidth="3" fill="none" />}
            
            {/* Body */}
            {wrongGuesses >= 2 && <line x1="130" y1="90" x2="130" y2="150" stroke="#fff" strokeWidth="3" />}
            
            {/* Left arm */}
            {wrongGuesses >= 3 && <line x1="130" y1="110" x2="100" y2="130" stroke="#fff" strokeWidth="3" />}
            
            {/* Right arm */}
            {wrongGuesses >= 4 && <line x1="130" y1="110" x2="160" y2="130" stroke="#fff" strokeWidth="3" />}
            
            {/* Left leg */}
            {wrongGuesses >= 5 && <line x1="130" y1="150" x2="110" y2="190" stroke="#fff" strokeWidth="3" />}
            
            {/* Right leg */}
            {wrongGuesses >= 6 && <line x1="130" y1="150" x2="150" y2="190" stroke="#fff" strokeWidth="3" />}
          </svg>
        </div>

        <div className="word-display">
          {renderWordBoxes()}
        </div>

        {showHint && hintLevel > 0 && (
          <div className="hint-display">
            <button 
              className="hint-nav-btn"
              onClick={handlePreviousHint}
              disabled={hintLevel <= 1}
            >
              ‹
            </button>
            <div className="hint-content">
              <span className="hint-label">Hint {hintLevel}/{maxHints}:</span>
              <p className="hint-text">{getHintText()}</p>
            </div>
            <button 
              className="hint-nav-btn"
              onClick={handleNextHint}
              disabled={hintLevel >= maxHints}
            >
              ›
            </button>
          </div>
        )}

        {(gameWon || gameLost) && (
          <div className={`game-result ${gameWon ? 'won' : 'lost'}`}>
            {gameWon ? (
              <span>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px', display: 'inline', verticalAlign: 'middle', marginRight: '8px'}}>
                  <path d="M12 2L15 8L21 9L16 14L18 21L12 17L6 21L8 14L3 9L9 8L12 2Z" />
                </svg>
                Victory! You guessed it!
              </span>
            ) : (
              <span>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px', display: 'inline', verticalAlign: 'middle', marginRight: '8px'}}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
                Game Over! The answer was: {word}
              </span>
            )}
          </div>
        )}

        <div className="keyboard">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map(key => (
                <button
                  key={key}
                  className={`key ${guessedLetters.includes(key) ? (word.includes(key) ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleGuess(key)}
                  disabled={guessedLetters.includes(key) || gameWon || gameLost}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>

        <button className="new-game-btn" onClick={handleNewGame}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px'}}>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z" />
          </svg>
          New Word
        </button>
      </div>
    </div>
  );
}
