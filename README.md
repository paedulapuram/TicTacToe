# Tic-Tac-Toe

A simple browser Tic-Tac-Toe game played on a 3 by 3 grid.

## Features

- Alternating X and O turns, with X starting each round.
- Prevents moves in occupied squares.
- Detects horizontal, vertical, and diagonal wins.
- Detects draws when all 9 squares are filled.
- Tracks X wins, O wins, and draws.
- Includes reset controls and browser flow tests.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000/TicTacToe/`.

## Test

```bash
npm run test:e2e
```

## Project Layout

- `index.html` contains the app markup.
- `styles.css` contains the responsive game UI.
- `app.js` contains the Tic-Tac-Toe game logic.
- `assets/` contains X and O mark SVGs.
- `tests/` contains Playwright browser flow tests.
