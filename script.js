let fields = Array(9).fill(null); // Verwende `Array(9).fill(null)`, um ein leeres Spielfeld zu erstellen

let currentPlayer = 'x'; // Startspieler 'x'
let gameIsOver = false;

// Initialisierungsfunktion
function init() {
    render();
}

// Rendert das Spielfeld
function render() {
    const board = document.getElementById('board');

    let boardHTML = '';
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const cellHTML = `<div class="cell" onclick="handleCellClick(${i})">${field === 'x' ? generateAnimatedCrossSVG() : (field === 'o' ? generateAnimatedCircleSVG() : '')}</div>`;
        boardHTML += cellHTML;
    }

    board.innerHTML = boardHTML;
}

// Rendert ein einzelnes Spielfeld
function renderCell(index) {
    const cell = document.getElementsByClassName('cell')[index];
    cell.innerHTML = (fields[index] === 'x' ? generateAnimatedCrossSVG() : generateAnimatedCircleSVG());
}

// Behandelt den Klick auf ein Spielfeld
function handleCellClick(index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        renderCell(index);
        isGameWon();
    }
}

// Überprüft, ob das Spiel gewonnen wurde
function isGameWon() {
    setTimeout(function() {
        if (checkWinner(currentPlayer)) {
            alert(`Spieler ${currentPlayer} hat gewonnen!`);
            endGame();
        } else {
            currentPlayer = (currentPlayer === 'x' ? 'o' : 'x');
        }
    }, 300);
}

// Beendet das Spiel
function endGame() {
    gameIsOver = true; // Setze das Spiel auf beendet

    // Deaktiviere alle anderen Felder
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        if (fields[i] === null) {
            cells[i].onclick = null;
        }
    }
}

// Überprüft, ob ein Spieler gewonnen hat
function checkWinner(player) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (fields[a] === player && fields[b] === player && fields[c] === player) {
            return true;
        }
    }

    return false;
}

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
}

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