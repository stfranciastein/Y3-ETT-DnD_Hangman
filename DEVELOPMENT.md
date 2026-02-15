# Development Guide - Mordenkainen's Tome of Everything

## Project Overview
A D&D-themed Hangman game using React and the D&D 5e API.

## Key Features Implemented

### 1. Category Selection
- **Spells**: Magic spells from D&D 5e
- **Monsters**: Creatures and beasts
- **Equipment**: Weapons, armor, and items

### 2. Game Mechanics
- Traditional Hangman gameplay
- 6 wrong guesses allowed
- Visual hangman drawing using SVG
- Win/lose detection
- Letter guessing with on-screen keyboard

### 3. Hint System
- **Show Hint**: Displays contextual information
  - Spells: Shows spell description
  - Monsters: Shows type, size, and challenge rating
  - Equipment: Shows equipment category
- **Reveal Letter**: Randomly reveals an unguessed letter

### 4. Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly buttons
- Flexible layouts using Flexbox and Grid

## Component Structure

### App.jsx
- Main application component
- Handles API calls to D&D 5e API
- Manages category state
- Fetches random items from selected category

### Navbar.jsx
- Category selector buttons
- Visual feedback for active category
- Responsive button layout

### GameBoard.jsx
- Core game logic
- Letter guessing mechanism
- Win/lose conditions
- Hint system implementation
- SVG hangman visualization
- On-screen keyboard

## API Integration

### Endpoints Used
```javascript
// Get list of items in category
GET https://www.dnd5eapi.co/api/2014/{category}

// Get details for specific item
GET https://www.dnd5eapi.co{item.url}
```

### Categories Available
- `spells`
- `monsters`
- `equipment`

## Styling Approach

### Color Scheme
- Primary: Purple gradient (#8a2be2, #9b59b6)
- Background: Dark purple gradient
- Success: Green (#2ed573)
- Error: Red (#ff6b6b)

### Typography
- Main font: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Word display: Courier New (monospace)

### Effects
- Backdrop blur for glassmorphism
- Hover animations and transforms
- Smooth transitions (0.3s ease)
- Box shadows for depth

## Future Enhancements

### Potential Features
1. **Difficulty Levels**: Easy (more hints), Medium, Hard (fewer hints)
2. **Score System**: Track wins/losses, time to complete
3. **Leaderboard**: Save high scores locally
4. **Sound Effects**: Add audio feedback
5. **More Categories**: Add classes, races, backgrounds
6. **Multiplayer**: Two-player mode
7. **Daily Challenge**: One word per day per category
8. **Achievements**: Unlock badges for milestones

### Technical Improvements
1. Add loading skeletons
2. Implement error boundaries
3. Add unit tests with Vitest
4. Optimize API calls with caching
5. Add PWA support for offline play
6. Implement dark/light theme toggle

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Testing Locally

1. Start the dev server: `npm run dev`
2. Open http://localhost:5173 (or the port shown)
3. Test each category
4. Test hint system
5. Test win/lose conditions
6. Test responsive design (Chrome DevTools)

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

### GitHub Pages
```bash
# Update vite.config.js base path
npm run build
# Deploy 'dist' folder
```

## Known Limitations

1. Some D&D names are very long (may overflow on small screens)
2. API rate limiting not implemented (may be needed for production)
3. No offline mode
4. No user accounts or persistent state

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## License
Educational project for coursework.
