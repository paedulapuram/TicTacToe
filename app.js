"use strict";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const WIN_LABELS = {
  "0-1-2": "across the top row",
  "3-4-5": "across the middle row",
  "6-7-8": "across the bottom row",
  "0-3-6": "down the left column",
  "1-4-7": "down the middle column",
  "2-5-8": "down the right column",
  "0-4-8": "on the main diagonal",
  "2-4-6": "on the counter diagonal",
};

const CELL_NAMES = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];

const els = {
  board: document.querySelector("#board"),
  roundStatus: document.querySelector("#roundStatus"),
  turnLabel: document.querySelector("#turnLabel"),
  scoreX: document.querySelector("#scoreX"),
  scoreO: document.querySelector("#scoreO"),
  scoreDraws: document.querySelector("#scoreDraws"),
  moveList: document.querySelector("#moveList"),
  newRoundButton: document.querySelector("#newRoundButton"),
  clearScoresButton: document.querySelector("#clearScoresButton"),
};

const state = {
  board: Array(9).fill(""),
  currentPlayer: "X",
  winningLine: [],
  gameOver: false,
  scores: {
    X: 0,
    O: 0,
    draws: 0,
  },
  moves: [],
};

els.newRoundButton.addEventListener("click", () => resetRound());
els.clearScoresButton.addEventListener("click", () => {
  state.scores.X = 0;
  state.scores.O = 0;
  state.scores.draws = 0;
  resetRound("Scores cleared. X starts the round.");
});

function createBoard() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < state.board.length; index += 1) {
    const cell = document.createElement("button");
    cell.className = "board-cell";
    cell.type = "button";
    cell.dataset.index = String(index);
    cell.setAttribute("role", "gridcell");
    cell.addEventListener("click", () => playMove(index));
    fragment.append(cell);
  }

  els.board.replaceChildren(fragment);
}

function playMove(index) {
  if (state.gameOver) {
    updateStatus("Start a new round to keep playing.");
    return;
  }

  if (state.board[index]) {
    updateStatus(`${CELL_NAMES[index]} is already filled. ${state.currentPlayer}'s turn.`);
    return;
  }

  const player = state.currentPlayer;
  state.board[index] = player;
  state.moves.push({
    player,
    cell: CELL_NAMES[index],
  });

  const winningLine = getWinningLine();
  if (winningLine) {
    state.gameOver = true;
    state.winningLine = winningLine;
    state.scores[player] += 1;
    updateStatus(`${player} wins ${WIN_LABELS[winningLine.join("-")]}.`);
    render();
    return;
  }

  if (state.board.every(Boolean)) {
    state.gameOver = true;
    state.scores.draws += 1;
    updateStatus("The round is a draw.");
    render();
    return;
  }

  state.currentPlayer = player === "X" ? "O" : "X";
  updateStatus(`${state.currentPlayer}'s turn.`);
  render();
}

function getWinningLine() {
  return WIN_LINES.find((line) => {
    const [first, second, third] = line;
    return (
      state.board[first] &&
      state.board[first] === state.board[second] &&
      state.board[first] === state.board[third]
    );
  });
}

function resetRound(message = "X starts the round.") {
  state.board = Array(9).fill("");
  state.currentPlayer = "X";
  state.winningLine = [];
  state.gameOver = false;
  state.moves = [];
  updateStatus(message);
  render();
}

function updateStatus(message) {
  els.roundStatus.textContent = message;
}

function render() {
  renderBoard();
  renderScoreboard();
  renderMoveLog();
  els.turnLabel.textContent = state.gameOver ? "Done" : state.currentPlayer;
  els.turnLabel.dataset.player = state.currentPlayer;
}

function renderBoard() {
  const winningCells = new Set(state.winningLine);

  for (const cell of els.board.querySelectorAll(".board-cell")) {
    const index = Number(cell.dataset.index);
    const mark = state.board[index];
    cell.className = "board-cell";
    cell.disabled = state.gameOver;
    cell.dataset.mark = mark;
    cell.setAttribute("aria-label", `${CELL_NAMES[index]} ${mark || "empty"}`);

    if (mark) {
      cell.classList.add(`is-${mark.toLowerCase()}`);
    }

    if (winningCells.has(index)) {
      cell.classList.add("is-winning");
    }
  }
}

function renderScoreboard() {
  els.scoreX.textContent = String(state.scores.X);
  els.scoreO.textContent = String(state.scores.O);
  els.scoreDraws.textContent = String(state.scores.draws);
}

function renderMoveLog() {
  if (!state.moves.length) {
    const empty = document.createElement("li");
    empty.className = "empty-log";
    empty.textContent = "No moves";
    els.moveList.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const move of state.moves) {
    const item = document.createElement("li");
    item.textContent = `${move.player} ${move.cell}`;
    fragment.append(item);
  }
  els.moveList.replaceChildren(fragment);
}

createBoard();
resetRound();
