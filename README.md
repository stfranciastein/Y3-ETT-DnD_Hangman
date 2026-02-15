# 📖 Mordenkainen's Tome of Everything

A D&D-themed Hangman game built with React that uses the Dungeons & Dragons 5th Edition API.

## Overview

This web application is a unique twist on the classic Hangman game, featuring content from D&D 5e including spells, monsters, and equipment. Players can switch between categories and use hints to help guess the words.

## Features

- **Multiple Categories**: Choose between Spells, Monsters, and Items
- **Interactive Hangman**: Visual representation of wrong guesses
- **Hint System**: 
  - Show descriptive hints about the current word
  - Reveal random letters for assistance
- **Responsive Design**: Optimized for both mobile and desktop using Flexbox and Grid
- **D&D 5e API Integration**: Real-time data fetching from the official D&D API

## Technologies Used

- **React 19** - Frontend framework
- **Vite** - Build tool and dev server
- **D&D 5e API** - Game content source
- **CSS3** - Responsive styling with modern layouts

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How to Play

1. Select a category (Spells, Monsters, or Items)
2. Guess letters by clicking on the keyboard
3. Use hints if you get stuck:
   - **Show Hint**: Reveals information about the word
   - **Reveal Letter**: Adds a random letter to help you
4. Win by guessing all letters before making 6 wrong guesses
5. Click "New Word" to play again with a different word

## API Reference

This app uses the [D&D 5e API](https://www.dnd5eapi.co/) to fetch:
- `/api/2014/spells` - Magic spells
- `/api/2014/monsters` - Creatures and beasts
- `/api/2014/equipment` - Items and gear

## Project Structure

```
src/
├── App.jsx              # Main app component with API logic
├── App.css              # Global styles
├── main.jsx             # App entry point
└── components/
    ├── Navbar.jsx       # Category selector navigation
    ├── Navbar.css       # Navigation styles
    ├── GameBoard.jsx    # Hangman game logic and UI
    └── GameBoard.css    # Game board styles
```

## Responsive Design

The application is fully responsive with breakpoints at:
- **Desktop**: > 768px
- **Tablet**: 768px
- **Mobile**: < 480px

## License

This project is for educational purposes.
