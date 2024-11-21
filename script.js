// script.js

const board = document.getElementById("board");
const redScoreDisplay = document.getElementById("red-score");
const blackScoreDisplay = document.getElementById("black-score");

let redScore = 0;
let blackScore = 0;
const boardSize = 8;
const cells = [];
let selectedPiece = null;
let currentPlayer = "red"; // Red goes first

// Initialize the board and pieces
function initBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Add pieces to the first 3 rows and last 3 rows
      if (row < 3 && (row + col) % 2 !== 0) {
        const piece = document.createElement("div");
        piece.classList.add("piece", "black-piece");
        cell.appendChild(piece);
      } else if (row >= 5 && (row + col) % 2 !== 0) {
        const piece = document.createElement("div");
        piece.classList.add("piece", "red-piece");
        cell.appendChild(piece);
      }

      cell.addEventListener("click", () => onCellClick(cell));
      board.appendChild(cell);
      cells.push(cell);
    }
  }
}

// Handle cell clicks for movement
function onCellClick(cell) {
  const piece = cell.querySelector(".piece");

  if (selectedPiece) {
    selectedPiece.classList.remove("selected"); // Remove highlight

    // Try to move to selected cell
    if (isValidMove(selectedPiece.parentNode, cell)) {
      movePiece(selectedPiece, cell);
      switchTurn();
    } else {
      console.log("Invalid move.");
    }
    selectedPiece = null;
  } else if (piece && piece.classList.contains(`${currentPlayer}-piece`)) {
    selectedPiece = piece;
    selectedPiece.classList.add("selected"); // Highlight selected piece
  }
}

// Check if move is valid
function isValidMove(fromCell, toCell) {
  const fromRow = parseInt(fromCell.dataset.row);
  const fromCol = parseInt(fromCell.dataset.col);
  const toRow = parseInt(toCell.dataset.row);
  const toCol = parseInt(toCell.dataset.col);

  if (toCell.querySelector(".piece")) return false; // Cannot move to an occupied cell

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Standard or king movement
  const isForwardMove =
    currentPlayer === "red" ? toRow < fromRow : toRow > fromRow;
  const isKing = selectedPiece.classList.contains("king");

  if (rowDiff === 1 && colDiff === 1) {
    return isKing || isForwardMove; // Kings can move backward, others cannot
  }

  // Capturing logic for kings and standard pieces
  if (rowDiff === 2 && colDiff === 2) {
    const capturedRow = (fromRow + toRow) / 2;
    const capturedCol = (fromCol + toCol) / 2;
    const capturedCell = cells.find(
      (c) => c.dataset.row == capturedRow && c.dataset.col == capturedCol
    );
    const capturedPiece = capturedCell.querySelector(".piece");

    if (
      capturedPiece &&
      capturedPiece.classList.contains(
        currentPlayer === "red" ? "black-piece" : "red-piece"
      )
    ) {
      // Remove captured piece
      capturedCell.removeChild(capturedPiece);
      updateScore();
      return isKing || isForwardMove; // Kings can move backward, others cannot
    }
  }

  return false;
}

// Move a piece
function movePiece(piece, toCell) {
  const fromCell = piece.parentNode;
  fromCell.removeChild(piece);
  toCell.appendChild(piece);

  // Check if the piece becomes a king
  checkForKing(piece, toCell);

  console.log(
    `Piece moved from ${fromCell.dataset.row},${fromCell.dataset.col} to ${toCell.dataset.row},${toCell.dataset.col}`
  );
}

// Promote a piece to king
function promoteToKing(piece) {
  if (!piece.classList.contains("king")) {
    piece.classList.add("king");
    piece.textContent = "K"; // Visual indicator for kings
    console.log(`${currentPlayer} piece became a King!`);
  }
}

// Check for king promotion
function checkForKing(piece, toCell) {
  const row = parseInt(toCell.dataset.row);

  if (currentPlayer === "red" && row === 0) {
    promoteToKing(piece);
  } else if (currentPlayer === "black" && row === boardSize - 1) {
    promoteToKing(piece);
  }
}

// Switch turns
function switchTurn() {
  currentPlayer = currentPlayer === "red" ? "black" : "red";
  console.log(`Turn switched. Current player: ${currentPlayer}`);

  checkGameEnd(); // Check if the game is over
}

// Update the scoreboard
function updateScore() {
  if (currentPlayer === "red") {
    redScore++;
    redScoreDisplay.textContent = redScore;
  } else {
    blackScore++;
    blackScoreDisplay.textContent = blackScore;
  }
}

// Check if the game has ended
function checkGameEnd() {
  const redPieces = document.querySelectorAll(".red-piece");
  const blackPieces = document.querySelectorAll(".black-piece");

  if (redPieces.length === 0) {
    alert("Black wins!");
    resetGame();
  } else if (blackPieces.length === 0) {
    alert("Red wins!");
    resetGame();
  }
}

// Reset the game
function resetGame() {
  board.innerHTML = ""; // Clear the board
  redScore = 0;
  blackScore = 0;
  redScoreDisplay.textContent = redScore;
  blackScoreDisplay.textContent = blackScore;
  selectedPiece = null;
  currentPlayer = "red"; // Red always starts
  initBoard(); // Reinitialize the board
}

// Start the game
initBoard();
