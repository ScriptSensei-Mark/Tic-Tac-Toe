let fields = Array(9).fill(null); // Verwende `Array(9).fill(null)`, um ein leeres Spielfeld zu erstellen
let currentPlayer = 'X'; // Startspieler 'X'
let winner = null;
let gameIsOver = false;
let winningCombo = null;

const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


// Initialisierungsfunktion
function init() {
    render();
};


// Rendert das Spielfeld
function render() {
    const board = document.getElementById('board');

    let boardHTML = '';
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const cellHTML = `<div class="cell" onclick="handleCellClick(${i})">${field === 'X' ? generateAnimatedCrossSVG() : (field === 'O' ? generateAnimatedCircleSVG() : '')}</div>`;
        boardHTML += cellHTML;
    }

    board.innerHTML = boardHTML;
};


// Rendert ein einzelnes Spielfeld
function renderCell(index) {
    const cell = document.getElementsByClassName('cell')[index];
    cell.innerHTML = (fields[index] === 'X' ? generateAnimatedCrossSVG() : generateAnimatedCircleSVG());
};


// Behandelt den Klick auf ein Spielfeld
function handleCellClick(index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        renderCell(index);
        isGameWon();
    }
};


// Überprüft, ob das Spiel gewonnen wurde
function isGameWon() {
    if (checkWinner(currentPlayer)) {
        drawWinningLine(winningCombo); // Verwende die gewinnende Kombination, um die Linie zu zeichnen
        setTimeout(function() {
            message = `Spieler ${currentPlayer} hat gewonnen!`;
            openPopUp(message)
            disableCells();
        }, 300);
        console.log('isGameWon completed');
    } else if (isGameDraw()) {
        setTimeout(function() {
            message = 'Spiel endet unentschieden!';
            openPopUp(message);
            disableCells();
        }, 300);
    } else {
        currentPlayer = (currentPlayer === 'X' ? 'O' : 'X');
    }
};


// Funktion zum Anzeigen des Popup-Fensters mit einer Nachricht
function openPopUp(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.style.display = 'flex';
};


// Funktion zum Schließen des Popup-Fensters
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
};


function disableCells() {
    // Deaktiviere alle anderen Felder
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        if (fields[i] === null) {
            cells[i].onclick = null;
        }
    }
};


function isGameDraw() {
    return !fields.includes(null) && !checkWinner('X') && !checkWinner('O');
};


// Beendet das Spiel
function restartGame() {
    gameIsOver = true; // Setze das Spiel auf beendet
    winner = null;
    winningCombo = null;
    currentPlayer = 'X';
    fields = Array(9).fill(null);
    render()
};


// Überprüft, ob ein Spieler gewonnen hat
function checkWinner(player) {
    for (const combo of WINNING_COMBOS) {
        const [a, b, c] = combo;
        if (fields[a] === player && fields[b] === player && fields[c] === player) {
            winningCombo = combo; // Setze die gewinnende Kombination
            winner = player;
            return true;
        }
    }
    return false;
};


function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.getElementsByClassName('cell')[combination[0]];
    const endCell = document.getElementsByClassName('cell')[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const contentRect = document.getElementById('board').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    ) + 160;
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth +5}px`;
    line.style.backgroundColor = lineColor;

    // Berechne die neue Position des Startpunkts der Linie
    const newStartX = startRect.left + (startRect.width / 2) - (160 / 2 * Math.cos(lineAngle));
    const newStartY = startRect.top + (startRect.height / 2) - (160 / 2 * Math.sin(lineAngle));

    line.style.top = `${newStartY - contentRect.top}px`;
    line.style.left = `${newStartX - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = 'top left';
    // Klasse zuweisen
    line.classList.add('winning-line');

    document.getElementById('board').appendChild(line);
};


// Funktion zur Generierung des SVG für den Kreis
function generateAnimatedCircleSVG() {
    const width = 100;
    const height = 100;
    const color = "#00b0ff";

    const svgCode = /*html*/ `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <circle cx="${width / 2}" cy="${height / 2}" r="40" fill="transparent" stroke="${color}" stroke-width="10">
                <animate attributeName="r" from="10" to="40" dur="0.3s" begin="0s" fill="freeze" />
            </circle>
        </svg>
    `;
    return svgCode;
};


// Funktion zur Generierung des SVG für das Kreuz
function generateAnimatedCrossSVG() {
    const width = 120;
    const height = 120;
    const color = "#ffc000";

    const svgCode = /*html*/ `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <line x1="${width / 2}" y1="10" x2="${width / 2}" y2="${height - 10}" stroke="${color}" stroke-width="10" stroke-dasharray="0 ${height - 20}" transform="rotate(45, ${width / 2}, ${height / 2})">
                <animate attributeName="stroke-dasharray" from="0 ${height - 20}" to="${width} ${height - 20}" dur="0.15s" begin="0s" fill="freeze" />
            </line>
            <line x1="10" y1="${height / 2}" x2="${width - 10}" y2="${height / 2}" stroke="${color}" stroke-width="10" stroke-dasharray="0 ${width - 20}" transform="rotate(45, ${width / 2}, ${height / 2})">
                <animate attributeName="stroke-dasharray" from="0 ${width - 20}" to="${width - 20} ${width}" dur="0.15s" begin="0.15s" fill="freeze" />
            </line>
        </svg>
    `;
    return svgCode;
};