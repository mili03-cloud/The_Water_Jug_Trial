/* ================= STATE ================= */

let capA = 0;
let capB = 0;
let goal = 0;

let waterA = 0;
let waterB = 0;

let moves = 0;

// game control
let gameActive = true;

// timer
let _timerStart = null;
let _elapsedBefore = 0; // ms

function ensureTimerStarted() {
    if (_timerStart === null) {
        _timerStart = Date.now();
    }
}

function stopTimer() {
    if (_timerStart !== null) {
        _elapsedBefore += Date.now() - _timerStart;
        _timerStart = null;
    }
}

function getElapsedMs() {
    if (_timerStart !== null) return _elapsedBefore + (Date.now() - _timerStart);
    return _elapsedBefore;
}

function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
}

/* UI update */
function updateUI() {
    const wa = document.getElementById("waterA");
    const wb = document.getElementById("waterB");
    if (wa) wa.style.height = capA > 0 ? (waterA / capA) * 100 + "%" : "0%";
    if (wb) wb.style.height = capB > 0 ? (waterB / capB) * 100 + "%" : "0%";

    const moveEl = document.getElementById("moveCount");
    if (moveEl) moveEl.innerText = moves;

    const amountA = document.getElementById("amountA");
    const amountB = document.getElementById("amountB");
    if (amountA) amountA.innerText = capA > 0 ? `${waterA} / ${capA}` : `0 / 0`;
    if (amountB) amountB.innerText = capB > 0 ? `${waterB} / ${capB}` : `0 / 0`;

    const goalEl = document.getElementById("goalDisplay");
    if (goalEl) goalEl.innerText = goal > 0 ? goal : "—";
}

// DOM element references (kept in state so other modules can use them)
const jugA = document.getElementById("jugA");
const jugB = document.getElementById("jugB");
const tap = document.getElementById("tap");

// buttons and inputs (optional wiring happens in drag.js)
const fillABtn = document.getElementById('fillABtn');
const emptyABtn = document.getElementById('emptyABtn');
const fillBBtn = document.getElementById('fillBBtn');
const emptyBBtn = document.getElementById('emptyBBtn');
const pourABtn = document.getElementById('pourABtn');
const pourBBtn = document.getElementById('pourBBtn');
const clearBtn = document.getElementById('clearBtn');
const setBtn = document.getElementById('setBtn');
