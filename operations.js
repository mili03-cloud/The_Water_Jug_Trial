/* ================= OPERATIONS ================= */

function fillA() {
    if (!gameActive) return;
    ensureTimerStarted();
    if (waterA < capA) {
        if (window.SoundEngine) SoundEngine.fill();
        const tapRect = tap.getBoundingClientRect();
        const jugRect = jugA.getBoundingClientRect();

        if (!(isColliding(jugRect, tapRect))) {
            animateJugToTap(jugA).then(clone => {
                return showStreamForJug(clone).then(() => {
                    try { const cw = clone.querySelector('.water'); if (cw) cw.style.height = '100%'; } catch (e) { }
                    waterA = capA;
                    moves++;
                    updateUI();
                    return new Promise(res => setTimeout(res, 320));
                }).then(() => {
                    checkGoal();
                    restoreJug(jugA);
                });
            });
        } else {
            showStreamForJug(jugA).then(() => {
                waterA = capA;
                moves++;
                updateUI();
                checkGoal();
            });
        }
    }
}

function fillB() {
    if (!gameActive) return;
    ensureTimerStarted();
    if (waterB < capB) {
        if (window.SoundEngine) SoundEngine.fill();
        const tapRect = tap.getBoundingClientRect();
        const jugRect = jugB.getBoundingClientRect();

        if (!(isColliding(jugRect, tapRect))) {
            animateJugToTap(jugB).then(clone => {
                return showStreamForJug(clone).then(() => {
                    try { const cw = clone.querySelector('.water'); if (cw) cw.style.height = '100%'; } catch (e) { }
                    waterB = capB;
                    moves++;
                    updateUI();
                    return new Promise(res => setTimeout(res, 320));
                }).then(() => {
                    checkGoal();
                    restoreJug(jugB);
                });
            });
        } else {
            showStreamForJug(jugB).then(() => {
                waterB = capB;
                moves++;
                updateUI();
                checkGoal();
            });
        }
    }
}

function pourAtoB() {
    if (!gameActive) return;
    ensureTimerStarted();
    let space = capB - waterB;
    let transfer = Math.min(space, waterA);

    if (transfer > 0) {
        if (window.SoundEngine) SoundEngine.pour();
        waterA -= transfer;
        waterB += transfer;
        moves++;
        updateUI();
        checkGoal();
    }
}

function pourBtoA() {
    if (!gameActive) return;
    ensureTimerStarted();
    let space = capA - waterA;
    let transfer = Math.min(space, waterB);

    if (transfer > 0) {
        if (window.SoundEngine) SoundEngine.pour();
        waterB -= transfer;
        waterA += transfer;
        moves++;
        updateUI();
        checkGoal();
    }
}

function emptyA() {
    if (waterA > 0) {
        if (window.SoundEngine) SoundEngine.empty();
        waterA = 0;
        moves++;
        updateUI();
    }
}

function emptyB() {
    if (waterB > 0) {
        if (window.SoundEngine) SoundEngine.empty();
        waterB = 0;
        moves++;
        updateUI();
    }
}

function clearAll() {
    waterA = 0;
    waterB = 0;
    moves = 0;

    // clear input fields
    const cA = document.getElementById('capAInput');
    const cB = document.getElementById('capBInput');
    const gI = document.getElementById('goalInput');
    if (cA) cA.value = '';
    if (cB) cB.value = '';
    if (gI) gI.value = '';

    updateUI();
}

function applySettings() {
    const ca = parseInt(document.getElementById('capAInput').value, 10) || capA;
    const cb = parseInt(document.getElementById('capBInput').value, 10) || capB;
    const g = parseInt(document.getElementById('goalInput').value, 10) || goal;

    capA = Math.max(1, ca);
    capB = Math.max(1, cb);
    goal = Math.max(1, g);

    // clamp current water to new capacities
    if (waterA > capA) waterA = capA;
    if (waterB > capB) waterB = capB;

    updateUI();
}

/* ================= GOAL CHECK & END GAME ================= */

function checkGoal() {
    if (!gameActive) return;
    if (waterA === goal || waterB === goal) {
        // reached goal — stop immediately and show modal
        gameActive = false;
        stopTimer();
        showGoalModal();
    }
}

function showGoalModal() {
    const elapsed = getElapsedMs();
    const timeText = formatTime(elapsed);

    const overlay = document.createElement('div');
    overlay.className = 'goal-overlay';

    const box = document.createElement('div');
    box.className = 'goal-modal';

    const eyebrow = document.createElement('p');
    eyebrow.innerText = '✦  The Sacred Volume is Reached  ✦';
    eyebrow.style.cssText = `
        font-family: 'Cinzel', serif;
        font-size: 0.6rem;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: rgba(140, 200, 255, 0.6);
        margin-bottom: 14px;
    `;

    const title = document.createElement('h2');
    title.innerText = 'Trial Complete!';
    title.style.cssText = `
        font-family: 'Cinzel', serif;
        font-size: 1.8rem;
        font-weight: 900;
        letter-spacing: 3px;
        background: linear-gradient(135deg, #c8e8ff, #7ec6ff, #ffd060);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 16px;
    `;

    const info = document.createElement('p');
    info.innerText = `Moves: ${moves}  ·  Time: ${timeText}`;
    info.style.cssText = `
        font-family: 'Raleway', sans-serif;
        font-size: 0.95rem;
        font-weight: 400;
        color: rgba(180, 210, 255, 0.6);
        letter-spacing: 2px;
        margin-bottom: 28px;
    `;

    const btn = document.createElement('button');
    btn.innerText = 'Play Again';
    btn.style.cssText = `
        padding: 11px 34px;
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
        border: 1px solid rgba(80, 140, 255, 0.3);
        border-radius: 5px;
        background: linear-gradient(135deg, #1a4fa0, #2a72e0);
        color: #d8eeff;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(30, 80, 200, 0.35);
        transition: all 0.25s;
    `;
    btn.onmouseover = () => btn.style.boxShadow = '0 6px 28px rgba(40,100,255,0.5)';
    btn.onmouseout = () => btn.style.boxShadow = '0 4px 20px rgba(30, 80, 200, 0.35)';
    btn.addEventListener('click', () => { location.reload(); });

    box.appendChild(eyebrow);
    box.appendChild(title);
    box.appendChild(info);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    // spawn confetti around the tap if available
    try {
        const t = tap.getBoundingClientRect();
        const nozzleX = t.left + t.width * 0.52;
        const nozzleY = t.bottom - 5;
        if (window.spawnConfetti) spawnConfetti(60, nozzleX, nozzleY);
        else if (window.gsap) spawnConfetti(60, nozzleX, nozzleY);
        else spawnConfetti(40);
    } catch (e) { spawnConfetti(40); }
}
