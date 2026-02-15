import { useState, useEffect, useCallback } from 'react';
import './GameBoard.css';

export default function GameBoard({ gameData, category, onNewGame, setGameControls, theme }) {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [maxRevealedHintLevel, setMaxRevealedHintLevel] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [score, setScore] = useState(1000);
  const [_hintsUsed, setHintsUsed] = useState(0);
  const [_lettersRevealed, setLettersRevealed] = useState(0);
  const maxWrongGuesses = 6;
  const maxHints = 3;

  const word = gameData.name.toUpperCase();
  
  // Dynamic colors based on theme
  const iconColor = theme === 'light' ? '#333' : '#fff';

  const renderBooks = () => {
    return (
      <div className="books-display">
        {[1, 2, 3, 4, 5, 6].map((bookNum) => (
          <div key={bookNum} className="book-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
              {/* Open book */}
              <path d="M12 3C8.5 3 6 4.5 4 6.5V19C6 17 8.5 16 12 16C15.5 16 18 17 20 19V6.5C18 4.5 15.5 3 12 3Z" />
              <path d="M12 3V16" />
            </svg>
            {wrongGuesses >= bookNum && (
              <svg viewBox="0 0 24 24" className="x-mark" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            )}
          </div>
        ))}
      </div>
    );
  };
  
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
    setMaxRevealedHintLevel(0);
    setScore(1000);
    setHintsUsed(0);
    setLettersRevealed(0);
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

  const handleGuess = useCallback((letter) => {
    if (guessedLetters.includes(letter) || gameWon || gameLost) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
      setScore(prevScore => Math.max(0, prevScore - 50));
    }
  }, [guessedLetters, gameWon, gameLost, word, wrongGuesses]);

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
  }, [isDesktop, handleGuess]);

  const toggleHint = useCallback(() => {
    if (maxRevealedHintLevel < maxHints) {
      // Reveal next hint
      const nextLevel = maxRevealedHintLevel + 1;
      setMaxRevealedHintLevel(nextLevel);
      setHintLevel(nextLevel);
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      setScore(prevScore => Math.max(0, prevScore - 100));
    } else if (hintLevel < maxHints) {
      // All hints revealed, just advance to next one
      setHintLevel(hintLevel + 1);
      setShowHint(true);
    }
  }, [maxRevealedHintLevel, maxHints, hintLevel]);

  const handleRevealLetter = useCallback(() => {
    if (gameWon || gameLost) return;
    
    const wordLetters = word.split('').filter(char => /[A-Z]/.test(char));
    const unguessedLetters = wordLetters.filter(letter => !guessedLetters.includes(letter));
    
    if (unguessedLetters.length > 0) {
      const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      setGuessedLetters([...guessedLetters, randomLetter]);
      setLettersRevealed(prev => prev + 1);
      setScore(prevScore => Math.max(0, prevScore - 75));
    }
  }, [gameWon, gameLost, word, guessedLetters]);

  // Update game controls for navbar
  useEffect(() => {
    setGameControls({
      onHintClick: toggleHint,
      onRevealLetter: handleRevealLetter,
      hintDisabled: gameWon || gameLost || maxRevealedHintLevel >= maxHints,
      revealDisabled: gameWon || gameLost,
      hintTitle: maxRevealedHintLevel < maxHints ? `Reveal Hint ${maxRevealedHintLevel + 1}/${maxHints}` : `All hints revealed`,
      maxRevealedHintLevel,
      maxHints
    });
  }, [gameWon, gameLost, maxRevealedHintLevel, maxHints, guessedLetters, toggleHint, handleRevealLetter, setGameControls]);

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
    const words = [];
    let currentWord = [];
    
    wordData.forEach((item, index) => {
      if (item.type === 'space') {
        if (currentWord.length > 0) {
          words.push({ type: 'word', items: currentWord, key: `word-${words.length}` });
          currentWord = [];
        }
        words.push({ type: 'space', key: `space-${index}` });
      } else {
        currentWord.push(item);
      }
    });
    
    if (currentWord.length > 0) {
      words.push({ type: 'word', items: currentWord, key: `word-${words.length}` });
    }
    
    return words.map(word => {
      if (word.type === 'space') {
        return <div key={word.key} className="word-space"></div>;
      } else if (word.type === 'word') {
        return (
          <div key={word.key} className="word-group">
            {word.items.map(item => {
              if (item.type === 'dash' || item.type === 'apostrophe' || item.type === 'slash') {
                return <div key={item.key} className="word-punctuation">{item.char}</div>;
              } else if (item.type === 'letter') {
                return (
                  <div key={item.key} className="letter-box">
                    {item.char}
                  </div>
                );
              }
              return null;
            })}
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
    if (hintLevel < maxRevealedHintLevel) {
      setHintLevel(hintLevel + 1);
    }
  };

  const handlePreviousHint = () => {
    if (hintLevel > 1) {
      setHintLevel(hintLevel - 1);
    }
  };

  const handleNewGame = () => {
    onNewGame();
  };

  return (
    <div className="game-board">
      <div className="game-container">
        <div className="score-display">
          <div className="score-value">{score}</div>
          <div className="score-label">Score</div>
        </div>

        {renderBooks()}

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
              disabled={hintLevel >= maxRevealedHintLevel}
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
